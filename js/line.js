function Line(p1, p2){
   //get line equation in form ax+by+c=0
   this.a = (p2.y - p1.y);
   this.b = (p1.x - p2.x);
   this.c = p1.x * (p1.y - p2.y) + p1.y * (p2.x - p1.x);
}

Line.prototype.distanceToPoint = function(p){
   dist = (this.a * p.x + this.b * p.y + this.c) / (Math.sqrt(this.a * this.a + this.b * this.b));
   if(dist < 0)
     dist = -dist;

   return dist;
}

Line.prototype.projectionOfPoint = function(p){
   d = this.a * p.y - this.b * p.x;
   e = this.a * this.a + this.b * this.b;   

   return new Pnt( -(this.a * this.c + this.b  * d) / e, (this.a * d - this.b * this.c) / e );
}


