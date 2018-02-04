function mouseOutCoupe()
{
	coupeCliquee=false;
	document.body.style.cursor = 'default';
}

function mouseDownCoupe(event)
{
	effaceDeroul();
	
	if(window.event)
	event = window.event; //grrr IE

	var offsets = canvSurCoupe.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	// on vérifie si un clic sur lien modèle ou NASA
	if ((mode2=="infosmodeles")&&(noLink===false)) {
		if ((mousey<yLien1)&&(mousey>(yLien1-hGL*0.02))) {
			window.open('http://visibleearth.nasa.gov/', '_blank');
			return false;
		}
		if ((mousey<yLien2)&&(mousey>(yLien2-hGL*0.02))) {
			if (modeleUtil==0) {
				var urlLien="http://www.esa.int/Our_Activities/Observing_the_Earth/GOCE/Mapping_the_Moho_with_GOCE";
			}
			else if (modeleUtil==1) {
				var urlLien="http://www.seismo.helsinki.fi/mohomap/";
			}
			else if (modeleUtil==2) {
				var urlLien="http://igppweb.ucsd.edu/~gabi/crust1.html";
			}
			window.open(urlLien, '_blank');
			return false;
		}
	}
	
	if (!coupeFaite) {
		afficheConsignes();
		return false;
	}
	
	if ((mode2=="contactauteur")||(mode2=="infosmodeles"))
	{
		if (modeCoupe==0) {mode2="coupe2d";} else 
		if (modeCoupe==1) {mode2="coupe3d";}
		redim();
		return false;
	}
	
	// on teste si un clic sur le nom du modèle
	var xTitre=Math.round(lGL*0.02);
	var yTitre=Math.round(hGL-hGL/100);
	var hTitre=Math.round(hGL/50);
	ctCoupe.font="italic "+mFont2;
	var lTitre=ctCoupe.measureText("Modèle utilisé : GEMMA (satellite GOCE)").width;
	if ((mousey<yTitre)&&(mousey>(yTitre-hTitre))&&(mousex<(xTitre+lTitre))&&(noLink===false)) {
		if (modeleUtil==0) {
			window.open('http://gocedata.como.polimi.it/index.php', '_blank');
			return false;
		}
		else if (modeleUtil==1) {
			window.open('http://www.seismo.helsinki.fi/mohomap/', '_blank');
			return false;
		}
		else if (modeleUtil==2) {
			window.open('http://igppweb.ucsd.edu/~gabi/rem.html', '_blank');
			return false;
		}
	}
	
	// on teste si un clic a été fait sur le modèle 2D
	if (!coupeFaite) {return false;}
	coupeCliquee=true;
	// on vérifie si la souris est au dessus de la coupe
	var obj=xy2latlongprof (mousex,mousey);
	if (obj.inAngle===false)	{return false;}
	
	reporteSurCoupe (mousex,mousey,obj.prof,obj.anom);
	reporteSurGlobeMarqueur (obj.lati,obj.longi);
}

function survolCoupe(event) {
	//si infosmodeles affiché
	if (mode2=="infosmodeles") {
		document.body.style.cursor = 'pointer';
		return false;
	}
	
	// si contact auteur
	if (mode2=="contactauteur") {
		document.body.style.cursor = 'pointer';
		return false;
	}
	
	if(window.event)
	event = window.event; //grrr IE

	var offsets = canvSurCoupe.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;

	var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	// on teste si nom du modèle survolé
	var xTitre=Math.round(lGL*0.02);
	var yTitre=Math.round(hGL-hGL/100);
	var hTitre=Math.round(hGL/50);
	ctCoupe.font="italic "+mFont2;
	var lTitre=ctCoupe.measureText("Modèle utilisé : GEMMA (satellite GOCE)").width;
	if ((mousey<yTitre)&&(mousey>(yTitre-hTitre))&&(mousex<(xTitre+lTitre))) {
		document.body.style.cursor = 'pointer';
	}	
	else
	{
		document.body.style.cursor = 'default';
	}

	// on teste si survol coupe
	if (!coupeFaite) {return false;}
	
	// on vérifie si la souris est au dessus de la coupe
	var obj=xy2latlongprof (mousex,mousey);
	if (obj.inAngle===false)
	{
		// clic hors de la coupe
		return false;
	}
	document.body.style.cursor = 'pointer';
	// on est sur la coupe, le bouton est il enfoncé ?
	
	if (!coupeCliquee) {return false;}
	
	reporteSurCoupe (mousex,mousey,obj.prof,obj.anom);

	reporteSurGlobeMarqueur (obj.lati,obj.longi);
	

}

function reporteSurCoupe (x,y,prof,anom) {
	ctSurCoupe.clearRect(0,0,lGL,hGL);
	var l=lGL/100;
	ctSurCoupe.fillRect(x-l/2,y,l+1,1);
	ctSurCoupe.fillRect(x,y-l/2,1,l+1);

	if (prof>0) {
		ctSurCoupe.font=mFont3;
		var texte="Profondeur = "+Math.round(prof)+"km";
		//var vanom=vraieAno(anom);
		var vanom=Math.round(anom*100)/100;
		if (vanom<0) {var texteAnom=""+vanom;} else {var texteAnom="+"+vanom;}
		var texte2="Anomalie = "+texteAnom+"%";
		ctSurCoupe.fillText(texte,x+l,y+l/2);
	}
	if (prof>29) {
		ctSurCoupe.fillText(texte2,x+l,y+l*2.5);
	}
}

function reporteSurGlobeMarqueur (lati,longi)
{
	redimBoules();
	deplaceCube (sphereMarqueur,lati,longi);
	render(true);	
}

function mouseUpCoupe(event)
{
	coupeCliquee=false;
	document.body.style.cursor = 'default';
}
