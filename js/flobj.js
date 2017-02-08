function FlyingObj(pos, radius, vel, image){
   this.pos    = new Pnt(pos.x + radius, pos.y + radius);
   this.radius = radius;
   this.vel    = new Pnt(vel.x, vel.y);   
   this.mass   = Math.PI * this.radius * this.radius;
   this.image  = image;
}

FlyingObj.prototype.move = function(ms, mvRule){
   mv = mvRule.move(this.pos, this.vel, ms);
  
   this.pos.x = mv.pos.x;
   this.pos.y = mv.pos.y;

   this.vel.x = mv.vel.x;
   this.vel.y = mv.vel.y;
}


function elasticCollision(v1, m1, v2, m2){
   var m = m1 + m2;
   var dm = m1 - m2;

   return {v1: (dm * v1 + 2 * m2 * v2 ) / m, v2: (-dm * v2 + 2 * m1 * v1) / m};
}

FlyingObj.prototype.bounce = function(obj){    

   //line that connects center of object is x-coordinate line
   var xc = new Pnt(obj.pos.x - this.pos.x, obj.pos.y - this.pos.y);
     
   //check if close
   if(xc.length() > obj.radius + this.radius)
       return;

   //coordinates conversion
   xc.normalize();

   //direct and backward converion matrixes
   var aDirect   = xc.coordConvDirect();
   var aBackward = xc.coordConvBackward();

   //convert velocity vectors to new coordinate system
   var v1 = matrixProduct(obj.vel, aDirect);
   var v2 = matrixProduct(this.vel, aDirect);

   //after bouncing velocity x - coordinates switches
   var tmp = elasticCollision (v1.x, obj.mass, v2.x, this.mass);

   v1.x  = tmp.v1;
   v2.x  = tmp.v2; 

   //convert back to origial coordinates
   obj.vel.assign(matrixProduct(v1, aBackward));
   this.vel.assign(matrixProduct(v2, aBackward));        
}

FlyingObj.prototype.draw = function(ctx){   
   this.drawHead(ctx);
   //this.drawBody(ctx);
   this.drawVelocity(ctx);
}

FlyingObj.prototype.drawHead = function(ctx){
   ctx.save();

   //draw circle
   ctx.beginPath();
   ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
   ctx.stroke();  
   ctx.closePath();
   ctx.clip();
  
   //draw image
   var temp = this.radius + 2;   
   ctx.drawImage(this.image, this.pos.x - temp, this.pos.y - temp, temp * 2, temp * 2);        
   ctx.beginPath();
   ctx.clip();
   ctx.closePath();
   ctx.restore();
}

FlyingObj.prototype.drawBody = function(ctx){
   //draw body
   var bodyLen = this.radius;

   ctx.moveTo(this.pos.x, this.pos.y + this.radius);
   ctx.lineTo(this.pos.x, this.pos.y + this.radius + bodyLen);
   ctx.stroke();

   //draw hands
   var handLen = this.radius;

   ctx.moveTo(this.pos.x - handLen, this.pos.y + this.radius);
   ctx.lineTo(this.pos.x + handLen, this.pos.y + this.radius);
   ctx.stroke();
 
   //draw legs
   var legLen  = this.radius;
   var legWide = this.radius / 4;

   ctx.moveTo(this.pos.x - legWide, this.pos.y + this.radius + bodyLen + legLen);  
   ctx.lineTo(this.pos.x, this.pos.y + this.radius + bodyLen);
   ctx.lineTo(this.pos.x + legWide, this.pos.y + this.radius + bodyLen + legLen);
   ctx.stroke();
}


FlyingObj.prototype.drawVelocity = function(ctx){
   //if no velocity then do not draw
   var len = this.vel.length() ;
   
   if(len == 0)
      return;
   
   //arrowhead 
   var arhLength = 10;
   var arhWidth  = 10;
   var arhScale  = 50;
   //edge of arrowhead
   var arhEdge    = this.radius + arhScale * len;
   
   //arrow head coordinates in system coordinate where x is velocity
   var arr = [{x: arhEdge + arhLength, y:0}, {x: arhEdge, y: arhWidth / 2}, {x: arhEdge, y: -arhWidth / 2}];
   

   //translate coordinates
   var vel = this.vel.clone();
   vel.normalize();
   var convBackward = vel.coordConvBackward();

   for(var i = 0; i < arr.length; i++){
      arr[i] = matrixProduct(arr[i], convBackward).add(this.pos);
   }

   //draw arrow
   ctx.moveTo(arr[0].x, arr[0].y);  
      
   for(var i = 0; i < arr.length; i++){
      ctx.lineTo(arr[(i + 1)% arr.length ].x, arr[(i + 1)% arr.length ].y);
   }
   
  ctx.stroke();     
}