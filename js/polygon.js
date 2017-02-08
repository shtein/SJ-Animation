inherits(Polygon, Obj);

function Polygon(arrPoints, isExternal){
   this.arrSegments = [];

   for(var i = 0; i < arrPoints.length; i++){
      //calculate normal - toward the opposite
       var p = {x: arrPoints[i].x + arrPoints[(i + 1) % arrPoints.length].x - arrPoints[(i + 2) % arrPoints.length].x,
                y: arrPoints[i].y + arrPoints[(i + 1) % arrPoints.length].y - arrPoints[(i + 2) % arrPoints.length].y
               };
       //isExternal means the polygon is an external border
       if(isExternal){
          p.x = -p.x;
          p.y = -p.y;
       }
           
      p = calcNormal(arrPoints[i], arrPoints[(i + 1) % arrPoints.length], p);
      this.arrSegments.push(new Segment(arrPoints[i], arrPoints[(i + 1) % arrPoints.length], p, isExternal));
   }
}

Polygon.prototype.draw = function(ctx, cs){
   for(var i = 0; i < this.arrSegments.length; i++){
      this.arrSegments[i].draw(ctx, cs);
   }
}

Polygon.prototype.bounce = function(obj, cs){
   for(var i = 0; i < this.arrSegments.length; i++){
      this.arrSegments[i].bounce(obj, cs);
   }
}