function Screen(canvas, mv, noBorder){
    this.canvas    = canvas;
    this.arrFlObj  = [];  //Flying objects
    this.arrCS     = [];  //Coordinate system 
    this.noBorder  = noBorder;
    this.mv        = mv;

    //Main coordinate system
    this.arrCS.push(new CoordSystem());
      
    //add bounds
    if(!this.noBorder) {
       this.addStaticObject(new Polygon(this.border(), true) );
    }

    //finalize
    this.resize();
}

Screen.prototype.resize = function(){

   //size canvas to its parent     
   this.canvas.top     = 0;
   this.canvas.left    = 0;                                            
   this.canvas.height  = this.canvas.parentNode.clientHeight;
   this.canvas.width   = this.canvas.parentNode.clientWidth;     

   //recalc border
   if(!this.noBorder){   
      this.arrCS[0].arrStatic[0] = new Polygon(this.border(), true);
   }
}

Screen.prototype.border = function (){
   return [{x:0, y:0}, 
           {x:this.canvas.clientWidth, y:0},
           {x:this.canvas.clientWidth, y:this.canvas.clientHeight},
           {x:0, y:this.canvas.clientHeight} 
         ];          
}



Screen.prototype.addStaticContent = function(content, cs){
  //Check if it is default coordinate system
  if(!cs){
    cs = this.arrCS[0];
  }
  //Check if the coordinate system is already added    
  else if(this.arrCS.indexOf(cs) == -1){
    this.arrCS.push(cs);    
  }

  for(var i = 0; i < content.length; i++){
    cs.AddStaticObject(createStaticObject(content[i]));
  }  
}


//Add static object to a coordinate system
Screen.prototype.addStaticObject = function(obj, cs){
  //Check if it is default coordinate system
  if(!cs){
    cs = this.arrCS[0];
  }
  //Check if the coordinate system is already added    
  else if(this.arrCS.indexOf(cs) == -1){
    this.arrCS.push(cs);    
  }

  //Add static object to coordinate system
  cs.addStaticObject(obj);
}

Screen.prototype.addFlObj = function(obj){
   this.arrFlObj.push(obj);
}


Screen.prototype.loop = function(){

  //flying objecs
   for(var i = 0; i < this.arrFlObj.length; i++){
      for(var j = i + 1; j < this.arrFlObj.length; j++)
         this.arrFlObj[i].bounce(this.arrFlObj[j]);
   }

   //static and flying objects
   for(var i = 0; i < this.arrCS.length; i++){
      for(var j = 0; j < this.arrFlObj.length; j++)
         this.arrCS[i].bounce(this.arrFlObj[j]);
   }
  
  var iter = 3;
  
   //move objects
   for(var i = 0; i < this.arrFlObj.length; i++) {
      this.arrFlObj[i].move(iter, this.mv);
   }

    //move static
   for(var i = 0; i < this.arrCS.length; i++){
      this.arrCS[i].move(iter);
   }

}

Screen.prototype.draw = function(){
  //contex 
  var ctx = this.canvas.getContext('2d');

  //clear screen
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //draw coordinate system
  this.drawCS(ctx);

  //draw flying objects
  this.drawFlobj(ctx);

}


Screen.prototype.drawCS = function(ctx){
  for(var i = 0; i < this.arrCS.length; i++){
    this.arrCS[i].draw(ctx);
  }
}


Screen.prototype.drawFlobj = function(ctx){
   for(var i = 0; i < this.arrFlObj.length; i++) {
      this.arrFlObj[i].draw(ctx);
   }  
}