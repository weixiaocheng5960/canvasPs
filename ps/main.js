//变量申明
var scale=100;//缩放
var c_p=[0,0];//画布位置
var pen=false;//画笔模式
var clear_pen=false;//橡皮擦模式
var cutting=false;//开启裁剪
var mouse_posi=[0,0];//鼠标事件初始位置
var cut_mouse=[0,0];//裁剪专用鼠标数据;
//打开文件
var input = document.createElement('input');
var img = document.createElement('img');
input.type = "file";
document.querySelectorAll('.menubtn')[0].onclick=function(){
    input.click();
}
input.onchange=function () {
    if (this.files[0]) {
        ps.openFile(this.files[0]);
    }
    
}
img.onload=function(){
    init();
}
//初始化 数据
function init() {
    
    document.querySelectorAll(".menu>input")[3].value=100;
    document.querySelectorAll(".menu>input")[2].value="#000000";
    document.querySelectorAll(".menu>input")[1].value=10;
    document.querySelectorAll(".menu>input")[0].value=0;
    ps.ready();
}
//测试图形---------欢迎 界面
function draw_test() {
    // 方块
    ct.fillStyle = '#F96652';
    ct.fillRect(40, 40, 200, 200);
    //圆
    ct.beginPath();
    ct.arc(350, 250, 80, 0, Math.PI * 2);
    ct.fillStyle = '#39E358';
    ct.fill();
    //多边形
    ct.beginPath();
    ct.moveTo(500, 350);
    ct.lineTo(750, 350);
    ct.lineTo(750, 220);
    ct.lineTo(650, 150);
    ct.lineTo(450, 190);
    ct.closePath();
    ct.fillStyle = "#7C3CF5";
    ct.fill();
    //小提示
    ct.beginPath();
    ct.fillStyle="#FFFFFF";
    ct.fillRect(320,380,200,40);
    ct.fillStyle="#61FCF4";
    ct.font="20px Arial";
    ct.fillText("双击进入像素选区",330,405);
    //文字
    ct.fillStyle="#1785F9";
    ct.font="100px Arial";
    ct.fillText("welcome",c.width/4,c.height-100);
    ct.fillStyle="#FF4BFD";
    ct.font="30px Arial";
    ct.fillText("在线抠图工具,简单方便 by-jianghong",c.width/5,c.height-50);
    ps.ready();
}
draw_test();
//默认设置------s
document.oncontextmenu = function(){
    return false;
}
var side_element=document.querySelectorAll(".menu>input");
for(var i=0;i<side_element.length;i++){
    // side_element[i].focus();
}
//默认设置------e
//鼠标交互
var ps_d=null;
var olddt,dt;//数据
var st=null;//选择效果
var m_down=false;//是否按钮鼠标
var data_img=document.createElement('img');//复制数据用
var data_m=null;//获取数据的位置
// c.ondblclick=function(e) {
//     ps.wand(e.offsetX / (scale / 100), e.offsetY / (scale / 100));
// }
// c.onmousedown = function (e) {
//     e.preventDefault();
//     m_down=true;
//     c_p[0]=e.pageX-c.offsetLeft;
//     c_p[1]=e.pageY-c.offsetTop;
//     mouse_posi[0]=e.pageX-80;
//     mouse_posi[1]=e.pageY;
//     //绘制 开始
//     if (cutting) {
//         cut_mouse[0]=e.layerX;
//         cut_mouse[1]=e.layerY;
//     }
// }
// c.onmouseup = function (e) {
//     m_down=false;
//     //绘制 结束
//     if (pen||clear_pen) {
//         // ps.ready();//更新PS类
//     }

// }
// c.onmousemove=function(e) {
//     if (m_down&&space) {
//         //移动----------
//         move_c(e.pageX-c_p[0],e.pageY-c_p[1]);//移动画布
//     }if (m_down&&!space) {
//         //执行区-----绘制-----
//         draw_pen(e.layerX,e.layerY);//画笔 涂鸦
//         draw_cuting(e.pageX-80,e.pageY);//裁剪
//         clear_canvas(e.layerX,e.layerY);// 擦除
//     }
// }
//裁剪专区
var warp=document.querySelector(".warp");
warp.onmousedown=function(e) {
    if (cutting&&!space) {
        draw_cuting(e.pageX-80,e.pageY);//裁剪
        cut_box.style.width=0+"px";
        cut_box.style.height=0+"px";
        cut_box.style.display="block";
    }
}
warp.onmouseup=function(e) {
    m_down=false;
    if (cutting&&!space) {
        show_def_window(true,function() {
            get_rect_pos(e.pageX-80,e.pageY);//重新计算裁剪点位置
            var rx=cut_mouse[0]/(scale/100);
            var ry=cut_mouse[1]/(scale/100);
            var rw=cut_box.offsetWidth/(scale/100);
            var rh=cut_box.offsetHeight/(scale/100);
            //提交信息----区域必须大于10x10
            if (rw>=10||rh>=10) {
                ps.img_cut(rx,ry,rw,rh);
                scale_c(scale);
            }
            show_def_window(false);//完成后关闭窗口----
            cut_box.style.display="none";
            document.querySelectorAll('.menubtn')[7].click();//重置画布位置
        },"确定要裁剪吗?目前不可逆的哦!");//裁剪

    }
}
//获取 裁剪矩形位置 函数
function get_rect_pos(x,y) {
    if (mouse_posi[0]<x) {
            if (mouse_posi[1]<y) {
                return;
            }else{
                cut_mouse[1]-=mouse_posi[1]-y;
            }
        }else{
            if (mouse_posi[1]<y) {
                cut_mouse[0]-=Math.abs(mouse_posi[0]-x);
            }else{
                cut_mouse[0]-=Math.abs(mouse_posi[0]-x);
                cut_mouse[1]-=Math.abs(mouse_posi[1]-y);
            }
        }
}
//鼠标滚动缩放
c.onwheel=function(e) {
    e.preventDefault();
    var input_sc=document.querySelectorAll('.menu>input')[3];
    var num=parseInt(input_sc.value);

    if (e.wheelDelta>0) {
        input_sc.value=num+5;
        if (input_sc.value>200) {
            input_sc.value=200;
        }
    }else{
        input_sc.value=num-5;
        if (input_sc.value<10) {
            input_sc.value=10;
        }
    }
    scale=input_sc.value
    scale_c(scale);
}
//画笔 涂鸦
function draw_pen(x,y) {
    if (pen) {
        var color=document.querySelectorAll('.menu>input')[2].value;
        var size=document.querySelectorAll('.menu>input')[1].value;
        ct.fillStyle=color;
        ct.fillRect(x/(scale/100),y/(scale/100),size,size);
    }
}
//开始 裁剪---绘制裁剪过程
var cut_box=document.querySelector(".cut_box");
function draw_cuting(x,y) {
    var ww=Math.abs(mouse_posi[0]-x);
    var hh=Math.abs(mouse_posi[1]-y);
    if (cutting) {
        if (mouse_posi[0]<x) {
            if (mouse_posi[1]<y) {
                cut_box.style.left=mouse_posi[0]+"px";
                cut_box.style.top=mouse_posi[1]+"px";
                cut_box.style.width=ww+"px";
                cut_box.style.height=hh+"px";
            }else{
                cut_box.style.left=mouse_posi[0]+"px";
                cut_box.style.top=y+"px";
                cut_box.style.width=ww+"px";
                cut_box.style.height=hh+"px";
            }
        }else{
            if (mouse_posi[1]<y) {
                cut_box.style.left=x+"px";
                cut_box.style.top=mouse_posi[1]+"px";
                cut_box.style.width=ww+"px";
                cut_box.style.height=hh+"px";
            }else{
                cut_box.style.left=x+"px";
                cut_box.style.top=y+"px";
                cut_box.style.width=ww+"px";
                cut_box.style.height=hh+"px";
            }
        }
    }
}
//橡皮擦 擦除
function clear_canvas(x,y) {
    if (clear_pen) {
        var size=document.querySelectorAll('.menu>input')[1].value;
        ct.clearRect(x/(scale/100),y/(scale/100),size,size);
    }
}
//获取选区
var toggle=false;
function selected() {
    if (toggle) {
        ct.putImageData(olddt, 0, 0);
        toggle = false;
    } else {
        ct.putImageData(dt, 0, 0);
        toggle = true;
    }
}
//取消选择
document.querySelectorAll('.menubtn')[2].onclick = function () {
    // select_null();
    ps.stopAnimate()
}
//设置容差
document.querySelectorAll('.menu>input')[0].onchange = function () {
    ps.setAlw(this.value);
    this.title = this.value;
}
//空格监控
var space=false;
document.onkeydown=function(e){
    if (e.keyCode==32) {
        e.preventDefault();
        c.style.cursor="move";
        space=true;
        clearInterval(st);
    }
}
document.onkeyup=function(e){
    if (e.keyCode==32) {
        c.style.cursor="default";
        space=false;
    }
}
//移动画布
function move_c(x,y){
    if (space&&x!=c_p[0]&&y!=c_p[1]) {
        c.style.left=x+"px";
        c.style.top=y+"px";
        // console.log(x,y)
    }
}
//缩放画布
var cw,ch;
function scale_c(size) {
    cw=c.width;
    ch=c.height;
    scale=size;
    c.style.width=cw*(size/100)+"px";
    c.style.height=ch*(size/100)+"px";
    // console.log(c.offsetWidth,ch)
}
document.querySelectorAll('.menu>input')[3].onchange=function() {
    scale_c(this.value);
}

//取消选择 函数
function select_null(){
    clearInterval(st);
    if (olddt) {
        ct.putImageData(olddt, 0, 0);
        ps.set_s_none();
    }
}
//重置画布位置
document.querySelectorAll('.menubtn')[7].onclick=function() {
    c.style.left="0px";
    c.style.top="0px";
}
//删除选区
document.querySelectorAll('.menubtn')[3].onclick=function() {
    ps.clearSelect();
}
//开启 涂鸦
document.querySelectorAll('.menubtn')[8].onclick=function() {
    if (pen) {
        pen=false;
        this.style.backgroundColor=null;
    }else if(!clear_pen&&!cutting){
        pen=true;
        this.style.backgroundColor="#B2B2B2";
    }
}
//开启 裁剪
document.querySelectorAll('.menubtn')[5].onclick=function() {
    if (cutting) {
        cutting=false;
        this.style.backgroundColor=null;
        cut_box.style.display="none";
        c.style.cursor="default";
    }else if(!clear_pen&&!pen){
        cutting=true;
        c.style.cursor="crosshair";
        this.style.backgroundColor="#B2B2B2";
    }
}
//开启 橡皮擦
document.querySelectorAll('.menubtn')[9].onclick=function() {
    if (clear_pen) {
        clear_pen=false;
        this.style.backgroundColor=null;
    }else if(!pen&&!cutting){
        clear_pen=true;
        this.style.backgroundColor="#B2B2B2";
    }
}
//弹出颜色调节
var alt_color=document.querySelector(".color");
document.querySelectorAll('.menubtn')[4].onclick=function() {
    if (alt_color.style.display=="block") {
        alt_color.style.display="none";
    }else{
        var c_input=document.querySelectorAll(".contr_color input");
        for (var i = 0; i < c_input.length; i++) {
            c_input[i].value=0;
        }
        alt_color.style.display="block";
    }
}
//弹出颜色调节 --关闭按钮
document.querySelector(".color>h4>span").onclick=function () {
    document.querySelectorAll('.menubtn')[4].click();
}
document.querySelectorAll(".color_btn>a")[0].onclick=function () {
    document.querySelectorAll('.menubtn')[4].click();
}
//调节颜色------------
document.querySelectorAll(".color_btn>a")[1].onclick=function () {
    var color=[0,0,0,0];
    var c_input=document.querySelectorAll(".contr_color input");
    color[0]=c_input[0].value;//透明度
    color[1]=c_input[1].value;//红
    color[2]=c_input[2].value;//绿
    color[3]=c_input[3].value;//栏
    ps.colorControl(color);
    document.querySelectorAll('.menubtn')[4].click();
}
//弹出保存窗口
var alt_save=document.querySelector(".save");
document.querySelectorAll('.menubtn')[1].onclick=function() {
    var type_input=document.querySelectorAll(".contr_save_type input");
    var gre_input=document.querySelector(".contr_save_gre input");
    type_input[0].checked=true;
    gre_input.value=8;
    if (alt_save.style.display=="block") {
        alt_save.style.display="none";
    }else{
        var c_input=document.querySelectorAll(".contr_color input");
        for (var i = 0; i < c_input.length; i++) {
            c_input[i].value=0;
        }
        alt_save.style.display="block";
    }
}
document.querySelector(".save>h4").onmousedown=function (e) {
    e.preventDefault();
}
//弹出保存窗口 --关闭按钮
document.querySelector(".save>h4>span").onclick=function () {
    document.querySelectorAll('.menubtn')[1].click();
}
document.querySelectorAll(".save_btn>a")[0].onclick=function () {
    document.querySelectorAll('.menubtn')[1].click();
}
//保存
document.querySelectorAll(".save_btn>a")[1].onclick=function () {
    var img_type;//图片格式
    var type_input=document.querySelectorAll(".contr_save_type input");
    var gre_input=document.querySelector(".contr_save_gre input");
    if (type_input[0].checked) {
        img_type="jpeg";
    }else if (type_input[1].checked){
        img_type="png";
    }else{
        img_type="bmp";
    }
    
    save_file(img_type,gre_input.value/10);
    document.querySelectorAll('.menubtn')[1].click();
}
//保存文件函数--------s
function save_file(img_type,gre) {
    if (img_type=="jpeg") {
        ct.putImageData(ps.save_jpg(),0,0);//处理空白像素
    }
    var dataurl=c.toDataURL("image/"+img_type,gre);
    var b= dataURLtoBlob(dataurl);
    var img_a=document.createElement("a");
    img_a.download="new_img."+img_type;
    img_a.href=URL.createObjectURL(b);
    img_a.click();
    //恢复数据
    // ct.putImageData(ps.get_save(), 0, 0);
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//保存文件--------e
//移动调节层--------s
var alt_mouse=[0,0];
var alt_mouse_d=false;
var alt_h4=document.querySelector(".color>h4");//调节层标题
alt_h4.onmousedown=function(e) {
    alt_mouse[0]=e.pageX-alt_color.offsetLeft;
    alt_mouse[1]=e.pageY-alt_color.offsetTop;
    alt_mouse_d=true;
    e.preventDefault();
}
alt_h4.onmouseup=function(e) {
    alt_mouse_d=false;
}
alt_h4.onmousemove=function(e) {
    if (alt_mouse_d) {
        alt_color.style.left=(e.pageX-alt_mouse[0])+"px";
        alt_color.style.top=(e.pageY-alt_mouse[1])+"px";
    }
}
alt_h4.onmouseleave=function(e) {
    alt_mouse_d=false;
}
//移动调节层--------e
// 裁剪 图片
document.querySelectorAll(".default_btn>a")[1].onclick=function () {
    show_def_window(false);
}
// 通用窗口-----s
//弹出通用窗口 --关闭按钮
var default_window=document.querySelector(".default");
function show_def_window(isshow,callback,cont,tit) {
    if(cont=='undefined'){
        cont="是否继续执行?";
    }
    if(tit=='undefined'){
        tit="信息提示";
    }
    if (isshow) {
        default_window.style.display="block";
    }else{
        default_window.style.display="none";
    }
    document.querySelector(".default label").innerHTML=tit;
    document.querySelector(".default_cont p").innerHTML=cont;
    document.querySelectorAll(".default_btn>a")[1].onclick=callback;
}
default_window.onmousedown=function(e) {
    e.preventDefault();
}
document.querySelector(".default>h4>span").onclick=function () {
    show_def_window(false);
}
document.querySelectorAll(".default_btn>a")[0].onclick=function () {
    cut_box.style.display="none";
    show_def_window(false);
}

// 通用窗口-----e
// 查看 帮助
document.querySelectorAll(".menubtn")[10].onclick=function () {
    show_def_window(true,function() {show_def_window(false)},"双击进入抠图选区,支持裁剪,简单调色,按住空格,鼠标可以拖到画布.可导出多种格式,简单方便!","使用手册");
}