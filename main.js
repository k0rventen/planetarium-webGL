
// Vars for global scope
var camera, scene, renderer, raycaster, controls;
var stop = false;

// Quality presets for the renderer
var qualityPresets = {
    high: {
        antialias: true,
        pixelRatio: 4,
        fps: 60,
        shadowMapSize: 4096
    },
    medium: {
        antialias: true,
        pixelRatio: 2,
        fps: 60,
        shadowMapSize: 2048
    },
    low: {
        antialias: false,
        pixelRatio: 1,
        fps: 20,
        shadowMapSize: 512
    }
}
var defaultQualityPreset = qualityPresets['low']

// Array that contains the live informations for each planets
// also used to store the pivotPoint object
var planetsInfos = {};

const selectPlanets = document.getElementsByName('planets');
selectPlanets[0].options.add(new Option('Select planet', ''));
const details = document.getElementById('details');
let planetsWanted = ['mercure', 'venus', 'terre', 'mars', 'jupiter', 'saturne', 'uranus', 'neptune'];
const url = 'https://api.le-systeme-solaire.net/rest.php/bodies';
planetsWanted.forEach((planetInfos) => {
    selectPlanets[0].options.add(new Option(planetInfos.charAt(0).toUpperCase()+planetInfos.slice(1), planetInfos));
    fetch(url+'/'+planetInfos)
    .then(function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        response.json().then(function(data) {
            var planetContainer = document.createElement("div");
            planetContainer.setAttribute("class", 'planet');
            planetContainer.setAttribute("data-id", data.id);
            planetContainer.setAttribute("style", 'display:none;');

            var tree = document.createDocumentFragment();
            var planet = document.createElement("div");
            planet.appendChild(document.createTextNode('Planète : '+data.name));

            var discoveredBy = document.createElement("div");
            discoveredBy.appendChild(document.createTextNode('Nom(s) du découvreur de l\'astre : '+data.discoveredBy));

            var discoveryDate = document.createElement("div");
            discoveryDate.appendChild(document.createTextNode('Date de découverte de l\'astre : '+data.discoveryDate));

            var moons = document.createElement("div");
            moons.appendChild(document.createTextNode('Nombre de satellites de l\'astre : '+(data.moons !== null ? data.moons.length : 0)));

            var density = document.createElement("div");
            density.appendChild(document.createTextNode('La dentité de l\'astre en g.cm3 : '+data.density));

            var gravity = document.createElement("div");
            gravity.appendChild(document.createTextNode('La gravité de surface en m.s-2 : '+data.gravity));

            var semimajorAxis = document.createElement("div");
            semimajorAxis.appendChild(document.createTextNode('Le demi grand axe en kilomètres : '+data.semimajorAxis));

            var perihelion = document.createElement("div");
            perihelion.appendChild(document.createTextNode('Le périhélie en kilomètres : '+data.perihelion));

            var apheion = document.createElement("div");
            apheion.appendChild(document.createTextNode('L\'aphélie en kilomètres : '+data.apheion));

            var eccentricity = document.createElement("div");
            eccentricity.appendChild(document.createTextNode('L\'excentricité orbitale : '+data.eccentricity));

            var inclination = document.createElement("div");
            inclination.appendChild(document.createTextNode('L\'inclinaison orbitale en degrés : '+data.inclination));

            var mass = document.createElement("div");
            mass.appendChild(document.createTextNode('La masse de l\'objet en 10n kg : '+data.mass.massValue+' '+data.mass.massExponent));

            var vol = document.createElement("div");
            vol.appendChild(document.createTextNode('Le Volume  de l\'objet en 10n kg : '+data.vol.volValue+' '+data.vol.volExponent));

            var escape = document.createElement("div");
            escape.appendChild(document.createTextNode('La vitesse d\'échappement en m.s-1 : '+data.escape));

            var meanRadius = document.createElement("div");
            meanRadius.appendChild(document.createTextNode('Le rayon moyen en kilomètres : '+data.meanRadius));

            var equaRadius = document.createElement("div");
            equaRadius.appendChild(document.createTextNode('Le rayon équatorial en kilomètres : '+data.equaRadius));

            var polarRadius = document.createElement("div");
            polarRadius.appendChild(document.createTextNode('Le rayon polaire en kilomètres : '+data.polarRadius));

            var flattening = document.createElement("div");
            flattening.appendChild(document.createTextNode('L\'aplatissement : '+data.flattening));

            var dimension = document.createElement("div");
            dimension.appendChild(document.createTextNode('Dimension de l\'astre en kilomètres sur 3 axes X, Y et Z pour les astres non sphériques : '+data.dimension));

            var sideralOrbit = document.createElement("div");
            sideralOrbit.appendChild(document.createTextNode('La période le révolution de l\'astre autour d\'un autre astre (le Soleil ou une planète) en jours terrestres : '+data.sideralOrbit));

            var sideralRotation = document.createElement("div");
            sideralRotation.appendChild(document.createTextNode('La période de rotation de l\'astre, le temps nécessaire pour astre pour réaliser un tour sur lui même, en heure : '+data.sideralRotation));

            tree.appendChild(planet);
            if (data.discoveredBy !== "") tree.appendChild(discoveredBy);
            if (data.discoveryDate !== "") tree.appendChild(discoveryDate);
            tree.appendChild(moons);
            tree.appendChild(density);
            tree.appendChild(gravity);
            tree.appendChild(semimajorAxis);
            tree.appendChild(eccentricity);
            tree.appendChild(mass);
            tree.appendChild(vol);
            tree.appendChild(escape);
            tree.appendChild(meanRadius);
            if (data.dimension !== "") tree.appendChild(dimension);
            tree.appendChild(sideralOrbit);
            tree.appendChild(sideralRotation);
            planetContainer.appendChild(tree);
            details.appendChild(planetContainer);
        });
    })
    .catch(function(error) {
        console.log('Fetch Error :-S', error);
    });
});

// Same deal for the asteroids belts
var asteroidsInfos = {};


// quick functions
function rad2deg(rad) { return rad * (180 / Math.PI); }
function deg2rad(deg) { return deg * (Math.PI / 180); }



// Init the scene, renderer, camera and controls
function sceneInit(canvasEl) {

    // INit the scene
    scene = new THREE.Scene();

    // Init the background
    var geometry = new THREE.SphereGeometry(400, 32, 32);
    var texture = new THREE.TextureLoader().load("assets/background.jpg");
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(deg2rad(30));
    mesh.rotateY(deg2rad(30));
    mesh.rotateZ(deg2rad(30));
    scene.add(mesh);
    

    // Init the camera
    camera = new THREE.PerspectiveCamera(90, canvasEl.offsetWidth / document.body.clientHeight, 0.01, 1000);
    camera.position.z = 40;
    camera.position.x = 40;
    camera.position.y = 40;

    // INit the webGL renderer
    //raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio / 1);
    renderer.setSize(canvasEl.offsetWidth, document.body.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // INit the controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Gamma
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    // confiugure the HTML document and listeners
    canvasEl.appendChild(renderer.domElement);
    //document.addEventListener( 'click', onDocumentMouseMove, false );

}


function createPlanets(ObjectOfplanets, pointOfReference) {

    for (var planet in ObjectOfplanets) {
        var currentplanet = ObjectOfplanets[planet];

        // If pointOfReference is not defined, create one
        if (pointOfReference === undefined) {
            var localPointOfReference = new THREE.Object3D();
            scene.add(localPointOfReference);
        }
        else { var localPointOfReference = pointOfReference }


        // Add the planet
        var texture = new THREE.TextureLoader().load(currentplanet.asset);
        var geometry = new THREE.SphereGeometry(currentplanet.radius, 32, 32);
        var material = new THREE.MeshPhongMaterial({ map: texture, opacity: 0 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(currentplanet.distance);
        mesh.name = planet;



        // Is it a star ? 
        if (currentplanet.light !== undefined) {
            var light = new THREE.PointLight(0xffffff, 2, 0, 2);
            light.castShadow = true;
            light.shadow.mapSize.width = 512;  // default
            light.shadow.mapSize.height = 512; // default
            light.shadow.camera.near = 0.5;       // default
            light.shadow.camera.far = 500      // default

            // Lensflare
            var textureLoader = new THREE.TextureLoader();
            var textureFlare0 = textureLoader.load("assets/lensflare_main.png");
            var textureFlare1 = textureLoader.load("assets/lensflare_artefact.png");
            var lensflare = new THREE.Lensflare();
            lensflare.addElement(new THREE.LensflareElement(textureFlare0, 64, 0));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 32, 0));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 20, 0.2));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 40, 0.4));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 60, 0.6));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 40, 0.8));
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 20, 1));

            // God ray shader ? 


            // Add to mesh
            light.add(lensflare);
            mesh.add(light);


        }
        else {
            // Add the orbit
            var geometry = new THREE.TorusGeometry(currentplanet.distance, 0.02, 16, 100);
            var material = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
            var torus = new THREE.Mesh(geometry, material);
            torus.rotateX(deg2rad(90));
            localPointOfReference.add(torus);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
        }

        // Does it have moons ? if so, createplanets on those as well !
        if (currentplanet.moons !== undefined) {
            createPlanets(currentplanet.moons, mesh);
        }

        // Does it have rings ?
        if (currentplanet.rings !== undefined) {
            createRings(currentplanet.rings, mesh);
        }


        // Add the object to the scene
        var localPivotPoint = new THREE.Object3D();
        localPivotPoint.add(mesh);
        localPointOfReference.add(localPivotPoint);

        // Apply a initial random rotation
        localPivotPoint.rotateY(deg2rad(Math.floor(Math.random() * 360) + 1));


        //localPivotPoint.rotateX(deg2rad(Math.floor(Math.random() * 8) + 1));
        //localPivotPoint.rotateZ(deg2rad(Math.floor(Math.random() * 8) + 1));

        // Add the infos to the cached infos
        planetsInfos[planet] = currentplanet;
        planetsInfos[planet].pivotPoint = localPivotPoint;
    }
}

function createAsteroids(asteroids) {
    for (var asteroid in asteroids) {

        var currAsteroid = asteroids[asteroid];
        var localPivotPoint = new THREE.Object3D();
        scene.add(localPivotPoint);

        for (let i = 0; i < currAsteroid.number; i++) {
            geometry = new THREE.DodecahedronGeometry(.2, 1);
            geometry.vertices.forEach(function (v) {
                v.x += (0 - Math.random() * (1 / 2));
                v.y += (0 - Math.random() * (1 / 2));
                v.z += (0 - Math.random() * (1 / 2));
            })
            var color = '#222222';
            texture = new THREE.MeshStandardMaterial({ color: color });
            var asteroidMesh = new THREE.Mesh(geometry, texture);
            asteroidMesh.castShadow = true;
            asteroidMesh.receiveShadow = true;
            var distance = Math.floor(Math.random() * (currAsteroid.upper - currAsteroid.lower) + currAsteroid.lower);

            // Compute position from distance + random angle
            var angle = Math.floor(Math.random() * 360) + 1;
            var x = distance * Math.cos(angle);
            var y = distance * Math.sin(angle);
            asteroidMesh.translateZ(x);
            asteroidMesh.translateX(y);
            localPivotPoint.add(asteroidMesh);
        }
        // Add the infos to the cached infos
        asteroidsInfos[asteroid] = currAsteroid;
        asteroidsInfos[asteroid].pivotPoint = localPivotPoint;

    }
}



function createRings(rings, pointOfReference) {

}

function toggleFullscreen(){
    var elem = canvasEl;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    renderer.setSize( document.body.clientWidth, document.body.offsetHeight );
}

function exitFullscreen() {
    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
        renderer.setSize( canvasEl.offsetWidth, document.body.clientHeight );
    }
}

function onWindowResize() {
    camera.aspect = canvasEl.offsetWidth / document.body.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( canvasEl.offsetWidth, document.body.clientHeight );
}

function setQualittyPreset(){
    console.log("changing quality preset");
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (!stop) {
        for (var Planet in planetsInfos) {
            var currPlanet = planetsInfos[Planet];
            currPlanet.pivotPoint.rotateY(deg2rad(currPlanet.speed));
        }

        for (var AsteroidBelt in asteroidsInfos) {
            var currAsteroid = asteroidsInfos[AsteroidBelt];
            currAsteroid.pivotPoint.rotateY(deg2rad(currAsteroid.speed));
        }

    }

    renderer.render(scene, camera);
}

const canvasEl = document.getElementById('canvas');

window.onload = function() {
    sceneInit(canvasEl);
    window.addEventListener( 'resize', onWindowResize(canvasEl), false );
    createPlanets(planets);
    createAsteroids(asteroids);
    animate();

    selectPlanets[0].addEventListener( 'click', function (e) {
        e.preventDefault();
        var listPlanets = document.body.getElementsByClassName('planet');
        for (let item of listPlanets) {
            if (selectPlanets[0].value === item.dataset.id){
                item.setAttribute("style", 'display:block;');
            } else {
                item.setAttribute("style", 'display:none;');
            }
        }
    });

    if (document.addEventListener) {
        document.addEventListener('fullscreenchange', exitFullscreen, false);
        document.addEventListener('mozfullscreenchange', exitFullscreen, false);
        document.addEventListener('MSFullscreenChange', exitFullscreen, false);
        document.addEventListener('webkitfullscreenchange', exitFullscreen, false);
    }    
};