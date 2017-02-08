//////////////////////////////////////
// Position and movement 
// p - point
// v - velocity
// a - angle
// w - angle velocity
function Position(p, v, a, w){
   this.p = p || new Pnt(0, 0);
   this.v = v || new Pnt(0, 0);
   this.a = a || 0;
   this.w = w || 0;
}



/////////////////////////////////////
// Move rules for flying objects

function MoveRule(){
}


MoveRule.prototype.move = function(s0, v0, ms){
}

//MoveLinear - simpliest
inherits(MoveLinear, MoveRule);

function MoveLinear(){
}

MoveLinear.prototype.move = function(s0, v0, ms){
   return { pos: {x: s0.x + ms * v0.x, y: s0.y + ms * v0.y}, vel: {x: v0.x, y: v0.y} };
}


//Kind of earh gravity
inherits(MoveGravity, MoveRule);

function MoveGravity(g){
   this.g = g || 0.01;
}

MoveGravity.prototype.move = function(s0, v0, ms){   
   return { pos: {x: s0.x + ms * v0.x, y: s0.y + ms * v0.y + ms * ms * this.g / 2}, vel: {x: v0.x, y: v0.y + ms * this.g} };
}

//One or more gravity ponts
inherits(MoveGravityPoint, MoveRule);

function MoveGravityPoint(p, radius, mass){
   this.p      = p;
   this.radius = radius;   
   this.mass   = mass;
}

MoveGravityPoint.prototype.move = function(s0, v0, ms){      
   //gravitation center

   //Coordinate system
   var xc  = new Pnt(this.p.x - s0.x, this.p.y - s0.y);
   //distance from object to gravitaion center
   var len = xc.length(); 
	
   //Coordinate conversion
   xc.normalize();
   //according to the law of gravity: F = m * a, F = G * m * M / (R * R);
   //a = G * M / ( R * R); 
    
   var a = matrixProduct({x: this.mass /(len * len), y: 0}, xc.coordConvBackward());

   return { pos: {x: s0.x + ms * v0.x + ms * ms * a.x / 2, y: s0.y + ms * v0.y + ms * ms * a.y / 2}, vel: {x: v0.x + ms * a.x, y: v0.y + ms * a.y} };
}


MoveGravityPoint.prototype.getCircle = function(){
   return new Circle(this.p, this.radius);
}



