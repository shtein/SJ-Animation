//Quadratic equation roots
//a*X^2 + b*X + c = 0 
function quadrEqRoots(a, b, c){
  var x1, x2;

  //Check if a and b are not 0
  if(a == 0 ){
    if(b == 0){
      return null;
    }
    else{
      x1 = x2 = -b/c;
    }
  }
  else{
    var d = b * b - 4 * a * c;

    //Check if roots are in imaginary domain
    if(d < 0){
      return null;
    }
    else{
      d = Math.sqrt(d);
      x1 = (-b + d) / (2 * a);
      x2 = (-b - d) / (2 * a); 
    }
  }

  return {x1: x1, x2: x2};
}


//Intersection of line and circle
//line is defined by two points p1 and p2
//circle is defined by center pc and raduis r
//returns two points: p1 and p2 or null if no intersection

function interLineCircle(p1, p2, pc, r){
  //Tntroduce new coordinate system starting in p1 and pointing from x-axis p1 to p2
  var p0  = p1;
  var ox  = new Pnt(p2.x - p1.x, p2.y - p1.y);
  var len = ox.length();
  ox.normalize();

  //Translate coordinates of circle's center to new coordinate system  
  var pcRel = matrixProduct({x: pc.x - p0.x, y: pc.y - p0.y}, ox.coordConvDirect());

  //Check if it is too far
  if(Math.abs(pcRel.y) > r)
    return null;

  if(pcRel.x < -r || pcRel.x > len + r)
    return null;
  
  //Convert point back to original coordinate system
  return matrixProduct({x: pcRel.x, y: 0}, ox.coordConvBackward()).add(p0);
}
