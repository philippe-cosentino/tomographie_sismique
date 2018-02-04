var ligneEnCours;
var coupeHDEnCours=false;

function traceCoupeHD() {
	if (coupeHDEnCours===true) {return false;}
	ligneEnCours=y0CT-1;
	coupeHDEnCours=true;
	divLissage.style.display="block";
	// on recherche le haut du secteur
	var x=x0CT+lCT/2;
	var obj;
	do {
		ligneEnCours++;
		obj=xy2latlongprof (x,ligneEnCours);
	} while (obj.inAngle===false)
	requestAnimationFrame (   function(){
		for (var i=0;i<5;i++) {
			traceLigneSuivante(); 
		}
	}   );
}

function traceLigneSuivante() {
	if ((coupeFaite===false)||(lissage===false)||(coupeHDEnCours===false)) {stopCoupeHD();effaceCoupeHD();return false;}
	if (ligneEnCours>(y0CT+hCT)) {
		stopCoupeHD();
		return false;
	}
	
	traceLigneHD (ligneEnCours);
	
	ligneEnCours++;
	requestAnimationFrame (   function(){ traceLigneSuivante(); }   );
}

function traceLigneHD (y) {
	var aucunSecteur=true;
	var v,c,obj;
	for (var x=x0CT;x<(x0CT+lCT);x++) {
		obj=xy2latlongprof (x,y);
 		if (obj.inAngle===true) {
			// on est dans le secteur
			aucunSecteur=false;
			
			var trancheAnom=prof2tranche(obj.prof);
			if (trancheAnom==0) {c="rgb(240,240,240)";} else {
				v=valAnomLisse(obj.lati,obj.longi,obj.prof);
				c=calcCoul (v);
			}
			ctCoupeHD.fillStyle=c;
			ctCoupeHD.fillRect(x,y,1,1);
		}
	}
	if (aucunSecteur===true) {
		reporteCoupeHD();
		effaceCoupeHD();
		traceCoupeEtape3(ctCoupe,true);		
		stopCoupeHD();
	}
}

function stopCoupeHD() {
	coupeHDEnCours=false;
	divLissage.style.display="none";
}

function reporteCoupeHD() {
	effaceCoupe(ctCoupe);
	ctCoupe.drawImage(canvCoupeHD,0,0);
}

function effaceCoupeHD() {
	ctCoupeHD.fillStyle="white";
	ctCoupeHD.fillRect(0,0,canvCoupeHD.width,canvCoupeHD.height);
	ctCoupeHD.clearRect(0,0,canvCoupeHD.width,canvCoupeHD.height);
}