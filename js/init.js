function init_scene(){
    // on initialise le moteur de rendu
	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias:true} );
	
    renderer.setSize( lGL, hGL);
    document.getElementById('divgl').appendChild(renderer.domElement);
	
    // on initialise la scène
    scene = new THREE.Scene();
	
	var ratio=hGL/lGL;

    // on initialise la camera que l’on place ensuite sur la scène
	camera = new THREE.OrthographicCamera( taille / - 2, taille / 2, taille / 2*ratio, taille / - 2*ratio, 1, 20000 );
    scene.add(camera);

	
	// on rajoute un cube marqueur
	cube1 = new THREE.Mesh(new THREE.SphereGeometry( 10, 32,32 ), new THREE.MeshPhongMaterial({
        // light
        specular: '#440000',
        // intermediate
        color: '#993333',
        // dark
        emissive: '#220000',
      }));
	//cube1.overdraw = true;
	scene.add(cube1);
	cube1.position.set(0,0,0);
		
	cube2 = new THREE.Mesh(new THREE.SphereGeometry( 10, 32,32 ), new THREE.MeshPhongMaterial({
        specular: '#000044',
        color: '#333399',
        emissive: '#000022',
      }));
	//cube2.overdraw = true;
	scene.add(cube2);
	cube2.position.set(0,0,0);
	
	
	sphereMarqueur = new THREE.Mesh(new THREE.SphereGeometry( 8, 32,32 ), new THREE.MeshPhongMaterial({
        specular: '#FFFFFF',
        color: '#AAFFAA',
        emissive: '#448844',
      }));
	//sphereMarqueur.overdraw = true;
	scene.add(sphereMarqueur);
	sphereMarqueur.position.set(0,0,0);

	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x555555);
	scene.add(ambientLight);

	// directional lighting
	lumiere = new THREE.DirectionalLight(0x666666);
	lumiere.position.set (dLampe,0,0);
		  
	scene.add(lumiere);

	creeLigne();
}

function creeLigne()
{
	var materialLigne = new THREE.LineBasicMaterial({
        color: 0xff00ff,
    });
	
	var materialLigne2 = new THREE.LineBasicMaterial({
        color: 0x775577,
    });
	
	var geometryLigne = new THREE.Geometry();
	for (var i=0;i<nbwp;i++)
	{	
		geometryLigne.vertices.push(new THREE.Vector3(0,0,0));
	}
	

	var geometryLigne2 = new THREE.Geometry();
	for (var i=0;i<nbwp;i++)
	{	
		geometryLigne2.vertices.push(new THREE.Vector3(0,0,0));
	}
	
	ligne = new THREE.Line(geometryLigne, materialLigne);
	ligne2 = new THREE.Line(geometryLigne2, materialLigne2);
	scene.add(ligne);
	scene.add(ligne2);
	    
}

function init_planete(){
    
	// on créé la sphère et on lui applique une texture sous forme d’image
	var geometrySphere = new THREE.SphereGeometry( rTerre, 64,64 );
	
	var texture = new THREE.Texture( imageTerre );
	texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;
	
	var textureBump = new THREE.Texture( imageBump );
	textureBump.needsUpdate = true;
	textureBump.minFilter = THREE.LinearFilter;
	
	
	var material2 = new THREE.MeshPhongMaterial({
		//map 
		map: texture,
		emissiveMap:texture,
		bumpMap: textureBump,
		bumpScale : bump*2,
        specular: '#999999',
        color: '#bbbbbb',
        emissive: '#888888',
        shininess: 8,
	});
	
	var geometry = new THREE.BufferGeometry().fromGeometry( geometrySphere);
	
	meshTerre = new THREE.Mesh( geometry, material2 );
	meshTerre.castShadow = false;
	//meshTerre.overdraw = true;
	meshTerre.position.set(0,0,0);
	
	scene.add( meshTerre );	

}

