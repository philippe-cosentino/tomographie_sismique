var etape=0;

var tScript=new Array();
tScript[0]="three.min";
tScript[1]="menu";
tScript[2]="consignes";
tScript[3]="elevation5400";
tScript[4]="varglob";
tScript[5]="encdec64";
tScript[6]="bathy5400";
tScript[7]="range-slider";
tScript[8]="export";
tScript[9]="valmohocrust1";
tScript[10]="valsediments";
tScript[11]="valglace";
tScript[12]="reliefs";
tScript[13]="val_anom";
tScript[14]="gestionFoyers";
tScript[15]="valfoyers";
tScript[16]="wraptext";
tScript[17]="init";
tScript[18]="render";
tScript[19]="spheriques";
tScript[20]="grand_cercle";
tScript[21]="canvas";
tScript[22]="events";
tScript[23]="coupe_tomo";
tScript[24]="clic_coupe_tomo";
tScript[25]="terre_4096";
tScript[26]="terreBump";
tScript[27]="chroma";
tScript[28]="coupeHD";
tScript[29]="gestVolcans";
tScript[30]="valtomo/modelS362";
tScript[31]="valtomo/modelGAPP4_1";

var nScript=0;
var inElectron=(typeof window !== 'undefined' && window.process && window.process.type === "renderer");
var exportPossible=((!document.URL.includes("file:"))||inElectron)||false;

function bloqueZoom() {
		if (inElectron) {
			// on est dans electron
			require('electron').webFrame.setZoomLevelLimits(1, 1);
		}
		// empecher le ctrl+molette zoom
		window.addEventListener('mousewheel', function(e) {
		  if (e.ctrlKey) {
			e.preventDefault();
		  }
		});
		
		document.onkeydown = function (e) {
			e = e || window.event;//Get event
			if (e.ctrlKey==true && (e.which == '107' || e.which == '109'|| e.which == '187')) {
						e.preventDefault();     
						e.stopPropagation();
			}
		};
}

function chargeScripts ()
{
	var nomf=tScript[nScript];
	if ((nomf=="terre_4096")&&(reliefHD)) {nomf="terre_8192";}
	if ((nomf=="bathy5400")&&(reliefHD)) {nomf="bathy10800";}
	if ((nomf=="elevation5400")&&(reliefHD)) {nomf="elevation10800";}
	nScript++;
	if (nScript<=tScript.length) {
		charge(nomf);	
	}
}

function charge(nomf)
{
	if (nomf=="") {
		setTimeout(function() { 
			//console.log (nomf+" chargé.");
			avanceCharge();
			chargeScripts();
		}, 1);      
		return false;
	}
	var fileref=document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.async = true;
	fileref.setAttribute("src", "js/"+nomf+".js");
	var js=document.getElementsByTagName("head")[0].appendChild(fileref);
    js.onload = function () {
		setTimeout(function() { 
			//console.log (nomf+" chargé.");
			avanceCharge();
			chargeScripts();
		}, 5);      
	}
	

}



function avanceCharge()
{
	var nbEtapes=40; 
	etape++;
	var texte='<p>Veuillez patienter, chargement en cours</p><p>Etape '+etape+'/'+nbEtapes+'</p>';
	texte+="<p>";
	for (var i=1;i<etape;i++) {
		texte+='&#9632;';
	}
	for (var i=etape;i<nbEtapes;i++) {
		texte+='&#9633;';
	}
	texte+="</p>";
	document.getElementById('image_chargement').style.opacity=Math.round(etape/nbEtapes*90)/100+0.1;
	document.getElementById('div_chargement').innerHTML=texte;
	if (etape>=nbEtapes)
	{
		document.getElementById('div_chargement').innerHTML='Préparation des données ...';
		setTimeout(function() { 
			demarre1();
		}, 50);      
	}
}


function demarre1()
{
	preCalcTomoGap();
	preCalcTomoS362();
	effaceImagesTomoGap();
	document.getElementById('div_chargement').innerHTML="Préparation des spectres ...";
	setTimeout(function() { 
			demarre1b();
	}, 50);   
}

function demarre1b() {

	preCalcSpectres();
	preCalcCoul();
	if (reliefHD){nbwp=320;}
		
	document.getElementById('div_chargement').innerHTML="Extraction des foyers sismiques ...";
	setTimeout(function() { 
			demarre2();
	}, 50);   
}

function demarre2() {
	extraitFoyers();
	document.getElementById('div_chargement').innerHTML="Initialisation des objets 3D ...";
	setTimeout(function() { 
			demarre3();
	}, 50);   	
}	
	
function demarre3() {	
	init_scene();
	init_planete();
	document.getElementById('div_chargement').innerHTML="Placement des foyers sismiques et des volcans ...";
	setTimeout(function() { 
			demarre4();
	}, 50);  
}

function demarre4() {	
	placeFoyersSurGlobe ();
	placeVolcansSurGlobe ();
	document.getElementById('div_chargement').innerHTML="Démarrage ...";
	setTimeout(function() { 
			demarre5();
	}, 50);  
}
	
	
function demarre5() {
	initMolette();
	initMoletteCoupe ();
	document.getElementById("divchargement").style.display="none";
	divgl.style.display = "block";
	divcoupe.style.display = "block";
	redim();
	creeRangeSlider('range-slider-1', function(value) {
		changeContraste (value);
	});
	creeRangeSlider('range-slider-2', function(value) {
		changeProfMax(value);
	});
	
	creeRangeSlider('range-slider-3', function(value) {
		changeExag(value);
	});
	
	creeRangeSlider('range-slider-4', function(value) {
		changeToleranceCoupe(value);
	});
	redim();
	window.onresize = function(event) {redim();}
	//checkFoyers();
	setTimeout (function(){render(true)},100);
	setTimeout (function(){render(true)},500);
	animation();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function go() {
	// détection de NWJS
	if (is_nwjs()===true) {
		var gui = require('nw.gui'); 
		var win = gui.Window.get();
		win.maximize();
		win.show();
		//alert (process.versions['node-webkit']);
	}	
	
	// détection du webgl
	if (!supports_canvas()) {
		document.getElementById('div_chargement').innerHTML="<p>Votre navigateur ne supporte pas l\'objet Canvas.</p><p>Utilisez un navigateur mis &agrave; jour ...</p>";
		throw new Error("Canvas non supporté !");
	}
	else if (!window.WebGLRenderingContext) {
		document.getElementById('div_chargement').innerHTML="<p>Votre système ou votre navigateur ne reconnait pas le WebGL.</p>";
		throw new Error("WebGL non supporté");
	} else {
		var canvas =document.createElement("canvas");
		var context = canvas.getContext("webgl");
		if (!context) {
			document.getElementById('div_chargement').innerHTML="<p>Erreur lors de l'initialisation de WebGL.</p>";
			throw new Error("Erreur avec l'initialisation du WebGL");
		} else {
			go2();
		}
	}
}

function go2() {
	reliefHD=(getParameterByName('reliefhd')=="1");
	bloqueZoom();
	chargeScripts ();
}

function supports_canvas() {
	var test=!!document.createElement('canvas').getContext;
	return test;
}

function is_nwjs(){
try{
		return (typeof require('nw.gui') !== "undefined");
	} catch (e){
		return false;
	}
}