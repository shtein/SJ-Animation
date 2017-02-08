inherits(Circle, Obj);

function Circle(p, radius, sAngle, eAngle){
   this.p      = p;
   this.radius = radius;
   this.sAngle = fixAngle(sAngle) || 0;   
   this.eAngle = fixAngle(eAngle) || -2 * Math.PI;
}

function fixAngle(angle)
{  
   a = angle;
   while(a < 0)
     a += 2 * Math.PI;

   while(a > 2 * Math.PI)
     a -= 2 * Math.PI;
          
   return a;
}

Circle.prototype.bounce = function(obj){

  //line that connects center of object is x-coordinate line
   var xc = new Pnt(obj.pos.x - this.p.x, obj.pos.y - this.p.y);
     
   var len = xc.length();

   //check if it is outside     
   if(len > obj.radius + this.radius)
       return;       

   //check if it crossed the cicrle
   if(len < obj.radius + this.radius)
       var k =0;

   //check if it is passing through the arc
   //prepare normal and coordinate conversion
   
   //calc angle it should be between the start and end angles
   var a = fixAngle(Math.atan2(xc.y, xc.x)) ;

   
   //now check if object is between the arc lines and does not touch the ends
   if(a >=  this.sAngle && a <= this.eAngle)
      return;      

   //check if it is inside
   if(this.radius > obj.radius + len)
     return;          
   
   //convert velocity vectors to new coordinate system
   xc.normalize();
   var v = matrixProduct(obj.vel, xc.coordConvDirect());

  //check if closed circle
  if((this.sAngle - this.eAngle) >= 2 * Math.PI && v.x >= 0)
    return;
   
  
   //only x - velocity coordinate changes
   v.x = -v.x

   obj.vel.assign(matrixProduct(v, xc.coordConvBackward()));
}

Circle.prototype.draw = function(ctx){
	
   ctx.beginPath(); 
   ctx.arc(this.p.x, this.p.y, this.radius, this.sAngle, this.eAngle, true);    
   ctx.stroke(); 
}

