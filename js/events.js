function clavier(event)
{
	var touche=((event.which)||(event.keyCode));
	if (touche==97) {
		saveAsJpeg ();
	}
}

function mouseOut(event)
{
	effaceDeroul ();
	bouton=false;
}

function mouseUp(event)
{
	effaceDeroul ();
	bouton=false;
	if (bouge)
	{
		bouge=false;
		//render();
		return false;
	}
	if(window.event)
	event = window.event; //grrr IE

	var offsets = canvGlobe.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	var c=new Object();
	c=getLongLatGlobe (mousex,mousey);
	if (!c) {return false;}
	stadeCoupe++;
	
	if (stadeCoupe>2)
	{
		stadeCoupe=1;
		effaceBoules();
		effaceLigne();
	}
	
	if (stadeCoupe==1)
	{
		lat1c=c.latitude;
		long1c=c.longitude;
		deplaceCube(cube1,lat1c,long1c);
	}
	if (stadeCoupe==2)
	{
		lat2c=c.latitude;
		long2c=c.longitude;
		
		// calcul du grand cercle
		var pta={};
		var ptb={};
		pta.lati=lat1c;
		ptb.lati=lat2c;
		pta.longi=long1c;
		ptb.longi=long2c;
		calculOrtho (pta,ptb);
		if (lcoupe<500) {
			ecranCoupeBougeGlobe ('Coupe trop petite','Eloignez les points A et B');
			coupe3DFaite=false;
			coupeFaite=false;
			stadeCoupe=0;
			effaceBoules();
			effaceLigne();
			render(true);
			return false;
		}
		if (lcoupe>10000) {
			ecranCoupeBougeGlobe ('Coupe trop grande','Rapprochez les points A et B');
			coupe3DFaite=false;
			coupeFaite=false;
			stadeCoupe=0;
			effaceBoules();
			effaceLigne();
			render(true);
			return false;
		}
		deplaceCube(cube2,lat2c,long2c);
		if (modeCoupe==0)
		{
			modifieLigne();
			trouveFoyersArc ();
			trouveVolcansArc();
			traceCoupe(ctCoupe);
		}

	}

	render(true);
}



function getLongLatGlobe (x,y)
{
	var tailleCadre=lGL/taille*2000;
	
	x=x-lGL/2;
	y=y-hGL/2;
	
	x=x/tailleCadre*2;
	y=y/tailleCadre*2;
	
	var r=Math.sqrt (x*x+y*y);
	
	if (r>1)
	{
		return false;
	}
	
	var laty=-Math.asin(y);
	var latyDeg=laty/Math.PI*180;
	
	
	var tailleCorde=Math.cos(laty);
	var longx=Math.asin(x/tailleCorde);
	var longxDeg=longx/Math.PI*180;
	
	var angleRotLat=-latitudeF*Math.PI/180;
	var angleRotLong=longitudeF*Math.PI/180;
	
	//var longxDeg2=longxDeg+longitude;
	
	var p1,p2,p3,p4,p5;
	p1=calcsph(latyDeg,longxDeg);
	//console.log ("p1.phi="+p1.phi/Math.PI*180);
	p2=sphcart(p1);
	//console.log ("p2.y="+p2.y);
	p3=rotateY(p2,angleRotLat);
	p4=rotateZ(p3,angleRotLong);
	//console.log ("p4.y="+p4.y);
	p5=cartsph(p4);
	//console.log ("p5.phi="+p5.phi/Math.PI*180);
	var latRot=p5.theta/Math.PI*180;
	latRot=90-latRot;
	var longRot=p5.phi/Math.PI*180;
	
	//console.log ("lat long écran ="+latyDeg+" "+longxDeg);
	//console.log ("lat long ="+Math.round(latRot*10)/10+", "+Math.round(longRot*10)/10+" alti="+altitude(latRot,longRot));	
		
	var coords={};
	coords.latitude=latRot;
	coords.longitude=longRot;
	return coords;
}

function initMolette () {
	window.addEventListener('mousewheel', function(e) {
	if (e.ctrlKey) {
			e.preventDefault();
		}
	});
	
	var elem = document.getElementById ("canv_globe");
	
	if (elem.addEventListener) {    // all browsers except IE before version 9
			// Internet Explorer, Opera, Google Chrome and Safari
		elem.addEventListener ("mousewheel", molette, false);
			// Firefox
		elem.addEventListener ("DOMMouseScroll", molette, false);
	}
	else {
		if (elem.attachEvent) { // IE before version 9
			elem.attachEvent ("onmousewheel", molette);
		}
	}
}

function initMoletteCoupe () {
	var elem = canvSurCoupe;
	if (elem.addEventListener) {    // all browsers except IE before version 9
			// Internet Explorer, Opera, Google Chrome and Safari
		elem.addEventListener ("mousewheel", moletteCoupe, false);
			// Firefox
		elem.addEventListener ("DOMMouseScroll", moletteCoupe, false);
	}
	else {
		if (elem.attachEvent) { // IE before version 9
			elem.attachEvent ("onmousewheel", moletteCoupe);
		}
	}
}

function molette(e) {
	// cross-browser wheel delta
	effaceDeroul ();
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if (delta<0)
	{
		taille=taille*1.1;
		if (taille>4000) {taille=4000;}
	}
	else if (delta>0)
	{
		taille=taille/1.1;
		if (taille<tailleMin) {taille=tailleMin;}
	}	
	redimBoules	();
	render(true);
}

function moletteCoupe(e) {
	// cross-browser wheel delta
	var e = window.event || e; // old IE support

	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	effaceDeroul ();	
	
	if (modeCoupe==0){
		if (delta>0)
		{
			exag+=0.5;
			if (exag>exagMax) {exag=exagMax;}
		}
		else if (delta<0)
		{
			exag-=0.5;
			if (exag<exagMin) {exag=exagMin;}
		}	
		setSliderExag ();
		if (coupeFaite) {traceCoupe(ctCoupe);}
	}
}

function afficheLatLong(x,y)
{
	var c=getLongLatGlobe (x,y);
	ctCoords.clearRect(0,0,canvCoords.width,canvCoords.height);
	if (!c) {
		document.body.style.cursor = 'default';
		return false;
	}
	document.body.style.cursor = 'pointer';
	var texteCoord1=Math.round(c.latitude*10)/10+"°N"
	var texteCoord2=Math.round(c.longitude*10)/10+"°E";
	ctCoords.font=mFont3;
	ctCoords.fillStyle="white";
	var marge=hGL*0.005;
	var tailleMax=ctCoords.measureText("-999.9°NX").width;
	ctCoords.fillText(texteCoord1,marge,canvCoords.height-marge);
	ctCoords.fillText(texteCoord2,marge+tailleMax,canvCoords.height-marge);
	
	var alti=Math.round(altitude(c.latitude,c.longitude));
	ctCoords.fillText("Altitude:"+alti+"m",marge+tailleMax*2,canvCoords.height-marge);
	
	var tailleMax2=ctCoords.measureText("Altitude:-9999mXXX").width;
	var epCroute=Math.round(profmoho(c.latitude,c.longitude)*10)/10;
	ctCoords.fillText("Epaisseur crustale:"+epCroute+"km",marge+tailleMax*2+tailleMax2,canvCoords.height-marge);
	
	var tailleMax3=ctCoords.measureText("Epaisseur crustale:100kmXXX").width;
	if (lcoupe>0) {
		ctCoords.fillText("Longueur de la coupe:"+Math.round(lcoupe)+"km",marge+tailleMax*2+tailleMax2+tailleMax3,canvCoords.height-marge);
	}
}

function bougeGlobe(event)
{
	effaceDeroul ();
	
	if(window.event)
	event = window.event; //grrr IE

	var offsets = canvGlobe.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	if (!bouton) {
		afficheLatLong(mousex,mousey);
		return false;
	}
	
	document.body.style.cursor = 'move';
	
	var dx=mousex-xMD;
	var dy=mousey-yMD;
		
	var distance=Math.sqrt(dx*dx+dy*dy);
	if (distance<=2) { 
		return false;
	}
	bouge=true;
	
	var maxGL=lGL;
	if (hGL>maxGL) {maxGL=hGL;}
	
	longitude-=dx*taille/maxGL/18;
	longitude=corrigeLong(longitude);
	latitude+=dy*taille/maxGL/18;
	
	if (latitude>80) {latitude=80;}
	
	if (latitude<-80) {latitude=-80;}

	xMD=mousex;
	yMD=mousey;
	//render();

}

function corrigeLong(l)
{
	if (l>180)
	{
		l=l-360;
	}
	else
	if (l<=-180)
	{
		l=l+360;
	}
	return l;
}
	
function mouseDownGlobe(event)
{
	effaceDeroul ();
	bouton=true;
	if(window.event)
	event = window.event; //grrr IE

	var offsets = canvGlobe.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	xMD=mousex;
	yMD=mousey;
}
