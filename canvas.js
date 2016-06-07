var canvas=document.querySelector("canvas");
var cobj=canvas.getContext("2d");
var canvashistory=[];
var alls=document.querySelectorAll(".prevent");
var states=document.querySelectorAll(".state");
for(var i=0;i<alls.length;i++){
    alls[i].onmousedown=function(e){
        e.preventDefault();
    }
}
for(var i=0;i<states.length;i++){
    states[i].onmousedown=function(){
        for(var j=0;j<states.length;j++){
            states[j].style.outline="none"
        }
        this.style.outline="1px solid red"
    }
}
//对于填充还是描边的选择
var stylechoose=document.querySelector(".style>select");
var ostyle="fill";
stylechoose.onchange=function(){
    ostyle=this.value;
};
//对于线条宽度的选择
var widthchoose=document.querySelector("input[type=range]");
var linew=1;
widthchoose.onchange=function(){
   linew=this.value;
};
//对于画笔颜色的选择
var colorchange=document.querySelector("#pencolor");
var color="#000000";
colorchange.onchange=function(){
    color=this.value;
};
//对于画布颜色的选择
var canvascolor=document.querySelector("#canvascolor");
canvascolor.onchange=function(){
    canvas.style.background=this.value;
};
//对于绘图类型的选择
var choosetype="line";
var allshape=document.querySelectorAll(".shape>div");
Array.prototype.forEach.call(allshape,function(v){
    v.onclick=function(){
       choosetype=this.className;
        for(var i=0;i<allshape.length;i++){
            allshape[i].style.background="";
        }
        v.style.background="#ccc";
        canvas.style.cursor="pointer";
     }
});
//保存功能
var save=document.querySelector("#save");
save.onclick=function(){
  location.href=canvas.toDataURL('image/png').replace("image/png","image/octet-stream");
};
//撤销功能
var redo=document.querySelector("#redo");
redo.onclick=goback;
function goback(){
    if(canvashistory.length>=1){
    canvashistory.pop();
    cobj.clearRect(0,0,800,500);
    cobj.putImageData(canvashistory[canvashistory.length-1],0,0,0,0,800,600);
    }
}
document.onkeydown=function(e){
   if(e.ctrlKey&&e.keyCode==90){
       goback();
   }
};
//清空功能
var clear=document.querySelector("#clear");
clear.onclick=function(){
    var con=confirm("确定清空吗？");
    if(con){
    cobj.clearRect(0,0,800,600);
    canvashistory=[];
    }
};
//铅笔绘图
var pen=document.querySelector(".pen");
pen.onclick=function(){
    choosetype="pen";
    canvas.style.cursor="url(pen.png),pointer";
};
//橡皮擦功能
var erase=document.querySelector(".eraser");
erase.onclick=function(){
    choosetype="eraser";
    canvas.style.cursor="url(eraser.png),pointer";
};
//涂抹功能
var apply=document.querySelector(".apply");
apply.onclick=function(){
    choosetype="apply";
    canvas.style.cursor="url(apply.png),pointer";
};
//剪切功能
var cut=document.querySelector("#cut");
var cuted=false;
var cutedimagedata;
var oldtype;
cut.onclick=function(){
    oldtype=choosetype;
    choosetype="cut";
    canvas.style.cursor="url(scissors.png),pointer";
};
//复制功能
var copy=document.querySelector("#copy");
var copyvalue=false;
copy.onclick=function () {
    oldtype=choosetype;
    choosetype="cut";
    canvas.style.cursor="crosshair";
    copyvalue=true;
};
//绘制普通形状
var ox,oy,ex,ey;
var lox,loy,lex,ley,mx,my;
canvas.onmousedown=function (e) {
     ox=e.offsetX;
     oy=e.offsetY;
    var shapes=new shape(cobj,ostyle,{color:color,width:linew});
    if(choosetype=="pen"){
         cobj.beginPath();
    }
    canvas.onmousemove=function(e){
        ex=e.offsetX;
        ey=e.offsetY;
        if(choosetype!="pen"&&choosetype!="eraser"&&choosetype!="apply"){
        cobj.clearRect(0,0,800,500);
         if(canvashistory.length){
           cobj.putImageData(canvashistory[canvashistory.length-1],0,0,0,0,800,600);
         }
        }
        shapes[choosetype](ox,oy,ex,ey);
        if(cuted){
            cobj.clearRect(0,0,800,500);
            if(canvashistory.length){
            cobj.putImageData(canvashistory[canvashistory.length-1],0,0,0,0,800,600);
            }
            if(!copyvalue){
            cobj.clearRect(lox,loy,lex-lox,ley-loy);
            }
            mx=ex-(ox-lox);
            my=ey-(oy-loy);
            cobj.putImageData(cutedimagedata,mx,my);
       }
    };
    document.onmouseup=function(){
        canvas.onmousemove=null;
        document.onmouseup=null;
        if(choosetype=="cut"){
            if(cuted){
                choosetype=oldtype;
                canvas.style.cursor="pointer";
                cuted=false;
                copyvalue=false;
                canvashistory.push(cobj.getImageData(0,0,800,600));
                return;
            }
            cutedimagedata=cobj.getImageData(ox+1,oy+1,ex-ox-2,ey-oy-2);
            canvas.style.cursor="move";
            cuted=true;
            lox=ox;
            loy=oy;
            lex=ex;
            ley=ey;
        }else{
        canvashistory.push(cobj.getImageData(0,0,800,600));
        }
    };
};

