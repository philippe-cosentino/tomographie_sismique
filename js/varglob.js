var contrasteAuto=false;
var lissage=false;
var nModeleTomo=0;
var toleranceCoupe=0.1;
var toleranceMin=0.05;
var toleranceMax=0.25;
var noLink=true;
var contra=3; // contraste
const rayonTerre=6371;
const rayon100=rayonTerre-100; // rayon de la partie de la Terre non exagérée (jusqu'à 100km de profondeur)
const rayonNoyau=3485;
var profMax=800;
var mode2="consignes";
var yLien1,yLien2;
var nMenu=-1;
var modeCoupe=0;
var modeleUtil=2;
var flou=1;
var coupeCliquee=false;
var sedim=true;
var fondPlat=false;
var altiFondPlat=-15000;
var bump=2;
var latitude=0;
var longitude=0;
var latitudeF=0;
var longitudeF=0; // ...F => latitude en cours (sans le F = latitude cible)
var taille=2000;
var tailleF=2000;
var tailleMin=400;
var rTerre=1000;
var dLampe=15000;
var dCamera=10000;
var exag=3;
var exagMin=1;
var exagMax=10;
var lcoupe;
var lTricot=1300;
var zexag=0.01;
var wpgc=new Array();
var wpBD=new Array();
var wpDC=new Array();
var wpCA=new Array();
var yRelief=new Array();
var yMoho=new Array ();
var altiRelief=new Array ();
var epCroute=new Array ();
var nbwp=160; // multiple de 8
var monochrome=false;
// la tranche 0 est vide
// la tranche 1 s'étend de 29 à 51 km etc.
var trancheProfs;
var reliefHD;

selectModele();


function selectModele() {
	if (nModeleTomo==0) {trancheProfs=[0,29,51,78,110,148,190,238,290,348,410,478,551,629,712,800,893,991,1095,1203,1317,1435,1559,1688,1821,1960,2104,2253,2407,2566,2900];}
	if (nModeleTomo==1) { trancheProfs=[0,25,50,75,100,125,150,200,250,300,350,400,500,600,700,800,1000,1250,1500,1750,2000,2250,2500,2750,2800,2890,2900];}
}

for (var i=0;i<nbwp;i++)
{
	wpgc[i]={};
	wpBD[i]={};
	wpDC[i]={};
	wpCA[i]={};
}

var sphereLigne=new Array();

var lat1c,long1c;
var stadeCoupe=0;

var bouton=false;
var bouge=false;
var coupeFaite=false;
var batOnly=false;

var xMD,yMD;

var ele,bath;

var mFont0,mFont1,mFont2,mFont3;
const dFont="\"Trebuchet MS\", Helvetica, sans-serif";