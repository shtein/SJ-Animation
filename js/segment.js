inherits(Segment, Obj);

function Segment(p1, p2, normal, isBorder){
   //remember the points
   this.p1 = p1;
   this.p2 = p2;

      //init normal
   this.normal = normal;
   if(this.normal)
      this.normal.normalize();

   this.isBorder = isBorder;
}

/*
Segment.prototype.bounce = function(obj){

   //segment
   var p = new Pnt(this.p1.x - this.p2.x, this.p1.y - this.p2.y);

  //Get normal 
   var normal;
   if(this.normal){
    normal = this.normal.clone();
   }
   else {
     normal = calcNormal(this.p2, this.p1, obj.pos);
     normal.normalize();
   }            

   //detect coordinate system in a way normal points to first quadrant   
   //normal is y, x is (normal.-y, normal.x) in current coordinate system   
   var xc = new Pnt(normal.y, -normal.x);
    
   //(0, 0) point is either p1 or p2 depening on where xc poins
   var p0 = scalarProduct(xc, p) > 0 ? this.p2 : this.p1;

   //convert object coordinates to new system coordinates
   var pos = matrixProduct({x: obj.pos.x - p0.x, y: obj.pos.y - p0.y}, xc.coordConvDirect());



   //check if behind
   if(pos.y > 0){
      //not behind
      //check if close
      if(pos.y > obj.radius) //too far
         return ; 
   }
   else{

      //behind
      if(-pos.y > obj.radius && !this.isBorder){
         return;
      }
   }
      
   //check if between segment ponts
   if((pos.x < 0 || pos.x > p.length()) && !this.isBorder)
      return;

   //convert object coordinates to new system coordinates
   var vel = matrixProduct(obj.vel, xc.coordConvDirect()); 

   //for border only - do not allow to get behind
   if(this.normal && vel.y >= 0){   
      //positive y-velocity moves backward
      return;
   }

   var test = interLineCircle(this.p1, this.p2, obj.pos, obj.radius);
  
   //velocity after bouncing (reflection): v = v - 2 * n * (| v * n |)
   normal.scale(-2 * scalarProduct(obj.vel, normal));    
   obj.vel.add(normal); 

}
*/

Segment.prototype.bounce = function(obj, cs){
  //Convert object position to relative coordinate system
  //First convert object coordinates and velocity to this coordinate system coordinate and velocity

  //Check if object are about to bounce
  var test = interLineCircle(this.p1, this.p2, cs.getRelCoord(obj.pos), obj.radius);

  if(!test){
    return;
  }

  //Bouncing or going back. Calculate normal and reflect the speed
  var normal;
  if(this.normal){
    normal = this.normal.clone();
  }
  else {
    normal = calcNormal(this.p2, this.p1, obj.pos);
    normal.normalize();
  }            
 
  //Convert object absolute velocity to relative velocity
  var vel  = cs.getRelCoord(obj.vel.substract(cs.getAbsVelocity(test)), true);

  if(this.normal && scalarProduct(this.normal, vel) > 0)
    return;

  //velocity after bouncing (reflection): v = v - 2 * n * (| v * n |)
  normal.scale(-2 * scalarProduct(vel, normal));    
  vel.add(normal); 

  //Convert relative velocity to absolute velocity
  obj.vel  = cs.getAbsCoord(vel, true).add(cs.getAbsVelocity(test));
}

Segment.prototype.draw = function(ctx, cs){

  //Recalculate to absolute coordinates
  var p1, p2;
  p1 = cs.getAbsCoord(this.p1);
  p2 = cs.getAbsCoord(this.p2);

  //Draw
  ctx.beginPath();

  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  ctx.closePath();
}
