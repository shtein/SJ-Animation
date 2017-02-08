//Simple factory, no need to do super-js pattern here
function createStaticObject(obj){
  var ret = null;

   switch(obj.type){
     case('segment'):
        ret = new Segment(obj.data.p1, obj.data.p2);
     break;
     case('polygon'):
        ret = new Polygon(obj.data);
     break;
     case('circle'):
       ret = new Circle(obj.data.p, obj.data.r, obj.data.s, obj.data.e);
     break;
   }

   return ret;
}