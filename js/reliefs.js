function altitude(lati,longi)
{
	if (reliefHD) {
		var xh=(longi+180)/360*10800;
		var yh=(90-lati)/180*5400;
	}
	else {
		var xh=(longi+180)/360*5400;
		var yh=(90-lati)/180*2700;
	}
	return altitudeSmooth (xh,yh);
}

function altitudeInt(xh,yh)
{
	if (reliefHD) {
		var i=xh*4+yh*10800*4;
	}
	else {
		var i=xh*4+yh*21600;
	}
	//console.log (xh+" "+yh+" "+i);
	var h=ele.data[i]-12;
	h=h*34;
	if (reliefHD) {
		// l'image fait 10800 pixels de large, chaque pixel prend 4 octets rgba
		var bb=256-bath.data[xh*4+yh*10800*4];
	}
	else {
		var bb=256-bath.data[xh*4+yh*21600];
	}
	var b=bb*7250/256;
	//console.log (h+" "+b);
	if (h<=0)
	{
		h=-b;
	}
	if (batOnly) {h=-b;}
	return h;
}

function altitudeSmooth (x,y)
{
	var rx=(x%1);
	var ix=Math.floor(x);
	var rrx=1-rx;
	var ry=(y%1);
	var rry=1-ry;
	var iy=Math.floor(y);
	var va=altitudeInt (ix,iy);
	var vb=altitudeInt (ix+1,iy);
	var vc=altitudeInt (ix,iy+1);
	var vd=altitudeInt (ix+1,iy+1);
	var v=va*rrx*rry +vb*rx*rry +vc*ry*rrx +vd*ry*rx;
	var v=v/(rrx*ry +rx*ry +rrx*rry +rx*rry);
	
	return v;
}

function profmohoeur(latmoho,longmoho)
{
	//attention, longitude augmentee de 180
	// latitude=90-lat
	var nlat=87-latmoho;
	var nlon=longmoho+41;
	var lig=nlat*5;
	var num=nlon*5;
	return profMohoEurSmooth(lig,num);	
}

function profMohoEurSmooth (lig,num)
{
	var rnum=(num%1);
	var inum=Math.floor(num);
	var rrnum=1-rnum;
	var rlig=(lig%1);
	var rrlig=1-rlig;
	var ilig=Math.floor(lig);
	var va=profmohoeurint (ilig,inum);
	var vb=profmohoeurint (ilig,inum+1);
	var vc=profmohoeurint (ilig+1,inum);
	var vd=profmohoeurint (ilig+1,inum+1);
	var v=va*rrnum*rrlig +vb*rnum*rrlig +vc*rlig*rrnum +vd*rlig*rnum;
	var v=v/(rrnum*rlig +rnum*rlig +rrnum*rrlig +rnum*rrlig);
	
	return v;
}

function profmohoeurint(lig,num)
{
	v=dec64(valmohoeur[lig][num*2]+valmohoeur[lig][num*2+1]);
	//maxi=61.4;
	mini=5.9;
	ecart=55.5;
	v=v/4096*ecart;
	v=v+mini;
	return v;
}

// modele CRUST 1
function profmohocrust1(latmoho,longmoho)
{
	// la ligne 0 correspond à la latitude 179.5
	longmoho=longmoho+179.5;
	if (longmoho>=360)
	{
	  longmoho=longmoho-360;
	}
	if (longmoho<0)
	{
	  longmoho=longmoho+360;
	}

	// la ligne 0 correspond à la latitude 89.5
	var nlat=89.5-latmoho;
	var nlon=longmoho;
	var lig=nlat;
	var num=nlon;
	
	return profMohoCrust1Smooth(lig,num);	
}

function profMohoCrust1Smooth (lig,num)
{
	var rnum=(num%1);
	var inum=Math.floor(num);
	var rrnum=1-rnum;
	var rlig=(lig%1);
	var rrlig=1-rlig;
	var ilig=Math.floor(lig);
	var va=profmohocrust1int (ilig,inum);
	var vb=profmohocrust1int (ilig,inum+1);
	var vc=profmohocrust1int (ilig+1,inum);
	var vd=profmohocrust1int (ilig+1,inum+1);
	var v=va*rrnum*rrlig +vb*rnum*rrlig +vc*rlig*rrnum +vd*rlig*rnum;
	var v=v/(rrnum*rlig +rnum*rlig +rrnum*rrlig +rnum*rrlig);
	
	return v;
}

function profmohocrust1int(lig,num)
{
	if (num<0) {num+=360;}
	else if (num>=360) {num-=360;}
	
	if (lig<0) {lig=0;}
	else if (lig>=179) {lig=179;}
	
	v=dec64(valcrust1[lig][num*2]+valcrust1[lig][num*2+1]);
	//maxi=61.4;
	mini=7.4;
	ecart=67.4;
	v=v/4096*ecart;
	v=v+mini;
	return v;
}


function profmoho(latmoho,longmoho)
{
	if (fondPlat) {return 10};
	// en europe ?
	if (modeleUtil==1)
	{
		if ((latmoho<=87)&&(latmoho>=27)&&(longmoho>=-41)&&(longmoho<=71))
		{
			return profmohoeur(latmoho,longmoho);
		}
		else
		{
			return 10;
		}
	} 
	
	// modele Crust1 ?
	if (modeleUtil==2)
	{
		return profmohocrust1(latmoho,longmoho);
	} 	
	
	// modele GEMMA, Moho à partir de la surface ...
	var alti=0;
	var n=0;
	var j,k;
	// filtre éliminant les remontées brutales du Moho en cas de "pic" sur le relief positif
	// en effet, la profondeur du Moho est calculée à partir de la surface, à un pic pourrait
	// correspondre une remontée brutale vu la faible résolution du Moho par rapport au relief
	for (j=-1;j<=1;j++) {
		for (k=-1;k<=1;k++) {
			n++;
			alti+=altitude(latmoho+j*flou,longmoho+k*flou);
		}
	}
	alti=alti/n/1000;

	longmoho=longmoho+180;
	if (longmoho>360)
	{
	  longmoho=longmoho-360;
	}
	if (longmoho<0)
	{
	  longmoho=longmoho+360;
	}
	latmoho=90-latmoho;
	
	//calcul du rang au sein de la tranche de profondeur
	var num=longmoho*2;
	var lig=latmoho*2;

	return (profMohoSmooth (lig,num)-alti);
	
}

function profMohoSmooth (lig,num)
{
	var rnum=(num%1);
	var inum=Math.floor(num);
	var rrnum=1-rnum;
	var rlig=(lig%1);
	var rrlig=1-rlig;
	var ilig=Math.floor(lig);
	var va=profMohoInt (ilig,inum);
	var vb=profMohoInt (ilig,inum+1);
	var vc=profMohoInt (ilig+1,inum);
	var vd=profMohoInt (ilig+1,inum+1);
	var v=va*rrnum*rrlig +vb*rnum*rrlig +vc*rlig*rrnum +vd*rlig*rnum;
	var v=v/(rrnum*rlig +rnum*rlig +rrnum*rrlig +rnum*rrlig);
	
	return v;
}

function profMohoInt (lig,num)
{
	if (num<0) {num+=720;}
	else if (num>719) {num-=720;}
	
	if ((lig<0)||(lig>359))
	{
		return 8; //profondeur moyenne du moho océanique par défaut
	
	}
	num=num*2;
	v=dec64(valmoho[lig][num]+valmoho[lig][num+1]);
	maxi=105.2;
	mini=4.8;
	ecart=100.4;
	v=v/4096*ecart;
	v=v+mini;
	
	return v;	
}

// épaisseur sédiments

function altiFlou (lati,longi,flouS) {
	// filtre éliminant les remontées brutales  en cas de "pic" sur le relief positif
	// en effet, la profondeur est calculée à partir de la surface
	var alti=0;
	var n=0;
	var j,k;

	for (j=-1;j<=1;j++) {
		for (k=-1;k<=1;k++) {
			n++;
			alti+=altitude(lati+j*flouS,longi+k*flouS);
		}
	}
	alti=alti/n;
	return alti;	
}


function epSediments (lati,longi) {
	// la ligne 0 correspond à la latitude 179.5
	longi+=179.5;
	if (longi>=360)
	{
	  longi-=360;
	}
	if (longi<0)
	{
	  longi+=360;
	}

	// la ligne 0 correspond à la latitude 89.5
	var nlat=89.5-lati;
	var nlon=longi;
	var lig=nlat;
	var num=nlon;
	
	return epSedimentsSmooth(lig,num);
}

function epSedimentsSmooth (lig,num)
{
	var rnum=(num%1);
	var inum=Math.floor(num);
	var rrnum=1-rnum;
	var rlig=(lig%1);
	var rrlig=1-rlig;
	var ilig=Math.floor(lig);
	var va=epSedimentsInt (ilig,inum);
	var vb=epSedimentsInt (ilig,inum+1);
	var vc=epSedimentsInt (ilig+1,inum);
	var vd=epSedimentsInt (ilig+1,inum+1);
	var v=va*rrnum*rrlig +vb*rnum*rrlig +vc*rlig*rrnum +vd*rlig*rnum;
	var v=v/(rrnum*rlig +rnum*rlig +rrnum*rrlig +rnum*rrlig);
	
	return v;
}

function epSedimentsInt(lig,num)
{
	if (num<0) {num+=360;}
	else if (num>=360) {num-=360;}
	
	if (lig<0) {lig=0;}
	else if (lig>=179) {lig=179;}
	
	v=dec64(valsediments[lig][num*2]+valsediments[lig][num*2+1]);
	//maxi=61.4;
	mini=0;
	ecart=21;
	v=v/4096*ecart;
	v=v+mini;
	return v;
}

function epGlace (lati,longi) {
	// la ligne 0 correspond à la latitude 179.5
	longi+=179.5;
	if (longi>=360)
	{
	  longi-=360;
	}
	if (longi<0)
	{
	  longi+=360;
	}

	// la ligne 0 correspond à la latitude 89.5
	var nlat=89.5-lati;
	var nlon=longi;
	var lig=nlat;
	var num=nlon;
	
	return epGlaceSmooth(lig,num);
}

function epGlaceSmooth (lig,num)
{
	var rnum=(num%1);
	var inum=Math.floor(num);
	var rrnum=1-rnum;
	var rlig=(lig%1);
	var rrlig=1-rlig;
	var ilig=Math.floor(lig);
	var va=epGlaceInt (ilig,inum);
	var vb=epGlaceInt (ilig,inum+1);
	var vc=epGlaceInt (ilig+1,inum);
	var vd=epGlaceInt (ilig+1,inum+1);
	var v=va*rrnum*rrlig +vb*rnum*rrlig +vc*rlig*rrnum +vd*rlig*rnum;
	var v=v/(rrnum*rlig +rnum*rlig +rrnum*rrlig +rnum*rrlig);
	
	return v;
}

function epGlaceInt(lig,num)
{
	if (num<0) {num+=360;}
	else if (num>=360) {num-=360;}
	
	if (lig<0) {lig=0;}
	else if (lig>=179) {lig=179;}
	
	v=dec64(valglace[lig][num*2]+valsediments[lig][num*2+1]);
	mini=0;
	ecart=4.1;
	v=v/4096*ecart;
	v=v+mini;
	return v;
}