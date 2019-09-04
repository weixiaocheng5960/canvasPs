//抠图 js 类-----基于canvas
/*
    作者：姜宏
    时间：2018-12-20
    备注：欢迎大家使用，帮忙优化。本人是新手，自然入不了大神的法眼。但是乐意接受任何评论。
    联系：weixn jherhao
*/
function CanvasPs(c){
    var canvasps=this;//
    this.c=c;//canvas
    this.ct=c.getContext('2d');
    this.n_data=null;//新数据
    this.o_data=null;//原始数据
    this.data;//直接数据，保存可用
    this.alw=0;//容差
    this.animation=null;//选区视效
    this.sample=null;//采样点
    this.select=false;//当前选择采样点
    this.select_type=0;//0-颜色选择 1-多边形
    this.selectdata=null;//当前选择数据
    this.imgsrc=null;//临时存在img对象
    this.lastmode=0;//上次使用的模式
    this.polygoncallback=null;//多边形回调
    this.pickercallback=null;//拾色器回调
    this.config={
        mode:0,
        /*
        0-正常 1-魔术棒 2-画笔 3-橡皮擦 4-裁剪 5-调色
         6-移动画布 7-缩放画布 8-填充 9-铅笔 10-画笔抠图
         11-多边形选择 12--拾色器
        */
        pen:{
            color:'rgba(255,0,0,1)',
            colors:[255,0,0,1],
            size:10,
            status:0,
        },
        canvas:{
            scale:100,
            show:true,
            backgruond:'none',
            x:this.c.offsetX,
            y:this.c.offsetY,
        },
        mouse:{
            status:1,//0-按下 1-松开 2-移动
            down:{
                x:0,
                y:0,
            },
            up:{
                x:0,
                y:0,
            },
            move:{
                x:0,
                y:0,
            },
            cutBox:{
                status:1,//0-按下 1-松开 2-移动 3-调整
                down:{
                    x:0,
                    y:0,
                    ox:0,
                    oy:0,
                },
                up:{
                    x:0,
                    y:0,
                },
                move:{
                    x:0,
                    y:0,
                },
            },
        },
        touch:{
            canvas:{
                status:1,//0-按下 1-松开 2-移动
                down:{
                    x:0,
                    y:0,
                },
                up:{
                    x:0,
                    y:0,
                },
                move:{
                    x:0,
                    y:0,
                },
            },
            timer:null,
        },
        elements:{
            cutBox:document.createElement('div'),
        },
        history:[
            {
                title:'开始',
                data:this.ct.getImageData(0,0,this.c.width,this.c.height),
            }
        ],//最大10

    }
    //裁剪框
    if(document.querySelectorAll('.canvas-ps-warp').length>0){
        document.querySelectorAll('.canvas-ps-warp')[0].style.position= 'relative';
        this.config.elements.cutBox.className='pscut-box';
        this.config.elements.cutBox.title='双击确定';
        document.querySelectorAll('.canvas-ps-warp')[0].appendChild(this.config.elements.cutBox); 
        this.config.elements.cutBox.onmouseup=function(e){
            canvasps.config.mouse.status=1;
            canvasps.config.mouse.cutBox.status=1;
        }
        this.config.elements.cutBox.onmousedown=function(e){
            if((e.offsetY>this.offsetHeight-12)||(e.offsetX>this.offsetWidth-12)){
                canvasps.config.mouse.cutBox.status=3;
            }else{
                canvasps.config.mouse.cutBox.status=0;
            }
            canvasps.config.mouse.cutBox.down.x=e.pageX-this.offsetLeft;
            canvasps.config.mouse.cutBox.down.y=e.pageY-this.offsetTop;
            canvasps.config.mouse.cutBox.down.ox=e.offsetX;
            canvasps.config.mouse.cutBox.down.oy=e.offsetY;
        }
        this.config.elements.cutBox.onmousemove=function(e){
            canvasps.mouseWork.moveCuttingBox(e.pageX-canvasps.config.mouse.cutBox.down.x,e.pageY-canvasps.config.mouse.cutBox.down.y,canvasps);
        }
        // 调整裁剪框大小
        this.config.elements.cutBox.onclick=function(e){
            if(e.offsetX<80&&e.offsetY<0){
                //宽度
                var nw;
                var nh;
                if(e.offsetX>14&&e.offsetX<26){
                    nw=this.offsetWidth-6;
                    this.style.width=nw+'px';
                }else if(e.offsetX>28&&e.offsetX<32){
                    nw=this.offsetWidth+6;
                    this.style.width=nw+'px';
                }
                // 高度
                else if(e.offsetX>54&&e.offsetX<68){
                    nh=this.offsetHeight-6;
                    this.style.height=nh+'px';
                }else if(e.offsetX>68&&e.offsetX<80){
                    nh=this.offsetHeight+6;
                    this.style.height=nh+'px';
                }
            }
        }
        //确定裁剪
        this.config.elements.cutBox.ondblclick=function(e){
            if(e.offsetX<80&&e.offsetY<0){
                return;
            }
            var rx=this.offsetLeft/(canvasps.config.canvas.scale/100)-parseInt(canvasps.c.style.left)/(canvasps.config.canvas.scale/100);
            var ry=this.offsetTop/(canvasps.config.canvas.scale/100)-parseInt(canvasps.c.style.top)/(canvasps.config.canvas.scale/100);
            var rw=this.offsetWidth/(canvasps.config.canvas.scale/100);
            var rh=this.offsetHeight/(canvasps.config.canvas.scale/100);
            canvasps.imgCutting(rx,ry,rw,rh,canvasps);
            canvasps.scaleCanvas(canvasps.config.canvas.scale,canvasps);
            canvasps.upData();
            canvasps.addHistory({title:'裁剪',data:canvasps.data})
            //恢复裁剪框
            canvasps.showCuttingBox(false,canvasps);
            // console.log(rx,ry);
        }
    }else{
        console.log('必须在 canvas-ps-warp 类名下直接子元素 与canvas同级的块元素才可正常使用裁剪');
    }
    this.c.style.position='absolute';
    //-----画板----鼠标交互
    this.c.onmousedown = function (e) {
        e.preventDefault();
        canvasps.config.mouse.status=0;
        canvasps.config.canvas.x=e.pageX-this.offsetLeft;
        canvasps.config.canvas.y=e.pageY-this.offsetTop;
        canvasps.config.mouse.down.x=e.pageX-80;
        canvasps.config.mouse.down.y=e.pageY;
        if (canvasps.config.mode==4) {
            canvasps.showCuttingBox(true,canvasps);
        }else if(canvasps.config.mode==9){
            canvasps.ct.lineCap='round';
            canvasps.ct.strokeStyle=ps.config.pen.color;
            canvasps.ct.lineWidth=canvasps.config.pen.size;
            canvasps.ct.beginPath();
        }else if(canvasps.config.mode==10){
            canvasps.ct.lineCap='round';
            canvasps.ct.strokeStyle=ps.config.pen.color;
            canvasps.ct.lineWidth=0.1;
            canvasps.ct.beginPath();
            canvasps.imgsrc=ps.c.toDataURL();
        }
        canvasps.polygon(e.offsetX / (canvasps.config.canvas.scale / 100), e.offsetY / (canvasps.config.canvas.scale / 100),canvasps,e.which);
        // console.log(e.which)
    }
    this.c.onmouseup = function (e) {
        canvasps.config.mouse.status=1;
        canvasps.config.mouse.cutBox.status=1;
        switch(canvasps.config.mode){
            case 0:
            break;
            case 1:
            break;
            case 2:
            canvasps.upData();
            canvasps.addHistory({title:'笔刷',data:canvasps.data})
            break;
            case 3:
            canvasps.upData();
            canvasps.addHistory({title:'擦除',data:canvasps.data})
            break;
            case 4:
            
            case 5:
            
            break;
            case 6:
            
            break;
            case 7:
            
            break;
            case 8:
            
            break;
            case 9:
            canvasps.upData();
            canvasps.addHistory({title:'铅笔',data:canvasps.data})
            break;
            case 10:
            canvasps.pencutdata(ps);//保存抠图结果
            canvasps.upData();
            canvasps.addHistory({title:'抠图',data:canvasps.data})
            break;
            case 12:
            if (e.which===3) {
                if (canvasps.pickercallback) {
                    canvasps.pickercallback(true);
                }
            }
            break;
        }
    }
    this.c.oncontextmenu=function(e) {
        e.preventDefault();
    }
    this.c.onmousemove = function (e) {
        switch(canvasps.config.mode){
            case 0:
            break;
            case 1:
            break;
            case 2:
            canvasps.mouseWork.draw(e.layerX,e.layerY,canvasps);
            break;
            case 3:
            canvasps.mouseWork.clear(e.layerX,e.layerY,canvasps);
            break;
            case 4:
            canvasps.mouseWork.cutting(e.layerX+parseInt(canvasps.c.style.left),e.layerY+parseInt(canvasps.c.style.top),canvasps);
            break;
            case 5:
            // canvasps.mouseWork.cutting(e.layerX,e.layerY,canvasps);
            break;
            case 6:
            canvasps.mouseWork.moveCanvas(e.pageX-canvasps.config.canvas.x,e.pageY-canvasps.config.canvas.y,canvasps);
            break;
             case 7:
            break;
             case 8:
            break;
            case 9:
            canvasps.mouseWork.pencil(e.layerX,e.layerY,canvasps);
            break;
            case 10:
            canvasps.mouseWork.pencut(e.layerX,e.layerY,canvasps);
            break;
            case 12:
            canvasps.mouseWork.pickercolor(e.layerX-parseInt(canvasps.c.style.left),e.layerY-parseInt(canvasps.c.style.top),canvasps);
            break;
        }
    }
    this.c.ondblclick = function (e) {
        ps.wand(e.offsetX / (canvasps.config.canvas.scale / 100), e.offsetY / (canvasps.config.canvas.scale / 100));
    }
    this.ready();
    this.upData();
}
//初始化
CanvasPs.prototype.ready=function(){
    this.c.style.width=null;
    this.c.style.height=null;
    this.c.style.left=0;
    this.c.style.top=0;
    this.data=this.ct.getImageData(0,0,this.c.width,this.c.height);
    this.n_data = this.ct.getImageData(0, 0, this.c.width, this.c.height);
    this.o_data = this.ct.getImageData(0, 0, this.c.width, this.c.height);
    this.config.history[0].data=this.ct.getImageData(0,0,this.c.width,this.c.height);
}
//设置模式
CanvasPs.prototype.setMode=function(mode,callback){
    if (mode===11) {
        this.lastmode=mode;
    }else{
        this.lastmode=this.config.mode*1;
    }
    
    this.config.mode=mode;

    switch(mode){
        case 4:
        this.c.style.cursor="crosshair";
        this.showCuttingBox(true,this);
        break;
        case 6:
        this.c.style.cursor="move";
        break;
        case 11:
        this.c.style.cursor="default";
        this.ct.beginPath();//开启多边形
        this.ct.fillStyle=this.config.pen.color;
        this.ct.strokeStyle=this.config.pen.color;
        this.ct.lineWidth=this.config.pen.size/10;
        break;
        case 12:
        this.c.style.cursor="crosshair";
        break;
        default:
        this.c.style.cursor="default";
        break;
    }
    if(mode!=4){
        this.showCuttingBox(false,this);
    }
    if(mode!=8){
        this.stopAnimate();
    }
    if (callback) {
        this.polygoncallback=callback;
    }
}
//根据数据重绘图像
CanvasPs.prototype.redraw = function(ps,data) {
    var img=new Image();
    var canvas=document.createElement('canvas');
    canvas.width=ps.c.width;
    canvas.height=ps.c.height;
    var ct=canvas.getContext('2d');
    ct.putImageData(data,0,0);
    img.src=canvas.toDataURL();
    img.onload=function(){
        ps.ct.drawImage(img,0,0);
        ps.selectdata=ps.ct.getImageData(0,0,ps.c.width,ps.c.height);
    }
};
//获取选区内数据
CanvasPs.prototype.getareadata = function(ps,data) {
    var img=new Image();
    var canvas=document.createElement('canvas');
    canvas.width=ps.c.width;
    canvas.height=ps.c.height;
    var ct=canvas.getContext('2d');
    ct.putImageData(data,0,0);
    img.src=canvas.toDataURL();
    img.onload=function(){
        ps.ct.drawImage(img,0,0);
        ps.selectdata=ps.ct.getImageData(0,0,ps.c.width,ps.c.height);
        ps.ct.putImageData(data,0,0);
        ps.setpolygon(ps);
        ps.ct.restore();
    }
};
//获取模式
CanvasPs.prototype.getMode=function(){
    return this.config.mode;
}
// 获取操作历史
CanvasPs.prototype.getHistory=function(){
    return this.config.history;
}
//历史跳转
CanvasPs.prototype.goto=function(index){
    if (!this.config.history[index]) {
        return;
    }
    this.data = this.config.history[index].data;
    this.c.width=this.data.width;
    this.c.height=this.data.height;
    this.ct.putImageData(this.data,0,0);
    this.scaleCanvas(this.config.canvas.scale,this);
}
//添加历史
CanvasPs.prototype.addHistory=function(historyData){
    this.config.history.push(historyData);
    if(this.config.history.length>16){
        this.config.history.shift();
    }
}
// 显示隐藏裁剪框
CanvasPs.prototype.showCuttingBox=function(show,ps){
    if (show) {
        ps.config.elements.cutBox.style.display='block';
    }else{
        ps.config.elements.cutBox.style.left='-200px';
        ps.config.elements.cutBox.style.width='0';
        ps.config.elements.cutBox.style.height='0';
        ps.config.elements.cutBox.style.display='none';
    }
}
// 设置画笔颜色
CanvasPs.prototype.setColor=function(color){
    this.config.pen.color=color;
    var color_str=color;
    color_str=color_str.replace(/[rgba\(\)]/g,'');
    this.config.pen.colors=color_str.split(',');
}
// 获取画笔颜色
CanvasPs.prototype.getColor=function(){
    return this.config.pen.color
}
// 设置画笔大小
CanvasPs.prototype.setWidth = function (size) {
    this.config.pen.size = size;
}
//打开图片img对象
CanvasPs.prototype.openFile=function(file){
    this.img=new Image();
    try{
        this.img.src=URL.createObjectURL(file)
    }catch(e){
        console.log('必须是input的file对象！')
    }
    var canvasps=this;
    this.img.onload=function() {
        canvasps.loadImg();
        canvasps.ready();
        canvasps=null;
    }
}
//加载图片
CanvasPs.prototype.loadImg=function(){
    this.ct.clearRect(0,0,this.c.width,this.c.height);
    this.c.width=this.img.naturalWidth;
    this.c.height=this.img.naturalHeight;
    this.ct.drawImage(this.img,0,0);
    this.upData();
}
//获取原始图片
CanvasPs.prototype.getImg=function(){
    return this.img;
}
//获取保存数据
CanvasPs.prototype.get_save=function(){
    return this.data;
}
//采样点数据 ----处理--判断重复
CanvasPs.prototype.select_data=function(dd){
    if(this.sample){
        if(Math.abs(dd[0]-this.sample.data[0])==100){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
    
}
//多边形选择
CanvasPs.prototype.polygon = function(x,y,self,type) {
    if (self.config.mode===11&&type==1) {
        self.ct.arc(x,y,self.config.pen.size/10*2,0,Math.PI*2);
        self.ct.fill();
        self.ct.lineTo(x,y);
        self.ct.stroke();
    }else if (self.config.mode===11&&type==3) {
        //结束选择
        
        self.ct.closePath();
        self.ct.save();
        //创建选区
        self.ct.clearRect(0,0,self.c.width,self.c.height);//清除选择框
        self.ct.clip();
        self.getareadata(self,self.data);
        self.ct.restore();
        self.ct.clearRect(0,0,self.c.width,self.c.height);//清除选择框
        self.ct.save();
        // self.redraw(self,self.data);//还原数据
        self.ct.clip();
        self.ct.fillStyle='rgba(255,255,255,0.8)';
        self.ct.fillRect(0,0,self.c.width,self.c.height);//设置选择样式
        self.config.mode=0;
        if (self.polygoncallback) {
            if (typeof self.polygoncallback === "function") {
                self.polygoncallback();//回调函数
            }else{
                console.log('多边形选区回调函数错误！');
            }
            
        }
        
    }
};
//设置 多边形选区 样式
CanvasPs.prototype.setpolygon = function(ps) {
    ps.n_data=ps.ct.getImageData(0,0,ps.c.width,ps.c.height);
    for (var i = 0; i < ps.n_data.data.length; i+=4) {
        //选择区
        if(ps.n_data.data[i]===ps.selectdata.data[i]&&ps.n_data.data[i+1]===ps.selectdata.data[i+1]&&ps.n_data.data[i+2]===ps.selectdata.data[i+2]&&ps.n_data.data[i+3]===ps.selectdata.data[i+3]){
            if(ps.selectdata.data[i]!=0&&ps.selectdata.data[i+1]!=0&&ps.selectdata.data[i+2]!=0&&ps.selectdata.data[i+3]!=0){
                ps.n_data.data[i]=255;
                ps.n_data.data[i+1]=255;
                ps.n_data.data[i+2]=0;
                ps.n_data.data[i+3]=125;

            }
        }
    }
    this.select_type=1;
    this.selectAnimate();
};
//设置选区---魔术棒工具--默认只选择 闭合区间
CanvasPs.prototype.wand=function(sx,sy,all){
    this.select_type=0;
    this.stopAnimate();
    this.o_data = this.ct.getImageData(0, 0, this.c.width, this.c.height);
    var dat = this.ct.getImageData(sx, sy, 1, 1);//采集数据
    if (this.select_data(dat)) {
        return [];
    } else {
        this.sample = dat;
    }
    this.n_data = this.ct.getImageData(0, 0, this.c.width, this.c.height);
    for (var i = 0; i < this.data.data.length; i += 4) {
        //选择区
        if (Math.abs(this.n_data.data[i] - dat.data[0]) <= this.alw && Math.abs(this.n_data.data[i + 1] - dat.data[1]) <= this.alw && Math.abs(this.n_data.data[i + 2] - dat.data[2]) <= this.alw && Math.abs(this.n_data.data[i + 3] - dat.data[3]) <= this.alw) {
            if (this.n_data.data[i + 3] > 150) {
                this.n_data.data[i + 3] = dat.data[3] - 100;
            } else {
                this.n_data.data[i + 3] = dat.data[3] + 100;
            }
            if (this.n_data.data[i + 3] != 0) {
                this.n_data.data[i + 1] = dat.data[0];
                this.n_data.data[i + 2] = dat.data[1];
                this.n_data.data[i + 4] = dat.data[2];
            } else {
                this.n_data.data[i] = 100;
                this.n_data.data[i + 1] = 100;
                this.n_data.data[i + 4] = 100;
            }
            var rc = 150;
            if (Math.abs(this.n_data.data[i] - 255) < rc && Math.abs(this.n_data.data[i + 1] - 255) < rc && Math.abs(this.n_data.data[i + 2] - 255) < rc && Math.abs(this.n_data.data[i + 3] - 255) < rc) {
                this.n_data.data[i + 0] = 255;
                this.n_data.data[i + 1] = 0;
                this.n_data.data[i + 2] = 0;
                this.n_data.data[i + 2] = 200;
            }
        }
        //非选择区
    }
    this.selectAnimate();
}
// 选区闪烁提示
CanvasPs.prototype.selectAnimate=function(){
    var cps=this;
    var toggle = true;
    this.select = true;
    this.animation=setInterval(function(){
        if (toggle) {
            cps.ct.putImageData(cps.n_data, 0, 0);
            toggle = false;
        } else {
            cps.ct.putImageData(cps.data, 0, 0);
            toggle = true;
        }
        // console.log('选择')
    }, 500);
}
// 选区闪烁提示关闭
CanvasPs.prototype.stopAnimate = function () {
    clearInterval(this.animation);
    this.select = false;
    this.ct.putImageData(this.data,0,0);
}
//设置容差
CanvasPs.prototype.setAlw=function(a){
    this.alw=a;
}
//重置画布
CanvasPs.prototype.reMake = function (a) {
    this.data=this.o_data;
    this.config.history=[];
    this.addHistory({title:'开始',data:this.data});
    this.goto(0);
}
//缩放画布
CanvasPs.prototype.scaleCanvas=function(size,ps){
    var cw=c.width;
    var ch=c.height;
    if(this.config.canvas.scale){
        this.config.canvas.scale=size;
    }else if(ps){
        ps.config.canvas.scale=size;
    }
    c.style.width=cw*(size/100)+"px";
    c.style.height=ch*(size/100)+"px";
}
//删除选区
CanvasPs.prototype.clearSelect=function(){
    
    if (this.lastmode===11&&this.select_type===1) {
        //多边形选择
        if (this.selectdata) {
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'删除',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if(this.data.data[i]===this.selectdata.data[i]&&this.data.data[i+1]===this.selectdata.data[i+1]&&this.data.data[i+2]===this.selectdata.data[i+2]&&this.data.data[i+3]===this.selectdata.data[i+3]){
                    this.data.data[i]=0;
                    this.data.data[i+1]=0;
                    this.data.data[i+2]=0;
                    this.data.data[i+3]=0;
                }
            }
            this.ct.putImageData(this.data,0,0);
            this.ct.restore();
        }
    }else{
        //颜色选择
        if(this.select&&this.sample){
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'删除',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if(Math.abs(this.data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.data.data[i+3]-dat.data[3])<=this.alw){
                    this.data.data[i]=0;
                    this.data.data[i+1]=0;
                    this.data.data[i+2]=0;
                    this.data.data[i+3]=0;                  
                }
            }
            this.ct.putImageData(this.data,0,0);
        }

    }
}
//填充选区
CanvasPs.prototype.fillSelect=function(){
    var color=this.config.pen.colors;
    
    if (this.select&&this.select_type===1&&this.selectdata) {

        //多边形选择
        if (this.selectdata) {
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'填充',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if((this.selectdata.data[i]!=0&&this.selectdata.data[i+1]!=0&&this.selectdata.data[i+2]!=0&&this.selectdata.data[i+3]!=0)&&(this.data.data[i]===this.selectdata.data[i]&&this.data.data[i+1]===this.selectdata.data[i+1]&&this.data.data[i+2]===this.selectdata.data[i+2]&&this.data.data[i+3]===this.selectdata.data[i+3])){
                    this.data.data[i]=color[0];
                    this.data.data[i+1]=color[1];
                    this.data.data[i+2]=color[2];
                    this.data.data[i+3]=color[3]*255;
                }
            }
            this.ct.putImageData(this.data,0,0);
            this.ct.restore();
        }
    }else{
        //颜色选择
        if(this.select&&this.sample){
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'填充',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if(Math.abs(this.data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.data.data[i+3]-dat.data[3])<=this.alw){
                    this.data.data[i]=color[0];
                    this.data.data[i+1]=color[1];
                    this.data.data[i+2]=color[2];
                    this.data.data[i+3]=color[3]*255;             
                }
            }
            this.ct.putImageData(this.data,0,0);
        }

    }
}
//更新标准data数据
CanvasPs.prototype.upData=function(ps){
    if(ps){
        ps.data=ps.ct.getImageData(0,0,ps.c.width,ps.c.height);
        ps.ct.putImageData(ps.data,0,0);
    }else if(this.data){
        this.data=this.ct.getImageData(0,0,this.c.width,this.c.height);
        this.ct.putImageData(this.data,0,0);
    }
}
//调节颜色
CanvasPs.prototype.colorControl = function(color) {
    if (this.select&&this.select_type===1) {
        //多边形选择
        if (this.selectdata) {
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'调色',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if(this.data.data[i]===this.selectdata.data[i]&&this.data.data[i+1]===this.selectdata.data[i+1]&&this.data.data[i+2]===this.selectdata.data[i+2]&&this.data.data[i+3]===this.selectdata.data[i+3]){
                    this.data.data[i]=color[0];
                    this.data.data[i+1]=color[1];
                    this.data.data[i+2]=color[2];
                    // this.data.data[i+3]=0;
                }
            }
            this.ct.putImageData(this.data,0,0);
            this.ct.restore();
        }
    }
    else{
        if (this.select&&this.sample) {
            this.stopAnimate();
            this.upData();
            this.addHistory({title:'调色',data:this.data})
            var dat=this.sample;
            for (var i = 0; i < this.data.data.length; i+=4) {
                //选择区
                if(Math.abs(this.data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.data.data[i+3]-dat.data[3])<=this.alw){
                    this.data.data[i]=color[0];
                    this.data.data[i+1]=color[1];
                    this.data.data[i+2]=color[2];
                    this.data.data[i+3]=color[3];             
                }
            }
            this.ct.putImageData(this.data,0,0);
        }
        
    }
    
}
//输出 JPEG 格式
CanvasPs.prototype.save_jpg=function() {
    var img_data=this.ct.getImageData(0,0,this.c.width,this.c.height);
    for (var i = 0; i < img_data.data.length; i+=4) {
        //选择区
        if(img_data.data[i+3]==0){
            img_data.data[i]=255;
            img_data.data[i+1]=255;
            img_data.data[i+2]=255;
            img_data.data[i+3]=255;                 
        }
    }
    return img_data;
}
//裁剪 ----图片
CanvasPs.prototype.imgCutting=function(x,y,w,h,ps) {
    ps.data=ps.ct.getImageData(x,y,w,h);
    ps.c.width=w;
    ps.c.height=h;
    ps.c.style.left=0;
    ps.c.style.top=0;
    ps.ct.putImageData(ps.data,0,0);
}
//移动画布
CanvasPs.prototype.moveCanvas=function(x,y){
    this.c.style.left=x+"px";
    this.c.style.top=y+"px";
}
// 鼠标移动执行操作
CanvasPs.prototype.mouseWork=({
    //涂鸦
    draw:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            ps.ct.fillStyle=ps.config.pen.color;
            ps.ct.fillRect(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100),ps.config.pen.size,ps.config.pen.size);
        }
    },
    //铅笔
    pencil:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            
            ps.ct.lineTo(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100));
            ps.ct.stroke();
        }
    },
    //铅笔抠图
    pencut:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            ps.ct.lineTo(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100));
            ps.ct.stroke();
        }
    },
    //橡皮擦
    clear:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            ps.ct.clearRect(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100),ps.config.pen.size,ps.config.pen.size);
        }
    },
    //颜色拾取
    pickercolor:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            var color=ps.ct.getImageData(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100),1,1).data;
            ps.setColor('rgba('+color[0]+','+color[1]+','+color[2]+','+color[3]);
            if (ps.pickercallback) {
                ps.pickercallback(false);
            }
        }
    },
    //裁剪过程
    cutting:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            var ww=Math.abs(ps.config.mouse.down.x-x);
            var hh=Math.abs(ps.config.mouse.down.y-y);
            if (ps.config.mouse.down.x<x) {
                if (ps.config.mouse.down.y<y) {
                    ps.config.elements.cutBox.style.left=ps.config.mouse.down.x+"px";
                    ps.config.elements.cutBox.style.top=ps.config.mouse.down.y+"px";
                    ps.config.elements.cutBox.style.width=ww+"px";
                    ps.config.elements.cutBox.style.height=hh+"px";
                }else{
                    ps.config.elements.cutBox.style.left=ps.config.mouse.down.x+"px";
                    ps.config.elements.cutBox.style.top=y+"px";
                    ps.config.elements.cutBox.style.width=ww+"px";
                    ps.config.elements.cutBox.style.height=hh+"px";
                }
            }else{
                if (ps.config.mouse.down.y<y) {
                    ps.config.elements.cutBox.style.left=x+"px";
                    ps.config.elements.cutBox.style.top=ps.config.mouse.down.y+"px";
                    ps.config.elements.cutBox.style.width=ww+"px";
                    ps.config.elements.cutBox.style.height=hh+"px";
                }else{
                    ps.config.elements.cutBox.style.left=x+"px";
                    ps.config.elements.cutBox.style.top=y+"px";
                    ps.config.elements.cutBox.style.width=ww+"px";
                    ps.config.elements.cutBox.style.height=hh+"px";
                }
            }
        }
    },
    // 移动裁剪框
    moveCuttingBox:function(x,y,ps){
        if(ps.config.mouse.cutBox.status==0){
            var rx=parseInt(ps.c.style.left);
            var ry=parseInt(ps.c.style.top);
            if(x+ps.config.elements.cutBox.offsetWidth<=ps.c.offsetWidth+rx && x>=rx){
                ps.config.elements.cutBox.style.left=x+'px';
                
            }
            if(y+ps.config.elements.cutBox.offsetHeight<=ps.c.offsetHeight+ry && y>=ry){
                ps.config.elements.cutBox.style.top=y+'px';
            }
        }
    },
    
    // 移动画布
    moveCanvas:function(x,y){
        if (ps.config.mouse.status==0) {
            ps.c.style.left=x+"px";
            ps.c.style.top=y+"px";
        }
    },
})
CanvasPs.prototype.pencutdata = function(ps) {
    ps.ct.closePath();
    ps.ct.stroke();
    ps.ct.save();
    ps.ct.clip();
    ps.ct.clearRect(0,0,ps.c.width,ps.c.height);
    ps.ct.restore();
};