function survolMenu(event) {
	if(window.event)
	event = window.event; 

	var offsets = canvMenu.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	var x=Math.floor(mousex/lMenu*10);
	
	if (x!=nMenu) {effaceDeroul();}
	
	if ( (x>4) || ((x==3)&&((!coupeFaite)||(!exportPossible)) ) ){document.body.style.cursor = 'default';effaceDeroul();return false;}
	
	document.body.style.cursor = 'pointer';
}

function effaceDeroul () {
	nMenu=-1;
	canvDeroul.style.display="none";
}

function mouseUpDeroul(event) {
	if (nMenu<0) {effaceDeroul();return false;}
	
	if(window.event)
	event = window.event; 

	var offsets = canvDeroul.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	var hFont=Math.round(hMenu*0.6*10)/10;
	var hLigne=hFont*2;
	
	var nClicMenu=Math.floor(mousey/hLigne);
	
	if (nMenu==0) // choix du modèle tomographique
	{
		if (nClicMenu==0) {nModeleTomo=0;selectModele();}
		else if (nClicMenu==1) {nModeleTomo=1;selectModele();}
		if (mode2=="consignes") {afficheConsignes();}
		else if (mode2=="infosmodeles")	{afficheInfosModeles()}
		else if ((mode2=="coupe2d")&&(coupeFaite===true)) {traceCoupe(ctCoupe);}
	}
	
	if (nMenu==1)
	{
		effaceBoules();
		effaceLigne();
		stadeCoupe=0;
		coupeFaite=false;
		coupe3DFaite=false;
		modeCoupe=nClicMenu;
		afficheConsignes();
		redim();
	}
	
	if (nMenu==3)
	{
		if ((nClicMenu==1)&&(modeCoupe==1)&&(coupe3DFaite===true)&&(exportPossible===true)) {
			exportSTL();
		}
		else if (nClicMenu==0) {
			saveAsJpeg ();
		}
		
	}
	
	if (nMenu==4) // a propos
	{
		
		if (nClicMenu==0) {
			afficheInfosModeles();
		}
		else if (nClicMenu==1) {
			contactAuteur ();
		}
		
	}
	
	if (nMenu==2) // clic sur menu affichage
	{
		if (nClicMenu==0) {
			checkLissage();
		}
		
		if ((nClicMenu==1)&&(modeleUtil==2)) {
			sedim=!sedim;
			redim();
		}
		
		if (nClicMenu==2) {
			checkFoyers();
		}
		
		if (nClicMenu==3) {
			checkVolcans();
		}
		
		if (nClicMenu==4) {
			bump++;
			if (bump>3) {bump=0;}
			recalcBump();
			render(true);
		}

		if (nClicMenu==5) {
			checkContrasteAuto();
		}
		
		if (nClicMenu==6) {
			checkNB();
		}
		
		// clic sur un spectre
		if ((nClicMenu>=9)&&(nClicMenu<=13)) {
			nSpectre=nClicMenu-9;
			preCalcCoul();
			if ((modeCoupe==0)&&(coupeFaite)) {
				traceCoupe(ctCoupe);
			}
		}
	}
		
	effaceDeroul();
}

function mouseUpMenu(event) {
	if(window.event)
	event = window.event; 

	var offsets = canvMenu.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	var x=Math.floor(mousex/lMenu*10);
	
	if ( (x>4) || ((x==3)&&(!coupeFaite)) ){document.body.style.cursor = 'default';effaceDeroul();return false;}
	
	nMenu=x;
	
	canvDeroul.style.left=nMenu/10*lMenu+"px";
	canvDeroul.style.top="0px";
	
	
	var hFont=Math.round(hMenu*0.6*10)/10;
	var hLigne=hFont*2;
		
	if (nMenu==0)
	{
		var marge=lMenu*0.01;
		ctDeroul.font=hFont+"px "+dFont;
		var metrics = ctDeroul.measureText("S362-ANI X");
		var largeurTexte = metrics.width+marge*2;
		canvDeroul.height=hLigne*2;
		canvDeroul.width=largeurTexte;
		ctDeroul.font=hFont+"px "+dFont; // le redim du canv reinit ct.font
		ctDeroul.fillStyle="rgb(150,150,150)";
		ctDeroul.fillRect (0,0,canvDeroul.width,canvDeroul.height);
		var x=0+marge;
		var y=hLigne-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		ctDeroul.clearRect (0,0,canvDeroul.width,1);

		var texte="GAP-P4";
		if (nModeleTomo==0) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		y=hLigne*2-hFont*0.7;
		
		var texte="S362-ANI";
		if (nModeleTomo==1) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		y=hLigne*3-hFont*0.7;

	}
	
	if (nMenu==1)
	{
		var marge=lMenu*0.01;
		ctDeroul.font=hFont+"px "+dFont;
		var metrics = ctDeroul.measureText("Coupe en 2 dimensions X");
		var largeurTexte = metrics.width+marge*2;
		canvDeroul.height=hLigne*1;
		canvDeroul.width=largeurTexte;
		ctDeroul.font=hFont+"px "+dFont; // le redim du canv reinit ct.font
		ctDeroul.fillStyle="rgb(150,150,150)";
		ctDeroul.fillRect (0,0,canvDeroul.width,canvDeroul.height);
		var x=0+marge;
		var y=hLigne-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		var texte="Coupe en 2 dimensions ";
		if (modeCoupe==0) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
	}
	
	if ((nMenu==3)&&(exportPossible))
	{
		var marge=lMenu*0.01;
		ctDeroul.font=hFont+"px "+dFont;
		var metrics = ctDeroul.measureText("Au format STL (impression 3D)");
		var largeurTexte = metrics.width+marge*2;
		canvDeroul.height=hLigne*1;
		canvDeroul.width=largeurTexte;
		ctDeroul.font=hFont+"px "+dFont; // le redim du canv reinit ct.font
		ctDeroul.fillStyle="rgb(150,150,150)";
		ctDeroul.fillRect (0,0,canvDeroul.width,canvDeroul.height);
		var x=0+marge;
		var y=hLigne-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		ctDeroul.fillStyle="rgba(0,0,0,1)";
		if ((!coupeFaite)&&(!coupe3DFaite)) {ctDeroul.fillStyle="rgba(0,0,0,0.5)";}
		var texte="Au format JPEG (image)";
		ctDeroul.fillText (texte,x,y);
	}
	
	if (nMenu==2)
	{
		var marge=lMenu*0.01;
		ctDeroul.font=hFont+"px "+dFont;
		var metrics = ctDeroul.measureText("Adapter à l'impression monochrome X");
		var largeurTexte = metrics.width+marge*2;
		canvDeroul.height=hLigne*14;
		canvDeroul.width=largeurTexte;
		ctDeroul.font=hFont+"px "+dFont; // le redim du canv reinit ct.font
		ctDeroul.fillStyle="rgb(150,150,150)";
		ctDeroul.fillRect (0,0,canvDeroul.width,canvDeroul.height);
		var x=0+marge;
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		
		var y=hLigne-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Lisser la coupe ";
		if (lissage) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		
		var y=hLigne*2-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		if ((modeCoupe!=0)||(modeleUtil!=2)) {ctDeroul.fillStyle="rgba(0,0,0,0.5)";}
		var texte="Sédiments & glace (CRUST1) ";
		if (sedim) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*3-hFont*0.7;
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Foyers sismiques";
		if (foyersVisibles) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*4-hFont*0.7;
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Volcans";
		if (volcansVisibles) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*5-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Relief sur le globe ";
		if (bump==1) {texte+="";}
		if (bump==1) {texte+="+";}
		if (bump==2) {texte+="++";}
		if (bump==3) {texte+="+++";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*6-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Contraste automatique ";
		if (contrasteAuto) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*7-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Adapter à l'impression monochrome ";
		if (monochrome) {texte+="✓";}
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*8-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="-------------------------";
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*9-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		var texte="Choix de l'échelle de teintes :";
		ctDeroul.fillText (texte,x,y);
		
		y=hLigne*10-hFont*0.7;
		var x=hFont;
		var h=Math.ceil(hFont);
		var l=Math.round(largeurTexte-x*2);
		traceSpectreBrut (0,ctDeroul,x,Math.round(y-hFont),l,h)
		
		y=hLigne*11-hFont*0.7;
		traceSpectreBrut (1,ctDeroul,x,Math.round(y-hFont),l,h)
		
		y=hLigne*12-hFont*0.7;
		traceSpectreBrut (2,ctDeroul,x,Math.round(y-hFont),l,h)
		
		y=hLigne*13-hFont*0.7;
		traceSpectreBrut (3,ctDeroul,x,Math.round(y-hFont),l,h)
		
		y=hLigne*14-hFont*0.7;
		traceSpectreBrut (4,ctDeroul,x,Math.round(y-hFont),l,h)
	}
	
	if (nMenu==4)
	{
		var marge=lMenu*0.01;
		ctDeroul.font=hFont+"px "+dFont;
		var metrics = ctDeroul.measureText("v2.2 (maj 27/03/2017)");
		var largeurTexte = metrics.width+marge*2;
		canvDeroul.height=hLigne*3;
		canvDeroul.width=largeurTexte;
		ctDeroul.font=hFont+"px "+dFont; // le redim du canv reinit ct.font
		ctDeroul.fillStyle="rgb(150,150,150)";
		ctDeroul.fillRect (0,0,canvDeroul.width,canvDeroul.height);
		var x=0+marge;
		var y=hLigne-hFont*0.7;
		ctDeroul.fillStyle="rgb(0,0,0)";
		ctDeroul.clearRect (0,0,canvDeroul.width,1);
		ctDeroul.fillText ("Sources des données",x,y);
		y=hLigne*2-hFont*0.7;
		ctDeroul.fillText ("Contacter l'auteur",x,y);
		y=hLigne*3-hFont*0.7;
		ctDeroul.fillStyle="rgba(0,0,0,0.5)";
		ctDeroul.fillText ("v2.2 (maj 27/03/2017)",x,y);
	}
	
	canvDeroul.style.display="block";
	
	document.body.style.cursor = 'pointer';
}

function traceBarreMenu () {
	ctMenu.fillStyle="rgb(150,150,150)";
	ctMenu.fillRect(0,0,lMenu,hMenu);
	var hFont=Math.round(hMenu*0.6*10)/10;
	ctMenu.font=hFont+"px "+dFont;
	ctMenu.fillStyle="rgb(0,0,0)";
	var marge=lMenu*0.01;
	var x=0+marge;
	ctMenu.fillText ("Choix du modèle",x,hMenu*0.7);
	x=lMenu/10+marge;
	ctMenu.fillText ("Type de coupe",x,hMenu*0.7);
	x=2*lMenu/10+marge;
	ctMenu.fillText ("Affichage",x,hMenu*0.7);
	x=3*lMenu/10+marge;
	if ((!coupeFaite)||(exportPossible===false)) {ctMenu.fillStyle="rgba(0,0,0,0.5)";} else {ctMenu.fillStyle="rgb(0,0,0)";}
	ctMenu.fillText ("Exportation",x,hMenu*0.7);
	x=4*lMenu/10+marge;
	ctMenu.fillStyle="rgb(0,0,0)";
	ctMenu.fillText ("A propos",x,hMenu*0.7);
	divmenu.style.display="block";
}


function checkLissage() {
	lissage=!lissage;
	if (lissage) {document.getElementById("check_lissage").style.display="block";} else {document.getElementById("check_lissage").style.display="none";}
	if (!lissage) {
		effaceCoupeHD();
		stopCoupeHD();
		if (coupeFaite) {traceCoupe(ctCoupe,true);}
	} else if (coupeFaite) {
		traceCoupeHD();
	}
}

function checkNB() {
	monochrome=!monochrome;
	//if (monochrome) {document.getElementById("check_NB").style.display="block";} else {document.getElementById("check_NB").style.display="none";}
	if (coupeFaite) {
		traceCoupe(ctCoupe);
	}
}