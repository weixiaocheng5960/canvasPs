/*
    对于canvasps类 封装操作函数
*/
//测试图形
draw_test();

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
    ct.fillRect(c.width/4-20,380,200,40);
    ct.fillStyle="#61FCF4";
    ct.font="20px Arial";
    ct.fillText("双击进入像素选区",c.width/4,405);
    //文字
    ct.fillStyle="#1785F9";
    ct.font="100px Arial";
    ct.fillText("welcome",20,c.height-100);
    ct.fillStyle="#FF4BFD";
    ct.font="26px Arial";
    ct.fillText("在线抠图工具,简单方便 by-jianghong",0,c.height-50);
    ps.ready();
}
document.onkeyup=function(e){
    if (e.keyCode==32) {
        c.style.cursor="default";
        ps.setMode(0);
    }
}
//弹出颜色调节
function opencolorwindow() {
    var r_input=document.querySelector('#color_r');
    var g_input=document.querySelector('#color_g');
    var b_input=document.querySelector('#color_b');
    var a_input=document.querySelector('#color_a');
    // console.log(ps.getColor())
    var color_str=ps.getColor();
    color_str=color_str.replace(/[rgba\(\)]/g,'');
    var color=color_str.split(',');
    r_input.value=color[0];
    g_input.value=color[1];
    b_input.value=color[2];
    a_input.value=color[3];
    system.openwindow(1,'','',function(){
        var color=[parseInt(r_input.value),parseInt(g_input.value),parseInt(b_input.value),parseInt(a_input.value*255)];
        ps.colorControl(color);
        ps.setColor('rgba('+r_input.value+','+g_input.value+','+b_input.value+','+a_input.value+')');
        var show_color_box=document.querySelector('.color_selector');
        show_color_box.style.backgroundColor=ps.getColor();
    });
    system.toolmsg('颜色调节');
}
//弹出颜色选择器
function selectcolor(el) {
    var r_input=document.querySelector('#color_r');
    var g_input=document.querySelector('#color_g');
    var b_input=document.querySelector('#color_b');
    var a_input=document.querySelector('#color_a');
    var color_str=ps.getColor();
    color_str=color_str.replace(/[rgba\(\)]/g,'');
    var color=color_str.split(',');
    r_input.value=color[0];
    g_input.value=color[1];
    b_input.value=color[2];
    a_input.value=color[3];
    system.openwindow(1,'','',function(){
        ps.setColor('rgba('+r_input.value+','+g_input.value+','+b_input.value+','+a_input.value+')');
        el.style.backgroundColor=ps.getColor();
        var show_color_box=document.querySelector('.color_selector');
        show_color_box.style.backgroundColor=ps.getColor();
    });
    system.toolmsg('颜色选择');
}
//获取 调色器 颜色
function getcolor(type){
    var r_input=document.querySelector('#color_r');
    var g_input=document.querySelector('#color_g');
    var b_input=document.querySelector('#color_b');
    var a_input=document.querySelector('#color_a');
    if (type&&type==1) {
        return 'rgba('+r_input.value+','+g_input.value+','+b_input.value+','+a_input.value+')';
    }else{
        return [r_input.value,g_input.value,b_input.value,a_input.value];
    }
    
}
//颜色调节函数
function editcolor() {
    
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
//清楚菜单样式
function clearMenuStyle(){
    var menubtn=document.querySelectorAll('.menubtn');
    for(var i=0;i<menubtn.length;i++){
        menubtn[i].style.backgroundColor=null;
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
//开启 橡皮擦
function startclaer(el) {
    if (ps.getMode()==3) {
        ps.setMode(0);
        el.style.backgroundColor=null;

    }else{
        ps.stopAnimate()
        ps.setMode(3);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('擦除模式');
    }
}
//开启 移动画布
function movecanvas(el) {
    if (ps.getMode()==6) {
        ps.setMode(0);
        el.style.backgroundColor=null;
        // c.style.cursor="default";
    }else{
        ps.setMode(6);
        // c.style.cursor="move";
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('移动画布');
    }
}
//开启 裁剪
function startcut(el) {
    if (ps.getMode()==4) {
        ps.setMode(0);
        el.style.backgroundColor=null;
        c.style.cursor="default";
        
    }else{
        ps.stopAnimate()
        ps.setMode(4);
        c.style.cursor="crosshair";
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('裁剪画布');
    }
}
//填充颜色
function fillcolor() {
    ps.setMode(8);
    ps.fillSelect();
}
//开启 多边形 选择
function startpolygon(el) {
    if (ps.getMode()==11) {
        ps.setMode(0);
        el.style.backgroundColor=null;
    }else{
        ps.stopAnimate()
        ps.setMode(11,clearMenuStyle);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('多边形选择');
    }
}
//开启 涂鸦
function startdraw(el) {
    if (ps.getMode()==2) {
        ps.setMode(0);
        el.style.backgroundColor=null;
        
    }else{
        ps.stopAnimate()
        ps.setMode(2);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('笔刷模式');
    }
}
//开启 铅笔
function startpencil(el) {
    if (ps.getMode()==9) {
        ps.setMode(0);
        el.style.backgroundColor=null;
        
    }else{
        ps.stopAnimate()
        ps.setMode(9);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('铅笔模式');
    }
}
//开启 铅笔抠图
function pencut(el) {
    if (ps.getMode()==10) {
        ps.setMode(0);
        el.style.backgroundColor=null;
    }else{
        ps.stopAnimate()
        ps.setMode(10);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('铅笔抠图');
    }
}
//删除选区
function del_select() {
    clearMenuStyle();
    ps.clearSelect();
}
//重置画布
function resetcavans() {
    clearMenuStyle();
    ps.reMake();
}
//缩放画布
function scalecavans(el) {
    system.ps.pen.scale=el.value;
    ps.scaleCanvas(el.value);
    system.toolmsg('缩放画布');
}
//画笔颜色
function changecolor(el) {
    ps.setColor(el.value);
    el.title = el.value;
}
//取消选择
function cancel() {
    clearMenuStyle();
    ps.stopAnimate()
}
//设置容差
function settolerance(el) {
    ps.setAlw(el.value);
    el.title = el.value;
}
//画笔大小
function setpensize(el) {
    ps.setWidth(el.value);
    el.title = el.value;
}
//拾色器
function pickercolor(el){
    var show_color_box=document.querySelector('.color_selector');
    if (ps.getMode()==12) {
        ps.setMode(0);
        el.style.backgroundColor=null;
    }else{
        ps.pickercallback=function(end){
            if (end) {
                ps.setMode(0);
                clearMenuStyle();
            }else{
                show_color_box.style.backgroundColor=ps.getColor();
                // console.log(ps.getColor())
            }
        }
        ps.stopAnimate()
        ps.setMode(12);
        clearMenuStyle();
        el.style.backgroundColor="#B2B2B2";
        system.toolmsg('拾色器');
    }
}
//鼠标滚动缩放
c.onwheel=function(e) {
    e.preventDefault();
    var input_sc=document.querySelectorAll('.menu input')[2];
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
// 拖放文件
function dropFile(e){
    e.preventDefault();
    if (e.dataTransfer.files[0]){
        var file=e.dataTransfer.files[0];
        if (file.type.search('image/')!=(-1)) {
            ps.openFile(file);
        }else{
            system.alert("文件不是图片");
        }
    }
}
function allowDrop(event) {
    event.preventDefault();
}
//打开文件
var input = document.createElement('input');
input.type = "file";
function openfile(){
    input.click();
}
input.onchange=function () {
    if (this.files[0]) {
        var file=this.files[0];
        if (file.type.search('image/')!=(-1)) {
            ps.openFile(file);
        }else{
            system.alert("文件不是图片");
        }
    }
    
}
//保存
function svaeimg() {
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
//保存到可下载文件
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
//查看帮助
function helper() {
    system.alert('双击进入抠图选区,支持裁剪,简单调色,按住空格,鼠标可以拖到画布.可导出多种格式,简单方便!<p>这个版本不再支持移动端！<br>拾色器按下鼠标移动取色，单机右键结束！<p>');
}