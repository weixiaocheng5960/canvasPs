//抠图 js 类-----基于canvas
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
    this.select=false;//选择状态
    this.config={
        mode:0,//0-正常 1-魔术棒 2-画笔 3-橡皮擦 4-裁剪 5-调色 6-移动画布 7-缩放画布 
        pen:{
            color:'red',
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
        },
        elements:{
            cutBox:document.createElement('div'),
        },

    }
    //裁剪框
    if(document.querySelectorAll('.canvas-ps-warp').length>0){
        this.config.elements.cutBox.className='pscut-box';
        document.querySelectorAll('.canvas-ps-warp')[0].appendChild(this.config.elements.cutBox); 
        this.config.elements.cutBox.onmouseup=function(e){
            canvasps.config.mouse.status=1;
            canvasps.config.mouse.cutBox.status=1;
        }
        this.config.elements.cutBox.onmousedown=function(e){
            canvasps.config.mouse.cutBox.status=0;
            canvasps.config.mouse.cutBox.down.x=e.offsetX-this.offsetLeft;
            canvasps.config.mouse.cutBox.down.y=e.offsetY-this.offsetTop;
        }
        this.config.elements.cutBox.onmousemove=function(e){
            canvasps.mouseWork.moveCuttingBox(e.offsetX,e.offsetY,canvasps);
        }
    }else{
        console.log('必须在 canvas-ps-warp 类名下直接子元素 与canvas同级的块元素才可正常使用裁剪');
    }
    if(c==null){
        return;
    }
    //鼠标交互
    this.c.onmousedown = function (e) {
        e.preventDefault();
        canvasps.config.mouse.status=0;
        canvasps.config.canvas.x=e.pageX-this.offsetLeft;
        canvasps.config.canvas.y=e.pageY-this.offsetTop;
        canvasps.config.mouse.down.x=e.pageX-80;
        canvasps.config.mouse.down.y=e.pageY;
        //绘制 开始
        // if (cutting) {
        //     cut_mouse[0]=e.layerX;
        //     cut_mouse[1]=e.layerY;
        // }
    }
    this.c.onmouseup = function (e) {
        canvasps.config.mouse.status=1;
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
            canvasps.mouseWork.cutting(e.layerX,e.layerY,canvasps);
            break;
        }
    }
    this.c.ondblclick = function (e) {
        ps.wand(e.offsetX / (scale / 100), e.offsetY / (scale / 100));
    }
}
//初始化
CanvasPs.prototype.ready=function(){
    this.c.style.width=null;
    this.c.style.height=null;
    this.c.style.left=0;
    this.c.style.top=0;
    this.w = c.width;
    this.h = c.height;
    this.data=this.ct.getImageData(0,0,this.w,this.h);
    this.n_data = this.ct.getImageData(0, 0, this.w, this.h);
    this.o_data = this.ct.getImageData(0, 0, this.w, this.h);
    
}
//设置模式
CanvasPs.prototype.setMode=function(mode){
    this.config.mode=mode;
    switch(mode){
        case 4:
        this.config.elements.cutBox.style.display='block';
        break;
    }
    if(mode!=4){
        this.config.elements.cutBox.style.left='-20px';
        this.config.elements.cutBox.style.width='0';
        this.config.elements.cutBox.style.height='0';
        this.config.elements.cutBox.style.display='none';
    }
}
//获取模式
CanvasPs.prototype.getMode=function(){
    return this.config.mode;
}
//打开文件
CanvasPs.prototype.open=function(filename){
    if (typeof filename!=='string') {
        console.log('请查看URL是否正确');
        return;
    }
    this.img=new Image();
    this.img.src=filename;
    var CanvasPs=this;
    this.img.onload=function() {
        CanvasPs.loadImg();
        CanvasPs.ready();
        CanvasPs=null;
    }
}
//打开图片img对象
CanvasPs.prototype.openFile=function(file){
    this.img=new Image();
    try{
        this.img.src=URL.createObjectURL(file)
    }catch(e){
        console.log('必须是input的file对象！')
    }
    var CanvasPs=this;
    this.img.onload=function() {
        CanvasPs.loadImg();
        CanvasPs.ready();
        CanvasPs=null;
    }
}
//加载图片
CanvasPs.prototype.loadImg=function(){
    this.ct.clearRect(0,0,this.c.width,this.c.height);
    this.c.width=this.img.naturalWidth;
    this.c.height=this.img.naturalHeight;
    this.ct.drawImage(this.img,0,0);
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
//设置选区---魔术棒工具--默认只选择 闭合区间
CanvasPs.prototype.wand=function(sx,sy,all){
    this.o_data = ct.getImageData(0, 0, this.w, this.h);
    var dat = ct.getImageData(sx, sy, 1, 1);//采集数据
    if (this.select_data(dat)) {
        return [];
    } else {
        this.sample = dat;
    }
    this.n_data = ct.getImageData(0, 0, this.w, this.h);
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

//删除选区
CanvasPs.prototype.clearSelect=function(){
    if(!this.select){
        return;
    }
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
    this.stopAnimate();
}
//调节颜色
CanvasPs.prototype.colorControl = function(color) {
    if (!this.select) {
        return;
    }
    var dat=this.sample;
    for (var i = 0; i < this.data.data.length; i+=4) {
        //选择区
        if(Math.abs(this.data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.data.data[i+3]-dat.data[3])<=this.alw){
            if (this.data.data[i]+parseInt(color[0])>255) {
                this.data.data[i]=255;
            }else if (this.data.data[i]+parseInt(color[0])<0) {
                this.data.data[i]=0;
            }else{
                this.data.data[i]+=parseInt(color[0]);
            }
            if (this.data.data[i+1]+parseInt(color[1])>255) {
                this.data.data[i+1]=255;
            }else if (this.data.data[i+1]+parseInt(color[1])<0) {
                this.data.data[i+1]=1;
            }else{
                this.data.data[i+1]+=parseInt(color[1]);
            }
            if (this.data.data[i+2]+parseInt(color[2])>255) {
                this.data.data[i+2]=255;
            }else if (this.data.data[i+2]+parseInt(color[2])<0) {
                this.data.data[i+2]=0;
            }else{
                this.data.data[i+2]+=parseInt(color[2]);
            }
            if (this.data.data[i+3]+parseInt(color[3])>255) {
                this.data.data[i+3]=255;
            }else if (this.data.data[i+3]+parseInt(color[3])<0) {
                this.data.data[i+3]=0;
            }else{
                this.data.data[i+3]+=parseInt(color[3]);
            }               
        }
    }
    this.stopAnimate();
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
CanvasPs.prototype.img_cut=function(x,y,w,h) {
    var temp_data=this.ct.getImageData(x,y,w,h);
    this.c.width=w;
    this.c.height=h;
    this.ct.putImageData(temp_data,0,0);
}
CanvasPs.prototype.mouseWork=({
    //涂鸦
    draw:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            ps.ct.fillStyle=ps.config.pen.color;
            ps.ct.fillRect(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100),ps.config.pen.size,ps.config.pen.size);
        }
    },
    //橡皮擦
    clear:function(x,y,ps){
        if (ps.config.mouse.status==0) {
            ps.ct.clearRect(x/(ps.config.canvas.scale/100),y/(ps.config.canvas.scale/100),ps.config.pen.size,ps.config.pen.size);
        }
    },
    //裁剪
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
            ps.config.elements.cutBox.style.left=(x-ps.config.mouse.cutBox.down.x)+'px';
            ps.config.elements.cutBox.style.top=(y-ps.config.mouse.cutBox.down.y)+'px';
        }
    },
})