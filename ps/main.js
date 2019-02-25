/*
    作者：姜宏
    时间：2018-12-20
    备注：欢迎大家使用，帮忙优化。本人是新手，自然入不了大神的法眼。但是乐意接受任何评论。
    联系：QQ 1637124239
*/
document.body.onselectstart=function(){return false}
//打开文件
var input = document.createElement('input');
input.type = "file";
var work_msg=document.querySelector('#work_msg');
function work_msg_show(work_msg_str){
    work_msg.innerHTML=work_msg_str;
}
document.querySelectorAll('.menubtn')[0].onclick=function(){
    input.click();
}
input.onchange=function () {
    if (this.files[0]) {
        var file=this.files[0];
        if (file.type.search('image/')!=(-1)) {
            ps.openFile(file);
        }else{
            console.log("文件不是图片");
        }
    }
    
}
// 拖放文件
function dropFile(e){
    e.preventDefault();
    if (e.dataTransfer.files[0]){
        var file=e.dataTransfer.files[0];
        if (file.type.search('image/')!=(-1)) {
            ps.openFile(file);
        }else{
            console.log("文件不是图片");
        }
    }
}
function allowDrop(event) {
    event.preventDefault();
}

//初始化 数据
function init() {
    
    document.querySelectorAll(".menu>input")[3].value=100;
    document.querySelectorAll(".menu>input")[2].value="#000000";
    document.querySelectorAll(".menu>input")[1].value=10;
    document.querySelectorAll(".menu>input")[0].value=0;
    // ps.ready();
}
//测试图形------
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
// draw_test();
//默认设置------s
document.oncontextmenu = function(){
    return false;
}
var side_element=document.querySelectorAll(".menu>input");
for(var i=0;i<side_element.length;i++){
    // side_element[i].focus();
}
//默认设置------e

// 显示菜单----触摸
document.querySelector('#showmenu').addEventListener('touchend',function(){
    var menu=document.querySelector('.menu');
    if(menu.style.left=='0rem'){
        menu.style.left='-5rem';
        this.style.left='0rem';
    }else{
        menu.style.left='0rem';
        this.style.left='5rem';
    }
    // console.log(e.targetTouches[0])
})
// 显示历史
document.querySelector('#showhistory').addEventListener('touchend',function(){
    var history=document.querySelector('.history');
    if(history.style.right=='0rem'){
        history.style.right='-6.6rem';
        this.style.right='0rem';
    }else{
        history.style.right='0rem';
        this.style.right='6.6rem';
    }
    // console.log(e.targetTouches[0])
})
//鼠标滚动缩放
c.onwheel=function(e) {
    e.preventDefault();
    var input_sc=document.querySelectorAll('.menu>input')[3];
    var num=parseInt(input_sc.value);

    if (e.wheelDelta>0) {
        input_sc.value=num+5;
        if (input_sc.value>600) {
            input_sc.value=600;
        }
    }else{
        input_sc.value=num-5;
        if (input_sc.value<5) {
            input_sc.value=5;
        }
    }
    scale=input_sc.value
    ps.scaleCanvas(scale);
}
//取消选择
document.querySelectorAll('.menubtn')[2].onclick = function () {
    ps.stopAnimate()
}
//设置容差
document.querySelectorAll('.menu>input')[0].onchange = function () {
    ps.setAlw(this.value);
    this.title = this.value;
}
//画笔大小
document.querySelectorAll('.menu>input')[1].onchange = function () {
    ps.setWidth(this.value);
    this.title = this.value;
}
//画笔颜色
document.querySelectorAll('.menu>input')[2].onchange = function () {
    ps.setColor(this.value);
    this.title = this.value;
}
// //空格监控
// var space=false;
// document.onkeydown=function(e){
   
//     if (e.keyCode==32) {
//          e.preventDefault();
//         c.style.cursor="move";
//         ps.setMode(6);
//     }
// }
document.onkeyup=function(e){
    if (e.keyCode==32) {
        c.style.cursor="default";
        ps.setMode(0);
    }
}
//缩放画布
document.querySelectorAll('.menu>input')[3].onchange=function() {
    ps.scaleCanvas(this.value);
    work_msg_show('缩放画布');
}
//重置画布
document.querySelectorAll('.menubtn')[7].onclick=function() {
    ps.reMake();
}
//删除选区
document.querySelectorAll('.menubtn')[3].onclick=function() {
    ps.clearSelect();
}
//开启 涂鸦
document.querySelectorAll('.menubtn')[8].onclick=function() {
    if (ps.getMode()==2) {
        ps.setMode(0);
        this.style.backgroundColor=null;
        
    }else{
        ps.stopAnimate()
        ps.setMode(2);
        clearMenuStyle();
        this.style.backgroundColor="#B2B2B2";
        work_msg_show('涂鸦模式');
    }
}
//填充颜色
document.querySelectorAll('.menubtn')[9].onclick=function() {
    var color=document.querySelectorAll('.menu>input')[2].value;
    ps.setMode(8);
    ps.fillSelect(hex2Rgb(color));
}

//颜色转化
function hex2Rgb(hex) { 
    //十六进制转为RGB  
    var rgb = []; 
    // 定义rgb数组  
    if (/^\#[0-9A-F]{3}$/i.test(hex)) { 
        //判断传入是否为#三位十六进制数   
        let sixHex = '#';  
        hex.replace(/[0-9A-F]/ig, function(kw) {    s
            ixHex += kw + kw; //把三位16进制数转化为六位   
        });   
            hex = sixHex; //保存回hex  
    }  
    if (/^#[0-9A-F]{6}$/i.test(hex)) { 
        //判断传入是否为#六位十六进制数   
        hex.replace(/[0-9A-F]{2}/ig, function(kw) {    
            rgb.push(eval('0x' + kw)); //十六进制转化为十进制并存如数组   
        });   
        return rgb; //输出RGB格式颜色  
    } else {   
        // console.log(`Input ${hex} is wrong!`);   
        return [0,0,0];  
    } 
} 

//开启 裁剪
document.querySelectorAll('.menubtn')[5].onclick=function() {
    if (ps.getMode()==4) {
        ps.setMode(0);
        this.style.backgroundColor=null;
        c.style.cursor="default";
        
    }else{
        ps.stopAnimate()
        ps.setMode(4);
        c.style.cursor="crosshair";
        clearMenuStyle();
        this.style.backgroundColor="#B2B2B2";
        work_msg_show('裁剪画布');
    }
}
//开启 移动
document.querySelectorAll('.menubtn')[6].onclick=function() {
    if (ps.getMode()==6) {
        ps.setMode(0);
        this.style.backgroundColor=null;
        // c.style.cursor="default";
    }else{
        ps.setMode(6);
        // c.style.cursor="move";
        clearMenuStyle();
        this.style.backgroundColor="#B2B2B2";
        work_msg_show('移动画布');
    }
}
//开启 橡皮擦
document.querySelectorAll('.menubtn')[10].onclick=function() {
    if (ps.getMode()==3) {
        ps.setMode(0);
        this.style.backgroundColor=null;

    }else{
        ps.stopAnimate()
        ps.setMode(3);
        clearMenuStyle();
        this.style.backgroundColor="#B2B2B2";
        work_msg_show('擦除模式');
    }
}
//画布跳转指定历史
function canvaspsGo(index){
    ps.goto(index);
}
//刷新操作历史
!function refreshHistory(){
    var history=ps.getHistory();
    var historybox=document.querySelector('.history>div');
    historybox.innerHTML=null;
    for(var i=0;i<history.length;i++){
        var ea=document.createElement('a');
        ea.innerHTML=history[i].title;
        ea.href='javascript:canvaspsGo('+i+');'
        ea.setAttribute('data-index',i);
        historybox.appendChild(ea);
    }
    setTimeout(refreshHistory,800);
}()

//清楚菜单样式
function clearMenuStyle(){
    var menubtn=document.querySelectorAll('.menubtn');
    for(var i=0;i<menubtn.length;i++){
        menubtn[i].style.backgroundColor=null;
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
        work_msg_show('颜色调节');
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
    show_def_window(false);
}

// 通用窗口-----e
// 查看 帮助
document.querySelectorAll(".menubtn")[11].onclick=function () {
    show_def_window(true,function() {show_def_window(false)},"双击进入抠图选区,支持裁剪,简单调色,按住空格,鼠标可以拖到画布.可导出多种格式,简单方便!","使用手册");
}