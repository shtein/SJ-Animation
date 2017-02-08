//parent - parent coordinate system
//p0 - initial (0, 0) in parent system
//angle0 - initial angle relative to parent system coordinate

function CoordSystem(parentCS, mvRule, pos){
	this.parentCS  = parentCS;
	this.mvRule    = mvRule;
	this.pos       = pos;
	this.arrStatic = []; 

	//Init
	this.move(0);

	if(!this.pos)
		this.pos = new Position();
}


CoordSystem.prototype.addStaticObject = function(obj){
	this.arrStatic.push(obj);
}

//p - point coordinate in this system coordinate
CoordSystem.prototype.getAbsCoord = function(p, noOfs){
	//Check if it does not move
	if(!this.mvRule)
		return p;

	//Rotate and move
	var pAbs   = matrixProduct(p, this.rotMtx);
	if(!noOfs)
		pAbs.add(this.pos.p);
	
	if(this.parentCS)
		pAbs = this.parentCS.getAbsCoord(pAbs, noOfs);		


	return pAbs;
}

//p - point coordinate in this system coordinate
CoordSystem.prototype.getRelCoord = function(p, noOfs){
	//Check if it does not move
	if(!this.mvRule)
		return p;

	//Change rotation matrix to backward
	this.rotMtx[0].y = -this.rotMtx[0].y;
	this.rotMtx[1].x = -this.rotMtx[1].x; 


	var pRel = new Pnt(p.x, p.y);

	if(this.parentCS)
		pRel = this.parentCS.getRelCoord(pRel, noOfs);

	//Rotate and move
	if(!noOfs)
		pRel.substract(this.pos.p)

	pRel   = matrixProduct(pRel, this.rotMtx);

	//Change rotation matrix back to forward
    this.rotMtx[0].y = -this.rotMtx[0].y;
	this.rotMtx[1].x = -this.rotMtx[1].x; 

	return pRel;
}


//Absolute velocity of a point from this system coordinate
CoordSystem.prototype.getAbsVelocity = function(pos){
	
	//Angular velocity
	var vel = pos.ortogonal().scale(this.pos.w);

	//Linear velocity
	vel.add(this.pos.v);


	if(this.parent)
		vel.add(parent.getAbsVelocity(pos));

	return vel;
}

//How it is moved
CoordSystem.prototype.move = function(ms){
	//Check if there is a coordinate system
	if(!this.mvRule)
		return;

	//Move
	this.pos = this.mvRule(this.pos, ms);
	//Recalc rotation matrix
	this.rotMtx   = rotationMatrix(this.pos.a);
}

//Draw Static objects
CoordSystem.prototype.drawStatic = function(ctx){
	 for(var i = 0; i < this.arrStatic.length; i++){
	    this.arrStatic[i].draw(ctx, this);
	 }
}

//Draw system coordinates - just a stub for debugging
CoordSystem.prototype.drawSC = function(ctx){
	ctx.beginPath();

	//Draw system coordinates
	var len = 30;
	var p0 = this.getAbsCoord({x: 0, y: 0}); 

	//axises
	var axis = [{x: len, y: 0}, {x: 0, y: len}];

	for(var i = 0; i < axis.length; i++){
		var p  = this.getAbsCoord(axis[i]);
	
		ctx.moveTo(p0.x, p0.y);
	    ctx.lineTo(p.x, p.y);
    	ctx.stroke();
	} 

	ctx.closePath();
}


CoordSystem.prototype.draw = function(ctx){

	//Draw static objects
	this.drawStatic(ctx);
	return;

	this.drawSC(ctx)
}


CoordSystem.prototype.bounce = function(obj){
	//Bounce inside this system coordinate
	for(var i = 0; i < this.arrStatic.length; i++){
		this.arrStatic[i].bounce(obj, this);
	}
}
