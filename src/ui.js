/*
    编辑器 系统控制 类

    -----依然使用es5------
*/
function System(warp) {
    /*
        参数 表示 容器（domID)
    */
    this.warp=document.querySelector(warp);
    if (this.warp===null) {
        console.log('请选择正确容器');
        return '请选择正确容器';
    }
    //公共数据
    this.ps={
        pen:{
            size:10,
            color:'#ff0000',
        },
        color:[0,0,0,0],//RGBA
        tolerance:0,
        scale:100,
    }
}
//系统调试
System.prototype.print = function(data) {
    console.log(data);
};
//系统弹窗
System.prototype.alert = function(msg) {
    this.openwindow(0,'信息提示',msg);
}  
//加载UI
System.prototype.loadui = function() {
    /*
        工作区布局容器生成
    */
    //dom创建
    var menubox=document.createElement('div');
    var workbox=document.createElement('div');
    var alertbox=document.createElement('div');
    //属性编辑
    menubox.className='menu';
    workbox.className='work';
    alertbox.className='alert';
    //添加到DOM
    this.warp.appendChild(menubox);
    this.warp.appendChild(workbox);
    this.warp.appendChild(alertbox);

    /*
        菜单按钮生成
    */
    var tempstr='';
    for (var i = 0; i < config.tools.length; i++) {
        //config.tools[i]
        tempstr+='<span class="menubtn" onclick="'+config.tools[i].action+'" title="'+config.tools[i].title+'"><img src="'+config.tools[i].icon+'" alt=""></span>';
    }
    menubox.innerHTML=tempstr;
    /*
        菜单栏下方控件
    */
    var menu_control_box=document.createElement('div');
    menubox.appendChild(menu_control_box);
    tempstr='<hr>';
    for (var i = 0; i < config.tools_control.length; i++) {
        if (config.tools_control[i].edit_type==='color') {
            tempstr+='<span title="'+config.tools_control[i].title+'">'+config.tools_control[i].title+'</span><br><input type="color" value="#ff0000" onchange="'+config.tools_control[i].event+'"><br>';
        }else{
            tempstr+='<span title="'+config.tools_control[i].title+'">'+config.tools_control[i].title+'</span><br><input type="number" max="1000" min="0" value="'+config.tools_control[i].value+'" onchange="'+config.tools_control[i].event+'"><br>';
        }
    }
    //操作提示
    tempstr+='<span>操作提示</span><br><span id="work_msg">无</span><br>';
    menu_control_box.innerHTML=tempstr;

    /*
        画板生成
    */
    tempstr='<div class="canvas-ps-warp"><canvas id="canvas" width="420" height="420" >不支持canvas</canvas>';
    tempstr+='<div class="history"><h4>&nbsp;操作历史&nbsp;</h4><div></div><span id="showhistory" href="javascript:;"><img src="asset/imgs/history.png" alt=""></span></div></div>';
    workbox.innerHTML=tempstr;

    /*
        弹出组件生成
    */
    tempstr='<!-- 调色窗口 --><div class="color windows"><h4>&nbsp;颜色调节<span onclick="system.closewindow(1)">&times;</span></h4><div class="contr_color"><h5>R: <input id="color_r" type="range" value="0" min="-255" max="255"></h5><h5>G: <input id="color_g" type="range" value="0" min="-255" max="255"></h5>';
    tempstr+='<h5>B: <input id="color_b" type="range" value="0" min="-255" max="255"></h5><h5>A: <input id="color_a" type="range" value="0" min="-255" max="255"></h5></div><div class="submit color_btn"><a href="javacsript:;" onclick="system.closewindow(1)">取 消</a><a href="javacsript:;" onclick="system.closewindow(1,editcolor())">确 定</a></div></div>';
    tempstr+='<!-- 保存窗口 --><div class="save windows"><h4>&nbsp;选择保存类型<span onclick="system.closewindow(2)">&times;</span></h4> <div class="contr_save"><h5 class="contr_save_type">类型: <span title="常用格式,可压缩">JPEG<input name="image" type="radio" checked="checked"></span><span title="带透明通道">PNG<input name="image" type="radio" checked="checked"></span><span title="window常用图片">BMP<input name="image" type="radio"></span></h5> <h5 class="contr_save_gre">质量: <input title="0.8" type="range" value="8" min="1" max="10" onchange="this.title=this.value/10"></h5> </div><div class="submit save_btn"> <a href="javacsript:;" onclick="system.closewindow(2)">取 消</a><a href="javacsript:;" onclick="system.closewindow(2)">确 定</a>  </div> </div>';
    tempstr+='<!-- 通用窗口 -->  <div class="default windows"><h4>&nbsp;<label for="">信息提示</label>：<span onclick="system.closewindow(0)">&times;</span></h4>   <div class="default_cont">   <p>真的要这样吗?</p>   </div>   <div class="submit default_btn">   <a href="javacsript:;" onclick="system.closewindow(0)">取 消</a>   <a onclick="system.closewindow(0)" href="javacsript:;">确 定</a>   </div>  </div>';
    alertbox.innerHTML=tempstr;

    /*
        初始化css
    */
    window.onload=function() {
        auto_size();
    }
    window.onresize=function(){
        auto_size();
        
    }
    //初始化UI
    function auto_size() {
        //主界面高度
        document.querySelector('.box').style.height=innerHeight+"px";
        //工作区宽度
        document.querySelector('.work').style.width = (innerWidth) + "px";
        //工作区宽度
        // document.querySelector('.work').style.width = (innerWidth-100) + "px";
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
    //弹出层 可移动 事件
    var alt_mouse=[0,0];
    var alt_mouse_d=false;
    //调节窗口
    var color_alt_h4=document.querySelector(".color h4");//调节层标题
    var alt_color=this.getwindow(1);
    color_alt_h4.onmousedown=function(e) {
        alt_mouse[0]=e.pageX-alt_color.offsetLeft;
        alt_mouse[1]=e.pageY-alt_color.offsetTop;
        alt_mouse_d=true;
        e.preventDefault();
    }
    color_alt_h4.onmouseup=function(e) {
        alt_mouse_d=false;
    }
    color_alt_h4.onmousemove=function(e) {
        if (alt_mouse_d) {
            alt_color.style.left=(e.pageX-alt_mouse[0])+"px";
            alt_color.style.top=(e.pageY-alt_mouse[1])+"px";
        }
    }
    color_alt_h4.onmouseleave=function(e) {
        alt_mouse_d=false;
    }
    //保存窗口
    svae_alt_h4=document.querySelector(".save h4");
    alt_save=this.getwindow(2);
    svae_alt_h4.onmousedown=function(e) {
        alt_mouse[0]=e.pageX-alt_save.offsetLeft;
        alt_mouse[1]=e.pageY-alt_save.offsetTop;
        alt_mouse_d=true;
        e.preventDefault();
    }
    svae_alt_h4.onmouseup=function(e) {
        alt_mouse_d=false;
    }
    svae_alt_h4.onmousemove=function(e) {
        if (alt_mouse_d) {
            alt_save.style.left=(e.pageX-alt_mouse[0])+"px";
            alt_save.style.top=(e.pageY-alt_mouse[1])+"px";
        }
    }
    svae_alt_h4.onmouseleave=function(e) {
        alt_mouse_d=false;
    }
    //通用窗口
    default_alt_h4=document.querySelector(".default h4");//调节层标题
    alt_default=this.getwindow(0);
    default_alt_h4.onmousedown=function(e) {
        alt_mouse[0]=e.pageX-alt_default.offsetLeft;
        alt_mouse[1]=e.pageY-alt_default.offsetTop;
        alt_mouse_d=true;
        e.preventDefault();
    }
    default_alt_h4.onmouseup=function(e) {
        alt_mouse_d=false;
    }
    default_alt_h4.onmousemove=function(e) {
        if (alt_mouse_d) {
            alt_default.style.left=(e.pageX-alt_mouse[0])+"px";
            alt_default.style.top=(e.pageY-alt_mouse[1])+"px";
        }
    }
    default_alt_h4.onmouseleave=function(e) {
        alt_mouse_d=false;
    }
};
/*
    工具栏操作信息提示
*/
System.prototype.toolmsg=function(str) {
    document.querySelector('#work_msg').innerHTML=str;
}
/*
    关闭窗口----共三种窗口
*/
System.prototype.closewindow = function(type,callback) {
    if (type===0) {
        document.querySelector(".default").style.display='none';
    }else if (type===1) {
        document.querySelector(".color").style.display='none';
    }else if (type===2) {
        document.querySelector(".save").style.display='none';
    }
    if (callback) {
        callback();
    }
};
/*
    创建窗口----共三种窗口
*/
System.prototype.openwindow = function(type,title,msg) {
    if (type===0) {
        var default_window=document.querySelector(".default");
        document.querySelector(".default label").innerHTML=title;
        document.querySelector(".default_cont p").innerHTML=msg;
        default_window.onmousedown=function(e) {
            e.preventDefault();
        }
        default_window.style.display='block';
    }else if (type===1) {
        document.querySelector(".color").style.display='block';
    }else if (type===2) {
        document.querySelector(".save").style.display='block';
    }
};
/*
    移动窗口----共三种窗口
*/
System.prototype.movewindow = function(type,x,y) {
    if (type===0) {
        var default_window=document.querySelector(".default");
        default_window.style.top=y+'px';
        default_window.style.left=x+'px';
    }else if (type===1) {
        default_window=document.querySelector(".color");
        default_window.style.top=y+'px';
        default_window.style.left=x+'px';
    }else if (type===2) {
        default_window=document.querySelector(".save");
        default_window.style.top=y+'px';
        default_window.style.left=x+'px';
    }
};
/*
    获取窗口信息----共三种窗口
*/
System.prototype.getwindow = function(type) {
    var default_window=null;
    if (type===0) {
        default_window=document.querySelector(".default");
    }else if (type===1) {
        default_window=document.querySelector(".color");
    }else if (type===2) {
        default_window=document.querySelector(".save");
    }
    return default_window;
};