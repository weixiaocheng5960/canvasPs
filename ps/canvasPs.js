//抠图 js 类-----基于canvas
function CanvasPs(c){
    this.c=c;//canvas
    this.ct=c.getContext('2d');
    this.s_toggle=false;//选区闪烁用
    this.n_data=null;//新数据
    this.o_data=null;//原始数据
    this.old_s=null;//上一次选择
    this.save_data;//直接数据，保存可用
    this.alw=0;//容差
    this.animation=null;//选区视效
    if(c==null){
        return;
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
    this.save_data=this.ct.getImageData(0,0,this.w,this.h);
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
    return this.save_data;
}
//取消选择
CanvasPs.prototype.set_s_none = function () {
    this.old_s=null;
}
//采样点数据 ----处理--判断重复
CanvasPs.prototype.select_data=function(dd){
    if(this.old_s){
        if(Math.abs(dd[0]-this.old_s.data[0])==100){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
    
}
//设置选区---魔术棒工具--默认只选择 闭合区间
CanvasPs.prototype.select=function(sx,sy,all){
    // this.o_data = this.ct.getImageData(0, 0, this.w, this.h);
    // var borderArea=false,index=sx*sy,opt=sx*sy,go=0;
    // var dat = this.ct.getImageData(sx, sy, 1, 1);//采集数据
    // while(!borderArea){
    //     if(Math.abs(this.n_data.data[index]-dat.data[0])<=this.alw&&Math.abs(this.n_data.data[index+1]-dat.data[1])<=this.alw&&Math.abs(this.n_data.data[index+2]-dat.data[2])<=this.alw&&Math.abs(this.n_data.data[index+3]-dat.data[3])<=this.alw){
    //         if(this.n_data.data[index+3]>150){
    //             this.n_data.data[index+3]=dat.data[3]-100;
    //         }else{
    //             this.n_data.data[index+3]=dat.data[3]+100;
    //         }
    //          if(this.n_data.data[index+3]!=0){
    //             this.n_data.data[index+1]=dat.data[0];
    //             this.n_data.data[index+2]=dat.data[1];
    //             this.n_data.data[index+4]=dat.data[2];
    //         }else{
    //             this.n_data.data[index]=100;
    //             this.n_data.data[index+1]=100;
    //             this.n_data.data[index+4]=100;
    //         }
    //         var rc=150;
    //         if (Math.abs(this.n_data.data[index]-255)<rc&&Math.abs(this.n_data.data[index+1]-255)<rc&&Math.abs(this.n_data.data[index+2]-255)<rc&&Math.abs(this.n_data.data[index+3]-255)<rc) {
    //             this.n_data.data[index+0]=255;
    //             this.n_data.data[index+1]=0;
    //             this.n_data.data[index+2]=0;
    //             this.n_data.data[index+2]=200;
    //         }
    //         if (go==0) {
    //             index += 4; 
    //         }else{
    //             index -= 4; 
    //         }
                     
    //     }else{
    //         if (go == 0){
    //             index = opt;
    //             go = 1;
    //         }else{
    //             borderArea=true;
    //         }
    //     }
    //     if (index>=this.c.width*this.c.height||index<0) {
    //         borderArea = true;
    //     }
    // }
    this.o_data = ct.getImageData(0, 0, this.w, this.h);
    var dat = ct.getImageData(sx, sy, 1, 1);//采集数据
    if (this.select_data(dat)) {
        console.log("已选择")
        return [];
    } else {
        this.old_s = dat;
    }
    this.n_data = ct.getImageData(0, 0, this.w, this.h);
    for (var i = 0; i < this.save_data.data.length; i += 4) {
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

    // return [this.o_data, this.n_data];
    // this.ct.putImageData(this.n_data, 0, 0);
    
    this.selectAnimate();
}
// 选区闪烁提示
CanvasPs.prototype.selectAnimate=function(){
    var cps=this;
    var toggle = true;
    this.animation=setInterval(function(){
        if (toggle) {
            cps.ct.putImageData(cps.n_data, 0, 0);
            toggle = false;
        } else {
            cps.ct.putImageData(cps.o_data, 0, 0);
            toggle = true;
        }
        
    }, 500);
}
// 选区闪烁提示关闭
CanvasPs.prototype.stopAnimate = function () {
    clearInterval(this.animation);
    this.ct.putImageData(this.o_data,0,0);
}
//设置容差
CanvasPs.prototype.setAlw=function(a){
    this.alw=a;
}
//获取数据
CanvasPs.prototype.getData=function(x,y){
    this.o_data=ct.getImageData(0,0,this.w,this.h);
    var dat=ct.getImageData(x,y,1,1);//采集数据
    if(this.select_data(dat)){
        console.log("已选择")
        return [];
    }else{
        this.old_s=dat;
    }
    this.n_data=ct.getImageData(0,0,this.w,this.h);
	for (var i = 0; i < this.save_data.data.length; i+=4) {
	    //选择区
	    if(Math.abs(this.n_data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.n_data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.n_data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.n_data.data[i+3]-dat.data[3])<=this.alw){
			if(this.n_data.data[i+3]>150){
				this.n_data.data[i+3]=dat.data[3]-100;
			}else{
				this.n_data.data[i+3]=dat.data[3]+100;
			}
             if(this.n_data.data[i+3]!=0){
                this.n_data.data[i+1]=dat.data[0];
                this.n_data.data[i+2]=dat.data[1];
                this.n_data.data[i+4]=dat.data[2];
            }else{
                this.n_data.data[i]=100;
                this.n_data.data[i+1]=100;
                this.n_data.data[i+4]=100;
            }
            var rc=150;
            if (Math.abs(this.n_data.data[i]-255)<rc&&Math.abs(this.n_data.data[i+1]-255)<rc&&Math.abs(this.n_data.data[i+2]-255)<rc&&Math.abs(this.n_data.data[i+3]-255)<rc) {
                this.n_data.data[i+0]=255;
                this.n_data.data[i+1]=0;
                this.n_data.data[i+2]=0;
                this.n_data.data[i+2]=200;
            }			
		}
				//非选择区
    }

    return [this.o_data,this.n_data];
}
//删除选区
CanvasPs.prototype.delet_s=function(){
    if(!this.old_s){
        return;
    }
    var dat=this.old_s;
    for (var i = 0; i < this.o_data.data.length; i+=4) {
	    //选择区
	    if(Math.abs(this.o_data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.o_data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.o_data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.o_data.data[i+3]-dat.data[3])<=this.alw){
            this.o_data.data[i]=0;
            this.o_data.data[i+1]=0;
			this.o_data.data[i+2]=0;
			this.o_data.data[i+3]=0;					
		}
    }
    this.stopAnimate();
}
//调节颜色
CanvasPs.prototype.alter_color = function(color) {
    if(!this.old_s){
        return;
    }
    var dat=this.old_s;
    for (var i = 0; i < this.save_data.data.length; i+=4) {
        //选择区
        if(Math.abs(this.save_data.data[i]-dat.data[0])<=this.alw&&Math.abs(this.save_data.data[i+1]-dat.data[1])<=this.alw&&Math.abs(this.save_data.data[i+2]-dat.data[2])<=this.alw&&Math.abs(this.save_data.data[i+3]-dat.data[3])<=this.alw){
            if (this.save_data.data[i]+parseInt(color[0])>255) {
                this.save_data.data[i]=255;
            }else if (this.save_data.data[i]+parseInt(color[0])<0) {
                this.save_data.data[i]=0;
            }else{
                this.save_data.data[i]+=parseInt(color[0]);
            }
            if (this.save_data.data[i+1]+parseInt(color[1])>255) {
                this.save_data.data[i+1]=255;
            }else if (this.save_data.data[i+1]+parseInt(color[1])<0) {
                this.save_data.data[i+1]=1;
            }else{
                this.save_data.data[i+1]+=parseInt(color[1]);
            }
            if (this.save_data.data[i+2]+parseInt(color[2])>255) {
                this.save_data.data[i+2]=255;
            }else if (this.save_data.data[i+2]+parseInt(color[2])<0) {
                this.save_data.data[i+2]=0;
            }else{
                this.save_data.data[i+2]+=parseInt(color[2]);
            }
            if (this.save_data.data[i+3]+parseInt(color[3])>255) {
                this.save_data.data[i+3]=255;
            }else if (this.save_data.data[i+3]+parseInt(color[3])<0) {
                this.save_data.data[i+3]=0;
            }else{
                this.save_data.data[i+3]+=parseInt(color[3]);
            }               
        }
    }
    return this.save_data;
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