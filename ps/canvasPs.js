//抠图 js 类-----基于canvas
function CanvasPs(c){
    this.c=c;//canvas
    this.ct=c.getContext('2d');
    this.n_data=null;//新数据
    this.o_data=null;//原始数据
    this.data;//直接数据，保存可用
    this.alw=0;//容差
    this.animation=null;//选区视效
    this.sample=null;//采样点
    this.select=false;//选择状态
    this.mode=0;//0-正常 1-画笔 2-橡皮擦 3-裁剪 4-调色 5-移动画布 6-缩放画布
    if(c==null){
        return;
    }
    //鼠标交互
    this.c.onmousedown = function (e) {

    }
    this.c.onmouseup = function (e) {

    }
    this.c.onmousemove = function (e) {

    }
    this.c.ondblclick = function (e) {
        
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
CanvasPs.prototype.mouseup=function(){
    
}