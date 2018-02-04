var canvHachures =  document.createElement('canvas');
var canvHachures2 =  document.createElement('canvas');
var ctHachures = canvHachures.getContext('2d');
var ctHachures2 = canvHachures2.getContext('2d');
var patternHachures;

var divgl=document.getElementById('divgl');
var divControles=document.getElementById('div_controles');

var divCalcul=document.getElementById('div_calcul');
var divLissage=document.getElementById('div_lissage');
	
var renderer, scene, camera, meshTerre,lumiere,cube1,cube2,ligne;
var hEcran,lEcran;

var canvGlobe=document.getElementById ("canv_globe");
var ctGlobe=canvGlobe.getContext("2d");

var canvMenu=document.getElementById ("canv_menu");
var ctMenu=canvMenu.getContext("2d");

var canvDeroul=document.getElementById ("canv_deroul");
var ctDeroul=canvDeroul.getContext("2d");

var canvCoords=document.getElementById ("canv_coords");
var ctCoords=canvCoords.getContext("2d");

var canvCoupe=document.getElementById ("canv_coupe");
var ctCoupe=canvCoupe.getContext("2d");
	
var canvSurCoupe=document.getElementById ("canv_surcoupe");
var ctSurCoupe=canvSurCoupe.getContext("2d");

var canvCoupeHD=document.getElementById ("canv_HD");
var ctCoupeHD=canvCoupeHD.getContext("2d");

var canvTempCoupe= document.createElement('canvas');
var ctxTempCoupe=canvTempCoupe.getContext("2d");

var hGen,lFen,xFen,yFen,hMenu,lMenu;

var hGL,lGL;

var imageLogo = document.createElement( 'img' );
imageLogo.src="images/logo_ac_nice.jpg";


function pixelRatio() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}

function effaceCoupe(ctx)
{
	ctx.fillStyle="white";
	ctx.fillRect(0,0,canvCoupe.width,canvCoupe.height);
	ctSurCoupe.clearRect(0,0,canvCoupe.width,canvCoupe.height);
	titreEtAuteur(ctx);
}

	
function redim()
{	
	hEcran=window.innerHeight;
	lEcran=window.innerWidth;
	

	// on calcule hFen et lFen
	// = dimensions de la fenêtre de travail
	hFen=hEcran+lEcran;
	lFen=Math.floor(hFen*1.6);
	while ((hFen>(hEcran*0.97))||(lFen>lEcran))
	{
		hFen=Math.floor(hFen*0.99);
		lFen=hFen*2;
	}
	
	//hFen=hEcran;
	//lFen=lEcran;

	hMenu=Math.round(hFen*0.03);
	lMenu=lFen;
	
	var xFen=Math.round((lEcran-lFen)/2);
	var y0Top=Math.round((hEcran-(hFen+hMenu))/2);
	var yFen=y0Top+hMenu;
	
	hGL=Math.round(window.hFen);
	lGL=Math.round(window.lFen/2);

	divmenu.style.position = "absolute";
	divmenu.style.padding = 0+"px";
	divmenu.style.left = xFen+"px";
	divmenu.style.top = y0Top+"px";
	divmenu.style.width=lMenu+"px";
	divmenu.style.height=hMenu+"px";	
	canvMenu.width=lMenu;
	canvMenu.height=hMenu;

	traceBarreMenu();
	
	divgl.style.position = "absolute";
	divgl.style.padding = 0+"px";
	divgl.style.left = xFen+"px";
	divgl.style.top = yFen+"px";
	divgl.style.width=lGL+"px";
	divgl.style.height=hFen+"px";	
	
	// redimension des polices de caractères
	var hFont=Math.floor(hGL/30*100)/100;
	document.body.style.fontSize=Math.round(hFont/2*100)/100+"px";
	mFont0=hFont+"px "+dFont;
	hFont=Math.floor(hGL/40*100)/100;
	mFont1=hFont+"px "+dFont;
	hFont=Math.floor(hGL/50*100)/100;
	mFont2=hFont+"px "+dFont;
	hFont=Math.floor(hGL/60*100)/100;
	mFont3=hFont+"px "+dFont;
	hFont=Math.floor(hGL/70*100)/100;
	mFont4=hFont+"px "+dFont;
	

			
	canvGlobe.width=lGL;
	canvGlobe.height=hGL;
	
	canvCoords.width=lGL;
	canvCoords.height=hGL*0.05;
	canvCoords.style.top=canvGlobe.height-canvCoords.height+"px";
	
	divcoupe.style.position = "absolute";
	divcoupe.style.padding = 0+"px";
	divcoupe.style.left = xFen+lGL+"px";
	divcoupe.style.top = yFen+"px";
	divcoupe.style.width=(lFen-lGL)+"px";
	divcoupe.style.height=hFen+"px";	
	
	canvCoupe.width=(lFen-lGL);
	canvCoupe.height=hFen;
	
	canvSurCoupe.width=canvCoupe.width;
	canvSurCoupe.height=canvCoupe.height;
	
	canvCoupeHD.width=canvCoupe.width;
	canvCoupeHD.height=canvCoupe.height;
	
		
	effaceCoupe(ctCoupe);

	if ((coupeFaite)&&(mode2=="coupe2d"))	{
		traceCoupe(ctCoupe);
	}
	else if (mode2=="consignes") {
		afficheConsignes();
	}
	else if (mode2=="infosmodeles") {
		afficheInfosModeles();
	}
	else if (mode2=="contactauteur") {
		contactAuteur();
	}
	
	if (renderer) {
		renderer.setSize( lGL, hGL);render();
		camera.updateProjectionMatrix ();
		render(true);
	}

	creeHachures ();
	
	
	// cadre contenant la coupe sphérique
	x0CT=Math.round(lGL*0.05);
	y0CT=Math.round(hGL*0.08);
	lCT=Math.round(lGL-x0CT*2);
	hCT=Math.round(hGL*0.65);	
	
	redimSlider("range-slider-1");
	redimSlider("range-slider-2");
	redimSlider("range-slider-3");
	redimSlider("range-slider-4");
	setSliders();
}

function ecranCoupeBougeGlobe(message,message2)
{
	effaceCoupe(ctCoupe)
	ctCoupe.font="italic "+mFont0;
	ctCoupe.fillStyle="black";
	var yTitre=Math.round(hGL/2);
	var xTitre=Math.round(lGL/2);
	ctCoupe.textAlign="center";
	ctCoupe.fillText (message,xTitre,yTitre);
	var yTitre=Math.round(hGL/2*1.15);
	ctCoupe.fillText (message2,xTitre,yTitre);
}

function setSliders () {
	setSliderProfMax();
	setSliderContraste();
	setSliderExag ();
	setSliderToleranceCoupe ();
}

