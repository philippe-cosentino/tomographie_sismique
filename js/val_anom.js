function valAnomLisse (lati,longi,prof) {
	
	var res;
	
	// résolution en °, 576 valeurs pour 360° donc 0.625° pour GAPP4 et 2° pour S362
	if (nModeleTomo==0) {res=0.625;}
	else if (nModeleTomo==1) {res=2;}
		
	var lati1=Math.floor(lati/res)*res;
	var lati2=lati1+res;
	var longi1=Math.floor(longi/res)*res;
	var longi2=longi1+res;
	var tranche1=prof2tranche(prof);
	var tranche2=tranche1+1;
	var pt1=trancheProfs[tranche1];
	var pt2=trancheProfs[tranche2];
	var dpt=pt2-pt1;
		
	// calcul de l'anomalie pour la tranche1 (ABCD)
	var vA=valAnom(lati1,longi1,tranche1);
	var vB=valAnom(lati2,longi1,tranche1);
	var vC=valAnom(lati2,longi2,tranche1);
	var vD=valAnom(lati1,longi2,tranche1);
	var dA=lati-lati1;
	var dB=lati2-lati;
	var vAB=(vA*dB+vB*dA)/res;
	var dC=dB;
	var dD=dA;
	var vCD=(vD*dC+vC*dD)/res;
	var dAB=longi-longi1;
	var dCD=longi2-longi;
	var v1=(vAB*dCD+vCD*dAB)/res;
	
	// calcul de l'anomalie pour la tranche2 (ABCD=EFGH)
	var vA=valAnom(lati1,longi1,tranche2);
	var vB=valAnom(lati2,longi1,tranche2);
	var vC=valAnom(lati2,longi2,tranche2);
	var vD=valAnom(lati1,longi2,tranche2);
	var vAB=(vA*dB+vB*dA)/res;
	var vCD=(vD*dC+vC*dD)/res;
	var v2=(vAB*dCD+vCD*dAB)/res;
	
	
	//var v1=valAnom(lati,longi,tranche1);
	//var v2=valAnom(lati,longi,tranche2);

	
	// moyenne pondérée des 2 tranches
	var v=(v1*(pt2-prof)+v2*(prof-pt1))/dpt;
	return v;
}

function valAnom(latanom,longanom,trancheprofanom) {
	if (nModeleTomo==0) {return getAnomFromBandeauGap(latanom,longanom,trancheprofanom)} 
	else if (nModeleTomo==1) {return getAnomFromBandeau(latanom,longanom,trancheprofanom)}
}

function valAnomGAPP4(latanom,longanom,trancheprofanom) // attention ordre inversé par rapport à v1
{
	if (longanom<0)
	{
	  longanom=longanom+360;
	}
	//calcul du rang au sein de la tranche de profondeur
	num=Math.round(longanom/360*576)+Math.round((90-latanom)/180*288)*576;
	if ((num<0)||(num>165163)||(trancheprofanom>(trancheProfs.length-2))||(trancheprofanom<1))
	{
		return 0;
		
	}
	num=num*2;
	v=dec64(valeurs[trancheprofanom][num]+valeurs[trancheprofanom][num+1]);
	v=(v/4096*15-7.5); // vraie anomalie
	return v;
	
}

