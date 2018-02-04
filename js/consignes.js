function titreEtAuteur(ctx)
{
	ctx.font="bold "+mFont0;
	ctx.fillStyle="black";
	var yTitre=Math.round(hGL/20);
	var xTitre=Math.round(lGL/2);
	ctx.textAlign="center";
	ctx.fillText ("Tomographie sismique v2",xTitre,yTitre);
	
	ctx.fillStyle="rgba(0,0,0,0.6)";
	ctx.font="italic "+mFont3;
	yTitre=Math.round(hGL-hGL/100);
	xTitre=Math.round(lGL-lGL/50);
	ctx.textAlign="right";
	ctx.fillText ("Auteur : P. COSENTINO",xTitre,yTitre);
	ctx.textAlign="left";
	xTitre=Math.round(lGL*0.02);
	
	if (modeleUtil==0) {
		ctx.fillText ("Modèle utilisé pour le Moho : GEMMA (satellite GOCE)",xTitre,yTitre);
	}
	else if (modeleUtil==1) {
		ctx.fillText ("Modèle utilisé pour le Moho : univ. Warsaw & Helsinki",xTitre,yTitre);
	}
	else if (modeleUtil==2) {
		ctx.fillText ("Modèle utilisé pour le Moho : CRUST1 (REM)",xTitre,yTitre);
	}
	
	
	yTitre-=hGL*0.025;
	if (nModeleTomo==0) {
		ctx.fillText ("Modèle utilisé pour la tomographie : GAP-P4",xTitre,yTitre);
	}
	else 	if (nModeleTomo==1) {
		ctx.fillText ("Modèle utilisé pour la tomographie : S362-ANI",xTitre,yTitre);
	}
	

	yTitre-=hGL*0.025;
	ctx.fillText ("Imagerie : NASA (visible earth)",xTitre,yTitre);
	var hautLogo=hGL/20;
	var largeLogo=Math.round(hautLogo*imageLogo.width/imageLogo.height);
	var xLogo=Math.round(lGL-largeLogo);
	var yLogo=hGL-hautLogo-hGL*0.025;
	ctx.globalAlpha=0.6;
	ctx.drawImage (imageLogo,0,0,imageLogo.width,imageLogo.height,xLogo,yLogo,largeLogo,hautLogo);
	ctx.globalAlpha=1;
}

function afficheInfosModeles()
{
	document.getElementById("div_conteneur_controles").style.display="none";
	mode2="infosmodeles";
	effaceCoupe(ctCoupe);
	ctCoupe.fillStyle="black";
	ctCoupe.font="italic "+mFont1;
	var context=ctCoupe;
	var y=Math.round(3*hGL/20);
	var x=Math.round(lGL/10);
	var maxWidth=lGL-x*2;
	var lineHeight=hGL/30;
	ctCoupe.textAlign="left";

	
	var texte="Sources des données utilisées dans cette application"; 
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*3;
	texte="Imagerie et topographie : NASA (Visible Earth)"; 
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*1.5;
	ctCoupe.font="italic "+mFont2;
	texte="http://visibleearth.nasa.gov/"; 
	yLien1=y;
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*3;
	
	if (modeleUtil==0) {
		texte="Modèle utilisé pour le Moho : GEMMA (satellite GOCE)";
	}
	else if (modeleUtil==1) {
		texte="Modèle utilisé pour le Moho : univ. Warsaw & Helsinki";
	}
	else if (modeleUtil==2) {
		texte="Modèle utilisé pour le Moho : CRUST1";
	}
	ctCoupe.font="italic "+mFont1;
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	
	y+=lineHeight*1.5;
	ctCoupe.font="italic "+mFont2;
	if (modeleUtil==0) {
		texte="Ce modèle utilise les données gravimétriques recueillies par le satellite GOCE (ESA). La croûte étant moins dense que le manteau, il est possible de calculer l'épaisseur de croûte à partir des anomalies de gravité. La portée de ce modèle est mondial. Sa résolution est de 0,5°.";
	}
	else if (modeleUtil==1) {
		texte="Ce modèle, ne couvrant que l'Europe, résulte de la compilation de données sismiques (plus de 250 profils) et gravimétriques. Sa résolution est de 0,5°. ";
	}
	else if (modeleUtil==2) {
		texte="Ce modèle repose sur des données sismiques (temps d'arrivée, essentiellement des ondes de surface). Sa portée est mondiale et sa résolution est de 1°.";
	}
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	
	y+=lineHeight*1.5;
	if (modeleUtil==0) {
		texte="http://www.esa.int/Our_Activities/Observing_the_Earth/GOCE/Mapping_the_Moho_with_GOCE";
	}
	else if (modeleUtil==1) {
		texte="http://www.seismo.helsinki.fi/mohomap/";
	}
	else if (modeleUtil==2) {
		texte="http://igppweb.ucsd.edu/~gabi/crust1.html";
	}
	ctCoupe.font="italic "+mFont2;
	yLien2=y;
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);

	
	y+=lineHeight*3;
	if (nModeleTomo==0) {
		texte="Modèle utilisé pour la tomographie : GAP-P4";
	}
	else	if (nModeleTomo==1) {
		texte="Modèle utilisé pour la tomographie : S362-ANI";
	}
	
	ctCoupe.font="italic "+mFont1;
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	
	y+=lineHeight*1.5;
	ctCoupe.font="italic "+mFont2;
	if (nModeleTomo==0) {
		texte="GAP-P4 est un modèle tomographique tridimensionnel des vitesses des ondes P dans le manteau. Sa résolution est de 0,65°. Il a été obtenu à partir de plus de 20 000 différences de temps d'arrivée des ondes PP-P et P.";
	}
	else if (nModeleTomo==1) {
		texte="S362-ANI est un modèle tomographique tridimensionnel des vitesses des ondes S dans le manteau. Sa résolution est de 2°. Il est particulièrement adapté pour étudier les anomalies au niveau des dorsales.";
	}
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	
	ctCoupe.font="italic "+mFont3;
	y+=lineHeight*1.5;
	if (nModeleTomo==0) {
		texte="Référence : Gap-P4 : Obayashi, M., Yoshimitsu, J., Nolet, G., et al. (2013).";
	}
	else 	if (nModeleTomo==1) {
		texte="Référence : S362-ANI : Kustowski, B., Ekström, G., and Dziewonski, A. M. (2008).";
	}
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	
	
}

function contactAuteur()
{
	document.getElementById("div_conteneur_controles").style.display="none";
	mode2="contactauteur";
	effaceCoupe(ctCoupe);
	ctCoupe.fillStyle="black";
	ctCoupe.font="italic "+mFont1;
	var context=ctCoupe;
	var y=Math.round(3*hGL/20);
	var x=Math.round(lGL/10);
	var maxWidth=lGL-x*2;
	var lineHeight=hGL/30;
	ctCoupe.textAlign="left";

	
	var texte="Auteur de l'application : Philippe Cosentino"; 
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*1.5;
	var texte="Professeur agrégé de SVT (académie de Nice)"; 
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*3;
	var texte="Mail : philippe.cosentino@ac-nice.fr"; 
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	y+=lineHeight*3;
	var texte="Pour connaître les auteurs des modèles scientifiques, aller dans le menu 'A propos/Sources des données'";
	y=wrapText(context, texte, x, y, maxWidth, lineHeight);

}


function afficheConsignes()
{
	document.getElementById("div_conteneur_controles").style.display="none";
	mode2="consignes";
	effaceCoupe(ctCoupe);
	ctCoupe.fillStyle="black";
	ctCoupe.font="italic "+mFont2;
	var context=ctCoupe;
	var y=Math.round(3*hGL/20);
	var x=Math.round(lGL/10);
	var maxWidth=lGL-x*2;
	var lineHeight=hGL/30;
	ctCoupe.textAlign="left";

	
	if (modeCoupe==0) {
		var texte="La tomographie sismique permet de déduire les variations de température de l'intérieur du globe à partir des anomalies de vitesse des ondes sismiques."
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*1.5;
		
		var texte="Ce logiciel vous permet de réaliser des coupes tomographiques sur lesquelles seront également représentées le Moho et les foyers sismiques."; 
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*3;
		
		var texte="Mode d'emploi :"; 
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*1.5;
		var texte="1) Choisissez un modèle adapté (GAP-P4 a une très bonne résolution et met davantage en évidence la subduction, S362-ANI est plus performant pour étudier les dorsales ...)."; 
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*1.5;
		var texte="2) Délimitez un plan de coupe en cliquant à deux endroits différents sur le globe."; 
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*3;
		var texte="Une fois la coupe affichée, vous pourrez cliquer dessus pour afficher la profondeur et la valeur de l'anomalie, et reporter la position sur le globe. Vous pouvez également utiliser la molette de la souris pour modifier l'exagération verticale des 100 premiers kilomètres.";
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		y+=lineHeight*1.5;
		var texte="D'autres options sont également disponibles via le menu déroulant en haut de l'écran, comme la possibilité d'afficher les sédiments ou les foyers sismiques.";
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
	}
	else 	if (modeCoupe==1) {
		var texte="Mode d'emploi (pour une coupe en 3 dimensions) :"; 
		y=wrapText(context, texte, x, y, maxWidth, lineHeight);
		// pas de coupe 3D pour l'instant
	}
}
