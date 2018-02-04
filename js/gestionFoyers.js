var foyersVisibles=false;
var meshFoyers;
var foyers=new Array();
var nbFoyers;

function changeToleranceCoupe(value) {
	toleranceCoupe=value/100*(toleranceMax-toleranceMin)+toleranceMin;
	if (coupeFaite) {
		if (foyersVisibles) {
			trouveFoyersArc ();
			trouveVolcansArc ();
		}
		traceCoupe(ctCoupe);
	}
	document.getElementById('valeur-ranger4').innerHTML = Math.round(toleranceCoupe*100) + '%';
}

function setSliderToleranceCoupe () {
	var v=(toleranceCoupe-toleranceMin)/(toleranceMax-toleranceMin)*100;
	setSliderValue("range-slider-4",v);
	document.getElementById('valeur-ranger4').innerHTML = Math.round(toleranceCoupe*100) + '%';
}

function checkFoyers() {
	foyersVisibles=!foyersVisibles;
	meshFoyers.visible=foyersVisibles;
	
	if (foyersVisibles===true) {
		document.getElementById("check_foyers").style.display="block";
		setSliders();
		
	} else {
		document.getElementById("check_foyers").style.display="none";
	}
	
	
	if ((volcansVisibles===true)||(foyersVisibles===true)) {
		document.getElementById("div_tol").style.display="block";
		document.getElementById("range-slider-4").style.display="block";
		document.getElementById("valeur-ranger4").style.display="block";
		setSliders();
		
	} else {
		document.getElementById("div_tol").style.display="none";
		document.getElementById("range-slider-4").style.display="none";
		document.getElementById("valeur-ranger4").style.display="none";
	}
	
	render(true);
	if (coupeFaite) {
		if (foyersVisibles) {
			trouveFoyersArc ();
		}
		traceCoupe(ctCoupe);
	}
}


function extraitFoyers()
{
	var foyersb = foyersbruts.split(',');
	nbFoyers=foyersb.length-1;
	for (var i=0;i<nbFoyers;i++)
	{
		f=foyersb[i];
		//if (i<10) {console.log (f);}
		latf=Math.round(9000-dec364 (f.charAt(0)+f.charAt(1)+f.charAt(2)))/100;
		longf=Math.round(dec364 (f.charAt(3)+f.charAt(4)+f.charAt(5))-18000)/100;
		proff=dec64 (f.charAt(6)+f.charAt(7));
		magf=f.charCodeAt(8)-48;
		//if (i<10) {console.log (latf+" "+longf+" "+proff+" "+magf);}
		foyers[i]=new Object();
		foyers[i].lati=latf;
		foyers[i].longi=longf;
		foyers[i].prof=proff;
		foyers[i].mag=magf;
	}
}

function placeFoyersSurGlobe () {
	var singleGeometry = new THREE.Geometry();
	var geomFoyer=new THREE.BoxGeometry(2, 2, 2);
	var matFoyer= new THREE.MeshBasicMaterial({
				color: '#FFFFAA',
				transparent: true,
				opacity: 0.75
			 });
			 
	var meshF = new THREE.Mesh(geomFoyer);		 
	for (var i=0;i<nbFoyers;i++) {
		if (foyers[i].mag>0) {
			
			deplaceCube (meshF,foyers[i].lati,foyers[i].longi);
			var taille=foyers[i].mag-3;
			meshF.scale.x=taille;
			meshF.scale.y=taille;
			meshF.scale.z=taille;
			meshF.updateMatrix(); // as needed
			singleGeometry.merge(meshF.geometry, meshF.matrix);
		}
	}	
	
	var bufferGeometry = new THREE.BufferGeometry().fromGeometry( singleGeometry);
	
	meshFoyers = new THREE.Mesh(bufferGeometry, matFoyer);
    scene.add(meshFoyers);
	meshFoyers.visible=false;
}


function cloneObj(obj){
    try{
        var copy = JSON.parse(JSON.stringify(obj));
    } catch(ex){
        console.log("Vous utilisez un vieux navigateur bien pourri, qui n'est pas pris en charge par ce site");
    }
    return copy = JSON.parse(JSON.stringify(obj));
}

var tff=new Array();
function trouveFoyersArc () {
	// par précaution on recalcule l'angle
	calcAngleCoupe();
	// cherche les foyers proches de l'arc et les stocke dans tff
	tff.length=0;
	var pta={};
	var ptb={};
	var ptm={};
	pta=cloneObj(wpgc[0]);
	pta.longi+=360;
	ptb=cloneObj(wpgc[nbwp-1]);
	ptb.longi+=360;

	ptm=cloneObj(wpgc[Math.floor(nbwp/2)]); // milieu
	if (ptm.longi>180)
	{
		ptm.longi=ptm.longi-360;
	}
	
	var ptf={};
	var ptf2={};
	var pth={};
	
	var dah=0;  // distance de A à H
	var nf=0;
	var dmax=lcoupe*toleranceCoupe;
	var ldmax=lcoupe/2; //+dmax ?
	var antipodes=false;
	
	var angleFoyer,profFoyer,alpha;
	var latf,longf,proff;
	
	//console.log ("dmax="+dmax);
	
	//console.log ("ldmax="+ldmax);
	
	for (var i=0;i<nbFoyers;i++)
	{
		latf=foyers[i].lati;
		longf=foyers[i].longi;
		ptf.lati=latf;
		ptf.longi=longf;
		ptf2.longi=ptf.longi;
		ptf2.lati=ptf.lati;
		antipodes=false;
		if (longf<0)
		{
			longf=longf+180;
			latf=-latf;
			antipodes=true;
		}
		ptf.lati=latf;
		ptf.longi=longf;	
		
		pth=projarc(pta,ptb,ptf,ptm);
		if (antipodes)
		{
			pth.longi=pth.longi+180;
			pth.lati=-pth.lati;
		}
		

		if (pth.longi>180)
		{
			pth.longi=pth.longi-360;
		}
		
		d=dgrand_cercle(ptf2,pth);
		if (d<(dmax))
		{
		
			dm=dgrand_cercle(ptm,pth);
			if (dm<ldmax)
			{
				dah=dgrand_cercle(pta,pth)/lcoupe; // position en fraction (0 à 1) sur l'arc
				angleFoyer=(1-dah)*angle0C + dah*angle1C;
							
				if ((angleFoyer>angle0C)&&(angleFoyer<angle1C))
				{
					// enregistrement du séisme
					tff[nf]=cloneObj(foyers[i]);
					tff[nf].angleFoyer=angleFoyer;
					tff[nf].dm=dm;
					tff[nf].ldmax=ldmax;
					alpha=1-(d/dmax);
					alpha=Math.round(alpha*1000)/1000;
					tff[nf].alpha=alpha;
					nf++;
				}
			}
		}
	}
	//console.log ("nombre de foyers sous l'arc : "+tff.length);
	
	//§§§§§§§§§§§§ FIN SEISMES
}

function afficheFoyersSurCoupe (ctx) {
	var x,y,rFoyer,alpha,rf,angle;
	for (var i=0;i<tff.length;i++)
	{
		rFoyer=alti2R(-tff[i].prof);
		angle=tff[i].angleFoyer;
		x=Math.round(xCentre+Math.cos(angle)*rFoyer);
		y=Math.round(yCentre+Math.sin(angle)*rFoyer);
		magf=tff[i].mag;
		rf=(magf-2)*lCT/800;
		ctx.beginPath();
		alpha=tff[i].alpha;
		ctx.strokeStyle="rgba(0,0,0,"+alpha+")";
		ctx.fillStyle="rgba(200,200,0,"+alpha+")";
		ctx.arc(x,y,rf,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}	
	if (tff.length>0) {
		// légende
		var x=x0CT+lCT*0.9;
		var y=y0CT+hCT*0.99;
		var rf=(8-2)*lCT/800;
		var alpha=1;
		ctx.strokeStyle="rgba(0,0,0,"+alpha+")";
		ctx.fillStyle="rgba(200,200,0,"+alpha+")";
		ctx.beginPath();
		ctx.arc(x,y,rf,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		x+=lCT*0.01;
		ctx.fillStyle="black";
		var hFont=Math.round(hCT/4.5)/10;
		ctx.font=hFont+"px "+dFont;
		ctx.fillText ("foyer sismique",x+hFont/2,y+hFont*0.35);
	}
}
