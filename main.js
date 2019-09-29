
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

// Same deal for the asteroids belts
var asteroidsInfos = {};


// quick functions
function rad2deg(rad) { return rad * (180 / Math.PI); }
function deg2rad(deg) { return deg * (Math.PI / 180); }



// Init the scene, renderer, camera and controls
function sceneInit() {

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
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 40;
    camera.position.x = 40;
    camera.position.y = 40;

    // INit the controls
    controls = new THREE.OrbitControls(camera);

    // INit the webGL renderer
    //raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio / 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Gamma
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    // confiugure the HTML document and listeners
    document.body.appendChild(renderer.domElement);
    //document.addEventListener( 'click', onDocumentMouseMove, false );

}


function createPlanets(ObjectOfplanets, pointOfReference) {

    for (var planet in ObjectOfplanets) {
        var currentplanet = ObjectOfplanets[planet];
        console.log("Generating " + planet);

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
            console.log(planet + " is a star, adding Pointlight !");
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
            console.log(planet + " has moons, let's create them !");
            createPlanets(currentplanet.moons, mesh);
        }

        // Does it have rings ?
        if (currentplanet.rings !== undefined) {
            console.log(planet + " has rings, let's create them !");
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
        console.log(currAsteroid);
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
            console.log(distance);

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
    console.log("going fullscreen");
    var elem = document.body;
if (elem.requestFullscreen) {
  elem.requestFullscreen();
}
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
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


sceneInit();
window.addEventListener( 'resize', onWindowResize, false );
createPlanets(planets);
createAsteroids(asteroids);
console.log(planetsInfos);
animate();