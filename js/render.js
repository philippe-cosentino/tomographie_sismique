var imageCapt;

function animation () {
	render();
	requestAnimationFrame( animation);
}

function recalcBump() {
	meshTerre.material.bumpScale=bump*3;
	meshTerre.material.needsUpdate=true;
}

function render(force)
{
	tailleF=(tailleF+taille)/2;
	latitudeF=(latitudeF+latitude)/2;
	//longitude=corrigeLong(longitude);
	//longitudeF=corrigeLong(longitudeF);
	if (Math.abs(longitude-longitudeF)>100) { //problème entre -180 et 180
		if (longitude<0) {longitude+=360;}
		if (longitudeF<0) {longitudeF+=360;}
		longitudeF=corrigeLong( (longitudeF+longitude)/2 );
	} else {longitudeF=(longitudeF+longitude)/2;}
	//longitudeF=(longitudeF+longitude)/2;
		
	// y a-t-il encore du mouvement à faire ?
	var force=force||false;
	if ((Math.abs(tailleF-taille)<1)&&(Math.abs(latitudeF-latitude)<0.01)&&(Math.abs(longitudeF-longitude)<0.01)&&(force===false)) {return false;}
	
	// on ramène à 0 les petits écarts
	if (Math.abs(tailleF-taille)<=2) {tailleF=taille;}
	if (Math.abs(latitudeF-latitude)<=0.01) {latitudeF=latitude;}
	if (Math.abs(longitudeF-longitude)<=0.01) {longitudeF=longitude;} 
	
	var ratio=hGL/lGL;
	camera.left=tailleF/-2;
	camera.right=tailleF/2;
	camera.top=tailleF/2*ratio;
	camera.bottom=tailleF/-2*ratio;
	camera.updateProjectionMatrix (true);


	var p1=calcsph(latitudeF,longitudeF+90);
	var p2=sphcart(p1);
		
	var x=p2.y*dCamera;
	var y=p2.z*dCamera;
	var z=p2.x*dCamera;
	camera.position.set(x,y,z);
	
	var d=dLampe;
	x=p2.y*d;
	y=p2.z*d;
	z=p2.x*d;
	
	var angle=-(longitude+320)/180*Math.PI;
	var x=-Math.cos (angle);
	var y=Math.sin (angle);
	
	lumiere.position.set (y,0,x);
	
	camera.lookAt(meshTerre.position);

	ctGlobe.clearRect (0,0,lGL,hGL);
	if (stadeCoupe>0)
	{
		afficheSurGlobe ("A",lat1c,long1c);
	}
	if (stadeCoupe>1)
	{
		afficheSurGlobe ("B",lat2c,long2c);
	}
	
		
    doRender();
}

function doRender () {
	renderer.render( scene, camera );
}


function deplaceCube(lecube,latcube,longcube)
{
	//console.log ('deplace cube');
	var angleRotLat=latitudeF*Math.PI/180;
	var angleRotLong=-longitudeF*Math.PI/180;
	var p1=calcsph(latcube,longcube+90);
	var p2=sphcart(p1);
	
	var x=p2.y*rTerre;
	var y=p2.z*rTerre;
	var z=p2.x*rTerre;
	lecube.position.set(x,y,z);
}
	
function effaceBoules()
{
	cube1.position.set(0,0,0);
	cube2.position.set(0,0,0);
	sphereMarqueur.position.set(0,0,0);
}

function redimBoules ()
{
	// redim des spheres
	var ech=taille/1000;
	sphereMarqueur.scale.x=ech;
	sphereMarqueur.scale.y=ech;
	sphereMarqueur.scale.z=ech;
	cube1.scale.x=ech;
	cube1.scale.y=ech;
	cube1.scale.z=ech;
	cube2.scale.x=ech;
	cube2.scale.y=ech;
	cube2.scale.z=ech;
}



// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());