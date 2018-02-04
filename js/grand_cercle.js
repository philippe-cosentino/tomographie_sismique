function calculOrtho (pta,ptb)
{
	// calcul orthodromie
	lcoupe=dgrand_cercle(pta,ptb);
	
	// calcul du grand cercle
	var bearing=cap(pta,ptb);
	var ptx={};
	var pwp={};
	ptx=pta;
	wpgc[0]=ptx;
	wpgc[nbwp-1]=ptb;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,ptb); // radians			
		pwp=wp (ptx,bearing,lcoupe/(nbwp-1));
		ptx=pwp;
		wpgc[i]=ptx;
	}
	// fin calcul grand cercle
}

function calculRectangle (pta,ptb)
{
	var ptc=rectangleC(pta,ptb);
	var ptd=rectangleD(pta,ptb);
	//console.log ("l(ab)="+lcoupe);
	
	// calcul du grand cercle B->D, raccourci
	var l=dgrand_cercle(ptb,ptd)*toleranceCoupe;
	var bearing=cap(ptb,ptd);
	var ptx={};
	var pwp={};
	ptx=ptb;
	wpBD[0]=ptx;
	//wpBD[nbwp-1]=ptd;
	for (i=1;i<(nbwp);i++)
	{
		bearing=cap(ptx,ptd); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpBD[i]=ptx;
	}
	// fin calcul grand cercle B->D raccourci
	// on ramène D à l'extrémité de ce grand cercle raccourci
	ptd=wpBD[nbwp-1];
	
	// calcul du grand cercle A->C, raccourci
	var wpAC=new Array();// ne sert que localement, pour calculer C raccourci
	var l=dgrand_cercle(pta,ptc)*toleranceCoupe;
	var bearing=cap(pta,ptc);
	var ptx={};
	var pwp={};
	ptx=pta;
	wpAC[0]=ptx;
	for (i=1;i<(nbwp);i++)
	{
		bearing=cap(ptx,ptc); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpAC[i]=ptx;
	}
	// fin calcul grand cercle A->C raccourci
	// on ramène C à l'extrémité de ce grand cercle raccourci
	ptc=wpAC[nbwp-1];
	
	// calcul du grand cercle D->C
	var l=dgrand_cercle(ptd,ptc);
	//console.log ("l(dc)="+l);
	var bearing=cap(ptd,ptc);
	var ptx={};
	var pwp={};
	ptx=ptd;
	wpDC[0]=ptx;
	wpDC[nbwp-1]=ptc;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,ptc); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpDC[i]=ptx;
	}
	// fin calcul grand cercle D->C
	
	// calcul du grand cercle C->A
	var l=dgrand_cercle(ptc,pta);
	var bearing=cap(ptc,pta);
	var ptx={};
	var pwp={};
	ptx=ptc;
	wpCA[0]=ptx;
	wpCA[nbwp-1]=pta;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,pta); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpCA[i]=ptx;
	}
	// fin calcul grand cercle C->A
}

function calculCarre (pta,ptb)
{
	var ptc=carreC(pta,ptb);
	var ptd=carreD(pta,ptb);
	//console.log ("l(ab)="+lcoupe);
	
	// calcul du grand cercle B->D
	var l=dgrand_cercle(ptb,ptd);
	var bearing=cap(ptb,ptd);
	var ptx={};
	var pwp={};
	ptx=ptb;
	wpBD[0]=ptx;
	wpBD[nbwp-1]=ptd;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,ptd); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpBD[i]=ptx;
	}
	// fin calcul grand cercle B->D
	
	// calcul du grand cercle D->C
	var l=dgrand_cercle(ptd,ptc);
	//console.log ("l(dc)="+l);
	var bearing=cap(ptd,ptc);
	var ptx={};
	var pwp={};
	ptx=ptd;
	wpDC[0]=ptx;
	wpDC[nbwp-1]=ptc;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,ptc); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpDC[i]=ptx;
	}
	// fin calcul grand cercle D->C
	
	// calcul du grand cercle C->A
	var l=dgrand_cercle(ptc,pta);
	var bearing=cap(ptc,pta);
	var ptx={};
	var pwp={};
	ptx=ptc;
	wpCA[0]=ptx;
	wpCA[nbwp-1]=pta;
	for (i=1;i<(nbwp-1);i++)
	{
		bearing=cap(ptx,pta); // radians			
		pwp=wp (ptx,bearing,l/(nbwp-1));
		ptx=pwp;
		wpCA[i]=ptx;
	}
	// fin calcul grand cercle C->A
}

function dgrand_cercle(a,b)
{
	var latmin=a.lati;
	var latmax=b.lati;
	var longmin=a.longi;
	var longmax=b.longi;
	var d=0;

	var deltalong=Math.abs((longmax%360)-(longmin%360));
	//console.log ("deltalong"+deltalong);
	
	argt=Math.sin(latmin/180*Math.PI)*Math.sin(latmax/180*Math.PI) + Math.cos (latmin/180*Math.PI)*Math.cos (latmax/180*Math.PI)*Math.cos (Math.abs(deltalong/180*Math.PI));
	d=Math.acos(argt)*rayonTerre; // rayon de la terre=6371
	return d;
}

function cap (pta,ptb)
{
	// we assume that coordinates are Latitude and Longitude as signed decimal degrees with negative longitude in the western hemisphere and negative latitude in the southern hemisphere. 
	// le cap est donné en degrés vers le Nord
	x1=pta.longi; x2=ptb.longi; y1=pta.lati; y2=ptb.lati;
	if (x1>180)
	{
	  x1=x1-360;
	}
	if (x2>180)
	{
	  x2=x2-360;
	}
	//console.log ('calcul du cap pour longmin='+x1+' latmin='+y1+' longmax='+x2+' latmax='+y2);
	x1=x1/180*Math.PI;
	x2=x2/180*Math.PI;
	y1=y1/180*Math.PI;
	y2=y2/180*Math.PI;
	// tout est converti en radian
	aa=Math.cos(y2)*Math.sin(x2-x1);
	bb=Math.cos(y1)*Math.sin(y2) - Math.sin(y1)*Math.cos(y2)*Math.cos (x2-x1);
	adjust=0;
	if((aa == 0) && (bb == 0)) 
	{
		  bearing = 0;
	}
	else if( bb == 0) 
	{
		  if( aa < 0)  
			  bearing = 3 * Math.PI / 2;
		  else
			  bearing = Math.PI / 2;
	} 
	else if( bb < 0) 
		  adjust = Math.PI;
	else
	{
		  if( aa < 0) 
			  adjust = 2 * Math.PI;
		  else
			  adjust = 0;
	}
	return (Math.atan(aa/bb) + adjust);
	
  
} 

function wp(ptc,cap,d)
{
	var pwp={};
	x1=ptc.longi/180*Math.PI;
	y1=ptc.lati/180*Math.PI;
	// tout est converti en radian
	d=d/6371;
	y2 = Math.asin( Math.sin(y1) * Math.cos(d) + Math.cos(y1) * Math.sin(d) * Math.cos(cap));
	a = Math.sin(d) * Math.sin(cap);
	b = Math.cos(y1) * Math.cos(d) - Math.sin(y1) * Math.sin(d) * Math.cos(cap);

	if( b == 0 ) 
      x2 = x1;
	else
      x2 = x1 + Math.atan(a/b);
	  
	t=new Array();
	
	pwp.longi=x2*180/Math.PI;
	pwp.lati=y2*180/Math.PI;
	return pwp;
	// attention valeurs des longitudes et latitudes en radians

}

function modifieLigne()
{
	for (var i=0;i<nbwp;i++)
	{	
		var lati=wpgc[i].lati;
		var longi=wpgc[i].longi;
		var p1=calcsph(lati,longi+90);
		var p2=sphcart(p1);
		var r=rTerre+1;
		var x=p2.y*r;
		var y=p2.z*r;
		var z=p2.x*r;
		ligne.geometry.vertices[i].x=x;
		ligne.geometry.vertices[i].y=y;
		ligne.geometry.vertices[i].z=z;
	}
	
	ligne.geometry.verticesNeedUpdate = true;
}

function modifieLigneRect(decal)
{
	// d = décalage pour 2ème moitié rectangle
	var nbp=Math.floor(nbwp/8);
	var d=0;
	if (decal===true) {d=nbp*4;}
	
	// BD
	for (var i=0;i<nbp;i++)
	{	
		var ii=i*8;
		var lati=wpBD[ii].lati;
		var longi=wpBD[ii].longi;
		var p1=calcsph(lati,longi+90);
		var p2=sphcart(p1);
		var r=rTerre+1;
		var x=p2.y*r;
		var y=p2.z*r;
		var z=p2.x*r;
		ligne2.geometry.vertices[i+d].x=x;
		ligne2.geometry.vertices[i+d].y=y;
		ligne2.geometry.vertices[i+d].z=z;
	}
	
	//DC
	for (var i=0;i<nbp*2;i++)
	{	
		var ii=i*4;
		var lati=wpDC[ii].lati;
		var longi=wpDC[ii].longi;
		var p1=calcsph(lati,longi+90);
		var p2=sphcart(p1);
		var r=rTerre+1;
		var x=p2.y*r;
		var y=p2.z*r;
		var z=p2.x*r;
		ligne2.geometry.vertices[i+nbp+d].x=x;
		ligne2.geometry.vertices[i+nbp+d].y=y;
		ligne2.geometry.vertices[i+nbp+d].z=z;
	}
	
	//CA
	for (var i=0;i<nbp;i++)
	{	
		var ii=i*8;
		var lati=wpCA[ii].lati;
		var longi=wpCA[ii].longi;
		var p1=calcsph(lati,longi+90);
		var p2=sphcart(p1);
		var r=rTerre+1;
		var x=p2.y*r;
		var y=p2.z*r;
		var z=p2.x*r;
		ligne2.geometry.vertices[i+nbp*3+d].x=x;
		ligne2.geometry.vertices[i+nbp*3+d].y=y;
		ligne2.geometry.vertices[i+nbp*3+d].z=z;
	}
	
	if (decal) {ligne2.geometry.verticesNeedUpdate = true;}
}


function effaceLigne()
{
	for (var i=0;i<nbwp;i++)
	{	

		ligne.geometry.vertices[i].x=0;
		ligne.geometry.vertices[i].y=0;
		ligne.geometry.vertices[i].z=0;
		
		ligne2.geometry.vertices[i].x=0;
		ligne2.geometry.vertices[i].y=0;
		ligne2.geometry.vertices[i].z=0;
	}
	ligne.geometry.verticesNeedUpdate = true;
	ligne2.geometry.verticesNeedUpdate = true;
	
}

