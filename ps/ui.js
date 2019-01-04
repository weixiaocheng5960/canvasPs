window.onload=function() {
    //主界面高度
    document.querySelector('.box').style.height=innerHeight+"px";
    //工作区宽度
    document.querySelector('.work').style.width = (innerWidth-100) + "px";
    //居中调节窗口
    var alert_color=document.querySelector(".color");
    alert_color.style.top=(innerHeight/2-150)+"px";
    alert_color.style.left=(innerWidth/2-200-80)+"px";
    //居中保存窗口
    var alert_save=document.querySelector(".save");
    alert_save.style.top=(innerHeight/2-150)+"px";
    alert_save.style.left=(innerWidth/2-200-80)+"px";
    //居中通用窗口
    var alert_default=document.querySelector(".default");
    alert_default.style.top=(innerHeight/2-150)+"px";
    alert_default.style.left=(innerWidth/2-200-80)+"px";
}
window.onresize=function(){
    //主界面高度
    document.querySelector('.box').style.height = innerHeight + "px";
    //工作区宽度
    document.querySelector('.work').style.width = (innerWidth - 100) + "px";
}