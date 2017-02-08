function Pnt(x, y){
   this.x = x || 0;
   this.y = y || 0;
}

Pnt.prototype.clone = function(){
   var p = new Pnt(this.x, this.y);

   return p;
}

Pnt.prototype.assign = function(p){
   this.x = p.x;
   this.y = p.y;

   return this;
}


Pnt.prototype.move = function(p){
   this.x += p.x;
   this.y += p.y;

   return this;
}

Pnt.prototype.add = function(p){
   this.x += p.x;
   this.y += p.y;

   return this;
}

Pnt.prototype.substract = function(p){
   this.x -= p.x;
   this.y -= p.y;

   return this;
}


Pnt.prototype.scale = function(a){
   this.x *= a;
   this.y *= a;
   
   return this;
}

Pnt.prototype.length = function(){
   return Math.sqrt(scalarProduct(this, this));
}


Pnt.prototype.distanceTo = function(p){
   var x = new Pnt(this.x - p.x, this.y - p.y)
   return x.length();
}


Pnt.prototype.normalize = function(){
   var len = this.length();
   if(len != 0){
     this.x = this.x / len;
     this.y = this.y / len;
   }
}

Pnt.prototype.ortogonal = function(){
  return new Pnt(-this.y, -this.x);
}

Pnt.prototype.coordConvDirect = function(){
   return [new Pnt(this.x, this.y), new Pnt(-this.y, this.x)];
}

Pnt.prototype.coordConvBackward = function(){
   return  [new Pnt(this.x, -this.y), new Pnt(this.y, this.x)];
}


Pnt.prototype.toString = function(){
    return "(x=" + this.x + ", y=" + this.y + ")";
};


function matrixProduct(p, mtx){
   return new Pnt(scalarProduct(p, mtx[0]), scalarProduct(p, mtx[1])); 
}

function scalarProduct(p1, p2){
  return p1.x * p2.x + p1.y * p2.y;
}

function calcNormal(lp1, lp2, p){
   //is p is null then any normal works
   if(p == null){
       return new Pnt(lp2.y - lp1.y, lp1.x - lp2.x);
   }
   else{   
      //get x - coordinate vector
      var xc = new Pnt(lp2.x - lp1.x, lp2.y - lp1.y);

      //normalize it
      xc.normalize();
      
      //translate p - new coordinate system  - move, turn, zero x coordinate and turn back 
      return matrixProduct({x:0, y:matrixProduct({x: p.x - lp1.x, y: p.y - lp1.y}, xc.coordConvDirect()).y}, xc.coordConvBackward());
   }
}
  
function rotationMatrix(angle){
    return [new Pnt(Math.cos(angle), -Math.sin(angle)), new Pnt(Math.sin(angle), Math.cos(angle))];
}

function rotationBackMatrix(angle){
    return [new Pnt(Math.cos(angle), Math.sin(angle)), new Pnt(-Math.sin(angle), Math.cos(angle))];
}

