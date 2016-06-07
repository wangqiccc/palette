function shape(cobj,type,style){
   this.cobj=cobj;
   this.type=type;
   this.color=style.color;
   this.lineW=style.width;
}
shape.prototype={
  init:function(){
   var cobj=this.cobj;
   cobj.strokeStyle=this.color;
   cobj.fillStyle=this.color;
   cobj.lineWidth=this.lineW;
   cobj.setLineDash([]);
  },
  rect:function(x,y,x1,y1){
    this.init();
    var cobj=this.cobj;
    cobj.beginPath();
    cobj.rect(x,y,x1-x,y1-y);
    cobj[this.type]();
  },
  line:function  (x,y,x1,y1) {
    this.init();
    var cobj=this.cobj;
    cobj.beginPath();
    cobj.moveTo(x,y);
    cobj.lineTo(x1,y1);
    cobj.stroke();
  },
  circle:function(x,y,x1,y1){
      this.init();
      this.w=x1-x;
      this.h=y1-y;
      this.r=Math.sqrt(this.w*this.w+this.h*this.h);
      var cobj=this.cobj;
      cobj.beginPath();
      cobj.arc(x,y,this.r,0,2*Math.PI);
      cobj[this.type]();
  },
  pen:function(x,y,x1,y1){
      this.init();
      var cobj=this.cobj;
      cobj.lineTo(x1,y1);
      cobj.stroke();
  },
  eraser:function(ox,oy,x,y){
      this.init();
      var cobj=this.cobj;
      cobj.clearRect(x,y,20,20);
  },
  cut:function(x,y,x1,y1){
      this.init();
      cobj.strokeStyle="#ccc";
      cobj.beginPath();
      cobj.lineWidth=1;
      cobj.lineCap="butt";
      cobj.setLineDash([4,3]);
      cobj.lineDashOffset=5;
      cobj.rect(x,y,x1-x,y1-y);
      cobj.stroke();
  },
   apply:function(ox,oy,x,y){
       this.init();
       var cobj=this.cobj;
       cobj.fillRect(x,y,20,20);
   }
};