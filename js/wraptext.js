function wrapText(context, texte, x, y, maxWidth, lineHeight) 
{
	var words = texte.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
	var testLine = line + words[n] + ' ';
	var metrics = context.measureText(testLine);
	var testWidth = metrics.width;
	if (testWidth > maxWidth && n > 0) {
	context.fillText(line, x, y);
	line = words[n] + ' ';
	y += lineHeight;
	}
	else {
	line = testLine;
	}
	}
	context.fillText(line, x, y);
	return y;
}

function texteNB(context,txt,x,y,inv)
{
	var dOmbre=hGL/1500;
	context.globalAlpha=0.5;
	if (!inv)	{context.fillStyle="rgba(255,255,255,0.05)"; } else {context.fillStyle="rgba(0,0,0,0.05)"; }
	for (var i=-2;i<=5;i++)
		for (var j=-4;j<=2;j++)
		{
			context.fillText (txt,x+i*dOmbre,y+j*dOmbre);
		}

	if (!inv)	{context.fillStyle="black";} else {context.fillStyle="white";}
	context.globalAlpha=1;
	context.fillText (txt,x,y);
}

function afficheSurGlobe (texte,lati,longi)
{
	// affichage des textes
		
	var angleRotLat=latitudeF*Math.PI/180;
	var angleRotLong=-longitudeF*Math.PI/180;
	
	var p1=calcsph(lati,longi);
	var p2=sphcart(p1);
	var p3=rotateZ(p2,angleRotLong);
	var p4=rotateY(p3,angleRotLat);
	var p5=cartsph(p4);

	var latRot=Math.PI/2-p5.theta;
	var longRot=p5.phi;
	
	var x0=lGL/2;
	var y0=hGL/2;
	var tailleCadre=lGL/taille*2000;
	var tailleCorde=Math.cos(latRot);
	var y=y0-Math.sin(latRot)*tailleCadre/2;
	var x=x0+Math.sin(longRot)*tailleCadre/2*tailleCorde;
	
	if (p4.x<0) {return false;} // le texte est derrière la Terre, on n'affiche pas
	
	ctGlobe.fillStyle="white";
	ctGlobe.font=mFont1;
	ctGlobe.textAlign="center";
	texteNB(ctGlobe,texte,x,y,true);
}