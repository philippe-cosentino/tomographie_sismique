var xCentre,yCentre,angleCoupe,rArcBas,echelleR,angle0C,angle1C;
var x0CT,y0CT,hCT,lCT;

function traceCoupe (ctx,rapide) {
		
	rapide=rapide||false;
	stopCoupeHD();	
	effaceCoupeHD();
	requestAnimationFrame (   function(){ traceCoupeEtape1(ctx,rapide); });
}

function traceCoupeEtape1 (ctx,rapide) {
	rapide=rapide||false;
	divCalcul.style.display="block";
	requestAnimationFrame (   function(){ traceCoupeEtape2(ctx,rapide); }   );
}

function traceCoupeEtape2 (ctx,rapide) {
	rapide=rapide||false;
	
	effaceCoupe(ctx);
	ctSurCoupe.clearRect(0,0,lGL,hGL);

	calcAngleCoupe();
	calcCroute (ctx);	
	traceTomo (ctx);	
	traceCoupeEtape3(ctx,rapide);
}

function traceCoupeEtape3 (ctx,rapide) {
	traceCroute (ctx);
	traceCarresMonochromes(ctx);
	var espaceSousCoupe=Math.round(hCT*0.02);
	var hBandeau=Math.round(hCT*0.025);
	var lBandeau=Math.round(lCT*0.7);
	var margeBandeau=Math.round(lCT*0.1);
	afficheLegendeCouleurs (ctCoupe,x0CT+lCT/2-lBandeau/2,y0CT+hCT+espaceSousCoupe,lBandeau,hBandeau,lCT/100);
	traceGraduations (ctx);

	if (rapide===false) {
		// on recalcule le rectangle sur le globe
		var pta={};
		var ptb={};
		pta.lati=lat1c;
		ptb.lati=lat2c;
		pta.longi=long1c;
		ptb.longi=long2c;
		calculRectangle(pta,ptb);
		modifieLigneRect(false);
		calculRectangle(ptb,pta);
		modifieLigneRect(true);
		render(true);
	}
	
	if (foyersVisibles) {
		afficheFoyersSurCoupe (ctx);

	}
	
	if (volcansVisibles) {
		afficheVolcansSurCoupe (ctx);
	}
	
	coupeFaite=true;
	document.getElementById("div_conteneur_controles").style.display="block";
	setSliders();
	traceBarreMenu();
	mode2="coupe2d";	
	divCalcul.style.display="none";
	if ((coupeHDEnCours===false)&&(lissage===true)) {traceCoupeHD();}
}



function traceCroute (ctx) {
	ctx.globalAlpha   = 0.75;
	ctx.drawImage(canvTempCoupe, 0, 0);
	ctx.globalAlpha   = 1;
}

function calcAngleCoupe () {
	angleCoupe=lcoupe/rayonTerre;
	angle0C=-Math.PI/2-angleCoupe/2;
	angle1C=-Math.PI/2+angleCoupe/2;
}

function calcCroute (ctx) {
	canvTempCoupe.width=lGL;
	canvTempCoupe.height=hGL;
	ctxTempCoupe.clearRect(0,0,lGL,hGL);
	
	// altitude max
	var altiMax=-10000;
	for (var i=0;i<nbwp;i++)
	{
		lati=wpgc[i].lati;
		longi=corrigeLong(wpgc[i].longi);
		alti=altitude(lati,longi)/1000; // en km
		if (alti>altiMax) {altiMax=alti;}
	}
	
	// x0S etc. cadre contenant le secteur angulaire
	var margeX=lCT*0.05;
	var margeY=hCT*0.05;
	var x0S=x0CT+margeX;
	var y0S=y0CT+margeY;
	var lS=lCT-margeX*2;
	var hS=hCT-margeY*2;	
	var y1S=y0S+hS;
	var x1S=x0S+lS;
	
	//ctxTempCoupe.strokeStyle="rgba(255,0,0,0.1)";
	//ctxTempCoupe.strokeRect(x0S,y0S,lS,hS);
	
	var dimMax=Math.max (profMax,lcoupe);
	echelleR=lS/dimMax*2;
	var rayonBas=rayonTerre-profMax // rayon du à la profondeur max
	xCentre=x0S+lS/2;
	
	// calcul des dimensions du secteur	
	do {	
		// on diminue un peu l'échelle
		echelleR=echelleR*0.98;
		// on calcule les coord des arcs
		yCentre=y0S+hS/2;
		var rMax=alti2R(altiMax);
		var rMer=alti2R(0);
		rArcBas=rayonBas*echelleR;
		
		var yHM=yCentre-rMax; // arc haut centre
		var yHG=yCentre+Math.sin(angle0C)*rMer; // arc coin haut gauche
		var yBG=yCentre+Math.sin(angle0C)*rArcBas;	
		var hautSecteur=yBG-yHM;
		
		// on descend le secteur pour centrer
		yCentre+=(y1S-yBG)-(hS-hautSecteur)/2;
		var yHG=yCentre+Math.sin(angle0C)*rMer;
		var yBG=yCentre+Math.sin(angle0C)*rArcBas;
		var yHM=yCentre-rMax;
		
		
		// calcul des limites gauches des arcs
		var xBG=xCentre+Math.cos(angle0C)*rArcBas; // limite gauche de l'arc bas
		var xHG=xCentre+Math.cos(angle0C)*rMer; // limite gauche de l'arc haut
	} while ((xHG<x0S)||(yHM<y0S))
		
	var xBD=xCentre+Math.cos(angle1C)*rArcBas; // limite droite de l'arc bas
	var yBD=yCentre+Math.sin(angle1C)*rArcBas;

	
	// tracé du secteur niveau de la mer
	ctxTempCoupe.strokeStyle="rgba(0,0,0,0.5)";
	ctxTempCoupe.beginPath();
	ctxTempCoupe.arc(xCentre,yCentre,rMer,angle0C,angle1C); // arc haut

	ctxTempCoupe.arc(xCentre,yCentre,rArcBas,angle1C,angle0C,true); // arc bas
	
	ctxTempCoupe.lineTo (xHG,yHG);
	ctxTempCoupe.stroke();
	ctxTempCoupe.fillStyle="rgb(100,200,255)";
	ctxTempCoupe.fill(); // on remplit d'eau bleue
	
	var lati,alti,longi,anglei,x,y,r;
	// tracé du relief 
	ctxTempCoupe.beginPath();
	for (var i=0;i<nbwp;i++)
	{
		lati=wpgc[i].lati;
		longi=corrigeLong(wpgc[i].longi);
		alti=altitude(lati,longi);
		anglei=i/(nbwp-1)*angleCoupe+angle0C;
		r=rMer+alti/1000*echelleR*exag;
		x=xCentre+Math.cos(anglei)*r;
		y=yCentre+Math.sin(anglei)*r;
		if (i==0) {ctxTempCoupe.moveTo(x,y);}
		else {ctxTempCoupe.lineTo(x,y);}
	}
	
	ctxTempCoupe.lineTo(xBD,yBD);
	ctxTempCoupe.arc(xCentre,yCentre,rArcBas,angle1C,angle0C,true); // arc bas
	ctxTempCoupe.closePath();
	
	ctxTempCoupe.stroke();
	ctxTempCoupe.fillStyle="rgb(200,200,200)";
	ctxTempCoupe.fill();
	
	if (sedim===true) {
		// tracé des sédiments
		ctxTempCoupe.beginPath();
		// relief surface
		for (var i=(nbwp-1);i>=0;i--)
		{
			lati=wpgc[i].lati;
			longi=corrigeLong(wpgc[i].longi);
			alti=altitude(lati,longi);
			anglei=i/(nbwp-1)*angleCoupe+angle0C;
			r=rMer+alti/1000*echelleR*exag;
			x=xCentre+Math.cos(anglei)*r;
			y=yCentre+Math.sin(anglei)*r;
			if (i==(nbwp-1)) {ctxTempCoupe.moveTo(x,y);}
			else {ctxTempCoupe.lineTo(x,y);}
		}
		// relief sans sédiments ni glace
		for (var i=0;i<nbwp;i++)
		{
			lati=wpgc[i].lati;
			longi=corrigeLong(wpgc[i].longi);
			epg=epGlace(lati,longi)*1000;
			alti=altitude(lati,longi)-epGlace(lati,longi)*1000-epSediments(lati,longi)*1000;
			anglei=i/(nbwp-1)*angleCoupe+angle0C;
			r=rMer+alti/1000*echelleR*exag;
			x=xCentre+Math.cos(anglei)*r;
			y=yCentre+Math.sin(anglei)*r;
			ctxTempCoupe.lineTo(x,y);
		}
		
		ctxTempCoupe.closePath();
		ctxTempCoupe.fillStyle="rgb(240,240,200)";
		ctxTempCoupe.stroke();
		ctxTempCoupe.fill();		
		// fin tracé sédiments
		
		// tracé de la glace
		ctxTempCoupe.beginPath();
		// relief surface
		for (var i=(nbwp-1);i>=0;i--)
		{
			lati=wpgc[i].lati;
			longi=corrigeLong(wpgc[i].longi);
			alti=altitude(lati,longi);
			anglei=i/(nbwp-1)*angleCoupe+angle0C;
			r=rMer+alti/1000*echelleR*exag;
			x=xCentre+Math.cos(anglei)*r;
			y=yCentre+Math.sin(anglei)*r;
			if (i==(nbwp-1)) {ctxTempCoupe.moveTo(x,y);}
			else {ctxTempCoupe.lineTo(x,y);}
		}
		// relief sans glace
		for (var i=0;i<nbwp;i++)
		{
			lati=wpgc[i].lati;
			longi=corrigeLong(wpgc[i].longi);
			epg=epGlace(lati,longi)*1000;
			alti=altitude(lati,longi)-epGlace(lati,longi)*1000;
			anglei=i/(nbwp-1)*angleCoupe+angle0C;
			r=rMer+alti/1000*echelleR*exag;
			x=xCentre+Math.cos(anglei)*r;
			y=yCentre+Math.sin(anglei)*r;
			ctxTempCoupe.lineTo(x,y);
		}
		
		ctxTempCoupe.closePath();
		ctxTempCoupe.fillStyle="rgb(255,255,255)";
		ctxTempCoupe.stroke();
		ctxTempCoupe.fill();		
		// fin tracé glace
		
		
	} // fin tracé glace et sédiments
		
	
	// tracé du Moho
	ctxTempCoupe.beginPath();
	for (var i=0;i<nbwp;i++)
	{
		lati=wpgc[i].lati;
		longi=corrigeLong(wpgc[i].longi);
		alti=-profmoho(lati,longi)*1000;
		anglei=i/(nbwp-1)*angleCoupe+angle0C;
		r=rMer+alti/1000*echelleR*exag;
		x=xCentre+Math.cos(anglei)*r;
		y=yCentre+Math.sin(anglei)*r;
		if (i==0) {ctxTempCoupe.moveTo(x,y);}
		else {ctxTempCoupe.lineTo(x,y);}
	}
	ctxTempCoupe.lineTo(xBD,yBD);
	ctxTempCoupe.arc(xCentre,yCentre,rArcBas,angle1C,angle0C,true); // arc bas
	ctxTempCoupe.closePath();
	
	ctxTempCoupe.stroke();
	
	// on efface tout ce qui est sous le Moho
	ctxTempCoupe.globalCompositeOperation = 'destination-out';
	ctxTempCoupe.fill();
	ctxTempCoupe.globalCompositeOperation = 'source-over';
}

function creeHachures () {
	var lHach=Math.floor(hGL/120)*10;
	canvHachures.height=lHach;
	canvHachures.width = lHach;
	ctHachures.fillStyle="white";
	ctHachures.fillRect(0,0,lHach,lHach);
	ctHachures.strokeStyle="rgb(235,235,235)";
	for (var i=-9;i<10;i++) {
		var x=i/10*lHach;
		ctHachures.beginPath;
		ctHachures.moveTo(x,0);
		ctHachures.lineTo(x+lHach,lHach);
		ctHachures.stroke();
		ctHachures.closePath;		
	}
	

	
	var lHach2=lHach/2;
	canvHachures2.height=lHach2;
	canvHachures2.width=lHach2;
	ctHachures2.drawImage (canvHachures,0,lHach2,lHach2,lHach2,0,0,lHach2,lHach2);
	patternHachures = ctCoupe.createPattern(canvHachures2, 'repeat');
}

function traceTomo (ctx) {

	// ###############
	// tracé tomographie
	// ###############
	

	
	// recherche de la tranche maximale de profondeur
	var trpmax=getTrpmax();
	var angleVoxel=angleCoupe/nbwp;
	var angleRel0,angleRel1;
	var x,y,lati,longi,prof,v;

	var maxAnom=-99;
	var minAnom=99;
	
	for (var i=0;i<nbwp;i++)
	{
		angleRel0=angle0C+angleVoxel*i;
		angleRel1=angleRel0+angleVoxel;
		lati=wpgc[i].lati;
		longi=corrigeLong(wpgc[i].longi);
		longi=wpgc[i].longi;
		
		for (var j=0;j<trpmax;j++) {
			trancheAnom=j;
			profPlafond=trancheProfs[j];
			profPlancher=trancheProfs[j+1];
			rPlafond=alti2R(-profPlafond);
			rPlancher=alti2R(-profPlancher);
			if (rPlancher<rArcBas) {rPlancher=rArcBas;}
			ctx.beginPath();
			x=xCentre+Math.cos(angleRel0)*rPlafond;
			y=yCentre+Math.sin(angleRel0)*rPlafond;
			ctx.moveTo (x,y);
			x=xCentre+Math.cos(angleRel1)*rPlafond+1;
			y=yCentre+Math.sin(angleRel1)*rPlafond;
			ctx.lineTo (x,y);
			x=xCentre+Math.cos(angleRel1)*rPlancher+1;
			y=yCentre+Math.sin(angleRel1)*rPlancher+1;
			ctx.lineTo (x,y);
			x=xCentre+Math.cos(angleRel0)*rPlancher;
			y=yCentre+Math.sin(angleRel0)*rPlancher+1;
			ctx.lineTo (x,y);
			ctx.closePath();
			v=valAnom(lati,longi,trancheAnom);
			if (contrasteAuto===true) {
				if (v>maxAnom) {maxAnom=v;} else if (v<minAnom) {minAnom=v;}
			}
			c=calcCoul (v);
			//c="rgb("+Math.round(v*12+128)+",1,1)";
			if (j==0) {
				//c="rgb(240,255,240)";
				ctx.fillStyle = patternHachures;
				ctx.fill();
			}
			else {
				ctx.fillStyle=c;
				ctx.fill();
			}
			
		}
	}
		
	if (contrasteAuto===true) {
		v=Math.max(maxAnom,-minAnom);
		c=8/v;
		if (c>8) {c=8;}
		if (c<0.5) {c=0.5;}
		if (c!=contra) {
			contra=c;
			preCalcCoul();
			setSliderContraste();
			traceTomo(ctx);
		}
	}
}


function traceCarresMonochromes(ctx) {
	if (!monochrome) {return false;}
	var espace=lCT/30;
	var obj={};
	var v,large;
	var lMax=lCT/100;
	var large;
	ctx.fillStyle="black";
	for (var x=x0CT;x<(x0CT+lCT);x+=espace) {
		for (var y=y0CT;y<(y0CT+hCT);y+=espace) {
			// on calcule l'angle du point
			obj=xy2latlongprof (x,y);
			if ((obj.inAngle)&&(obj.prof>29)) {
				v=obj.anom;
				large=taileCarre (v,lMax);
				ctx.fillRect (x-large/2,y-large/2,large,large);
			}
		}
	}	
}

function traceGraduations (ctx) {
	// échelle profondeur
	ctx.textAlign="right";
	var x,y,r;
	ctx.strokeStyle="#777777";
	ctx.fillStyle="black";
	var lTrait=lCT/100;
	var hFont=Math.round(hCT/4.5)/10;
	ctx.font=hFont+"px "+dFont;
	
	var h1=100*exag*echelleR;
	var h2=(profMax-100)*echelleR;
	var pas1=calcPas(100,h1,hFont);
	var pas2=calcPas(profMax-100,h2,hFont);

	for (var i=0;i<profMax;i+=10) {
		r=alti2R (-i);
		if (((i<100)&&((i%pas1)==0)) || ((i%pas2)==0) ) {
			ctx.beginPath();
			x=xCentre+Math.cos(angle0C)*r;
			y=yCentre+Math.sin(angle0C)*r;
			ctx.save();
			ctx.translate(x,y);
			ctx.rotate(angle0C+Math.PI/2);
			ctx.moveTo(0,0);
			ctx.lineTo(-lTrait,0);
			ctx.stroke();
			ctx.fillText (i+" km ",-lTrait,hFont*0.3);
			ctx.restore();
		}
		
	}
	ctx.textAlign="right";
	var hFont=Math.round(hCT/3)/10;
	ctx.font=hFont+"px "+dFont;
	var rMer=alti2R(0);
	x=xCentre+Math.cos(angle0C)*rMer;
	y=yCentre+Math.sin(angle0C)*rMer;
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(angle0C+Math.PI/2);
	ctx.fillText ("A",-hFont*0.4,-hFont/2);
	ctx.restore();
	
	ctx.textAlign="left";
	x=xCentre+Math.cos(angle1C)*rMer;
	y=yCentre+Math.sin(angle1C)*rMer;
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(angle1C+Math.PI/2);
	ctx.fillText ("B",hFont*0.4,-hFont/2);
	ctx.restore();
}

function calcPas (prof,h,hFont) {
	var pas=Math.round(prof/h/hFont*30)*10;
	if (pas==30) {pas=50;}
	else if (pas==40) {pas=50;}
	else if (pas==60) {pas=50;}
	else if (pas==70) {pas=50;}
	else if (pas==80) {pas=100;}
	else if (pas==90) {pas=100;}
	else if (pas>500) {pas=Math.round(pas/500)*500;}
	else if (pas>200) {pas=Math.round(pas/200)*200;}
	else if (pas>100) {pas=Math.round(pas/100)*100;}
	return pas;
}

function xy2latlongprof (x,y) {
	var lisse=lisse||false;
	var coteOppose=x-xCentre;
	var coteAdjacent=yCentre-y;
	var hypothenuse=Math.sqrt(coteOppose*coteOppose+coteAdjacent*coteAdjacent);
	var si=coteOppose/hypothenuse;
	var angle=Math.asin(si);
	var angleRel=angle/angleCoupe+0.5;
	var irel=Math.floor(angleRel*(nbwp-1));
	var obj={};
	if ((angleRel<0)||(angleRel>1)) {
		obj.inAngle=false;
	} else {
		obj.lati=wpgc[irel].lati;
		obj.longi=wpgc[irel].longi;
		var altiS=altitude(obj.lati,corrigeLong(obj.longi))/1000;
		var prof=r2prof(hypothenuse);
		if ((prof>profMax)||(prof<-altiS)) {
			obj.inAngle=false;
		} else {
			obj.inAngle=true;
			obj.prof=prof;
			obj.anom=valAnom(obj.lati,obj.longi,prof2tranche(prof));			
		}
	}
	return obj;
}

function r2prof (r) { //km
	var alti=9999;
	var r100=rayon100*echelleR;
	if (r<r100) {
		// pas d'exagération
		alti=r/echelleR;
	} else {
		// on est au dessus des -100 km, exagération
		var rAuDessus=r-r100;
		var altiAuDessus=rAuDessus/exag/echelleR;
		alti=rayon100+altiAuDessus;
	}
	var prof=rayonTerre-alti;
	
	return prof;
}

function taileCarre (v,lMax) {
	var v1=v/8*contra;
	if (v1>1) {v1=1;}
	if (v1<0.1) {return 0;}
	v1=(v1+0.1)*lMax;
	return v1;
}

var spectreCoul=new Array();
var spectreBrut=new Array();

var nbValSpectre=4096;
var nSpectre=1;

function preCalcSpectres () {
	var spec;
	spec=chroma.scale("Spectral");
	preCalcSpectre (0,spec);
	spec=chroma.scale(['red', 'white', 'blue']);
	preCalcSpectre (1,spec);
	spec=chroma.scale(['ff7777', 'black','7777ff']);
	preCalcSpectre (2,spec);
	spec=chroma.scale(['ffffff', '111111']);
	preCalcSpectre (3,spec);
	spec=chroma.scale(['111111', 'ffffff']);
	preCalcSpectre (4,spec);
}

function preCalcSpectre (n,spec) {
	spectreBrut[n]=new Object;
	spectreBrut[n].tCoul=new Array();
	for (var i=0;i<nbValSpectre;i++) {
		var v1=(i-nbValSpectre/2)/nbValSpectre+0.5;
		var nc1=Math.round(spec(v1)._rgb[0]);
		var nc2=Math.round(spec(v1)._rgb[1]);
		var nc3=Math.round(spec(v1)._rgb[2]);	
		spectreBrut[n].tCoul[i]="rgb("+nc1+","+nc2+","+nc3+")";		
	}
}

function preCalcCoul () {
	for (var i=0;i<nbValSpectre;i++) {
		var vr=(i-nbValSpectre/2)/nbValSpectre;
		var v1=vr*contra+0.5;
		if (v1<0) {v1=0;} else if (v1>1) {v1=1;}
		var c=spectreBrut[nSpectre].tCoul[Math.round(v1*(nbValSpectre-1))];
		spectreCoul[i]=c;		
	}
}

function calcCoul(v) {
	// de -8 à +8
	if (v<-8) {v=-8;}
	else if (v>8) {v=8;}
	var n=Math.floor((v+8)/16*nbValSpectre);
	return spectreCoul[n];
}

	
function alti2R (alti) { // en km
	var r;
	if (alti<-100) {
		// pas d'exagération
		r=(rayonTerre+alti)*echelleR;
	} else {
		r=(rayon100+100*exag+alti*exag)*echelleR;
	}
	return r;
}

function getTrpmax() {
	i=0;
	do {
		i++;
	} while ((profMax>trancheProfs[i])&&(i<trancheProfs.length));
	return i;
}

function vraieAno (ano) {
	var vraieano=Math.round((ano/4096*15-7.5)*20)/20;
	return vraieano;
}

function prof2tranche(prof) {
	i=0;
	do {
		i++;
	} while ((prof>=trancheProfs[i])&&(i<trancheProfs.length));
	return i-1;
}


function changeContraste (v) {
	var cMin=0.5;
	var cMax=8;
	contra=Math.floor(v/10*7+cMin/10)/10;
	contra=v/100*(cMax-cMin)+cMin;
	document.getElementById('valeur-ranger1').innerHTML = Math.round(contra*100) + '%';
	preCalcCoul();
	if (coupeFaite) {traceCoupe (ctCoupe,true);}
}

function changeExag (v) {
	exag=v/100*(exagMax-exagMin)+exagMin;
	document.getElementById('valeur-ranger3').innerHTML = "&#215;"+Math.round(exag*10)/10;
	if (coupeFaite) {traceCoupe (ctCoupe,true);}
}

function changeProfMax (v) {
	var pMin=110;
	var pMax=rayonTerre-rayonNoyau;
	profMax=Math.floor((pMax-pMin)*v/100+pMin);
	document.getElementById('valeur-ranger2').innerHTML = profMax+ 'km';
	if (coupeFaite) {traceCoupe(ctCoupe,true);}
}

function setSliderProfMax () {
	var pMin=110;
	var pMax=rayonTerre-rayonNoyau;
	var v=(profMax-pMin)/(pMax-pMin)*100;
	setSliderValue("range-slider-2",v);
	document.getElementById('valeur-ranger2').innerHTML = profMax+ 'km';
}

function setSliderExag () {
	var v=(exag-exagMin)/(exagMax-exagMin)*100;
	setSliderValue("range-slider-3",v);
	document.getElementById('valeur-ranger3').innerHTML = "&#215;"+Math.round(exag*10)/10;
}

function setSliderContraste () {
	var cMin=0.5;
	var cMax=8;
	var v=(contra-cMin)/(cMax-cMin)*100;
	setSliderValue("range-slider-1",v);
	document.getElementById('valeur-ranger1').innerHTML = Math.round(contra*100)+ '%';
}

function traceSpectre (ctx,x,y,l,h) {
	ctx.clearRect(x,y,l,h);
	for (var i=0;i<l;i++) {
		var v=(i/(l-1))*16-8;
		var c=calcCoul(v);
		ctx.fillStyle=c;
		ctx.fillRect(x+i,y,1,h);
	}
}

function traceSpectreBrut (n,ctx,x,y,l,h) {
	for (var i=0;i<l;i++) {
		var v=Math.round((i/(l-1))*(nbValSpectre-1));
		var c=spectreBrut[n].tCoul[v];
		ctx.fillStyle=c;
		ctx.fillRect(x+i,y,1,h);
	}
}

function afficheLegendeCouleurs (ctx,x,y,l,h,lMax) {

	traceSpectre (ctx,x,y,l,h);
	ctx.fillStyle="black";
	
	// texte légende
	var yt=y+hGL/30;
	ctx.font=mFont3;
	ctx.fillStyle="black";
	for (var i=-7;i<=7;i++) {
		var xt=(i+7)/16*l+l/21;
		var t=i+"";
		if (t>0) {t="+"+t;}
		if (t==0) {t=" "+t;}
		ctx.fillText (t,x+xt,yt);
	}
		
	if (monochrome) {
		for (var i=11;i<20;i++) {
			var v=((i-10)/10)*8;
			var large=taileCarre (v,lMax);
			ctx.fillRect (x+i/20*l-large/2,y+h/2-large/2,large,large);
		}
	}
	var xt=x-l/60;
	ctx.textAlign="right";
	ctx.fillText ("Anomalie de vitesse",xt,yt-h*1.1);
	ctx.fillText ("sismique (en %) :",xt,yt-h*0.1);
	ctx.textAlign="left";
		
}

function checkContrasteAuto() {
	contrasteAuto=!contrasteAuto;
	
	if (contrasteAuto===true) {
		document.getElementById("check_contrasteauto").style.display="block";
		document.getElementById("range-slider-1").style.pointerEvents = "none";
		document.getElementById("range-slider-1").style.opacity = "0.25";
		document.getElementById("range-slider-1").style.cursor = "not-allowed";
		
	} else {
		document.getElementById("check_contrasteauto").style.display="none";
		document.getElementById("range-slider-1").style.pointerEvents = "auto";
		document.getElementById("range-slider-1").style.opacity = "1";
		document.getElementById("range-slider-1").style.cursor = "pointer";
	}

	setSliders();
	
	if (coupeFaite) {
		traceCoupe(ctCoupe);
	}
}