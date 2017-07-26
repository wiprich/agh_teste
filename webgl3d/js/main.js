var horse, scene, aspectRatio, camera, controls, loader, spotLight;
    var geometry, material, mesh;
    var raycaster;


    var objects = [];

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {

          if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

          } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

          }

        };

        var pointerlockerror = function ( event ) {

          instructions.style.display = '';

        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {

          instructions.style.display = 'none';

          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
          element.requestPointerLock();

        }, false );

      } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

      }

    function loader_Handle(geometry, materials)
    {
    

      var material = materials[0];
      var obj3D = new THREE.Mesh(geometry, material);



      horse = obj3D;
      horse.material.color = new THREE.Color(0xffffff);
      //horse.position.y = 10
  
      scene.add(obj3D);

      initPosition();
    }

     

    init();
    animate();
    

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();


    function init() 
    {


        scene = new THREE.Scene();
        aspectRatio = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);
        camera.position.set(-10.5132, 10, -6);
        camera.rotation.set(0, 1.8, 0);

        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());

        loader = new THREE.JSONLoader();

        loader.load('models/horse.json', loader_Handle);

        spotLight = new THREE.SpotLight(0xffffff);

        spotLight.castShadow = true;
        spotLight.position.set(10, 10, 40)

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;
        spotLight.shadow.camera.fov = 30;

        scene.add(spotLight);

        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );



        var onKeyDown = function ( event ) {

          switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
              moveForward = true;
              break;

            case 37: // left
            case 65: // a
              moveLeft = true; break;

            case 40: // down
            case 83: // s
              moveBackward = true;
              break;

            case 39: // right
            case 68: // d
              moveRight = true;
              break;
      

            case 81:
              moveUp = true;
              break;

            case 69:
              moveDown = true;
              break;

          }

        };

        var onKeyUp = function ( event ) {

          switch( event.keyCode ) {

            case 38: // up
            case 87: // w
              moveForward = false;
              break;

            case 37: // left
            case 65: // a
              moveLeft = false;
              break;

            case 40: // down
            case 83: // s
              moveBackward = false;
              break;

            case 39: // right
            case 68: // d
              moveRight = false;
              break;

             case 81:
              moveUp = false;
              break;

            case 69:
              moveDown = false;
              break;

          }

        };

        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        window.addEventListener( 'resize', onWindowResize, false );

        renderer = new THREE.WebGLRenderer({alpha:true});
        renderer.setClearColor(0x0075bb, 1);

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);


        animate();
    }

    function initPosition()
    {
      controls.getObject().position = new THREE.Vector3(0.1528, -9.82, -6.6805);
      horse.position.z = -25;
      horse.rotation.y = 45;
      horse.position.y = 20;
    }

    function animate()
    {
      requestAnimationFrame( animate );

        if ( controlsEnabled ) {
          raycaster.ray.origin.copy( controls.getObject().position );
          raycaster.ray.origin.y -= 10;

          var intersections = raycaster.intersectObjects( objects );

          var isOnObject = intersections.length > 0;

          var time = performance.now();
          var delta = ( time - prevTime ) / 1000;

          velocity.x -= velocity.x * 10.0 * delta;
          velocity.z -= velocity.z * 10.0 * delta;

          velocity.y -= velocity.y * 10.0 * delta; // 100.0 = mass

          if ( moveForward ) velocity.z -= 400.0 * delta;
          if ( moveBackward ) velocity.z += 400.0 * delta;

          if ( moveLeft ) velocity.x -= 400.0 * delta;
          if ( moveRight ) velocity.x += 400.0 * delta;

          if ( moveDown ) velocity.y -= 100 * delta;
          if ( moveUp ) velocity.y += 100 * delta;


          controls.getObject().translateX( velocity.x * delta );
          controls.getObject().translateY( velocity.y * delta );
          controls.getObject().translateZ( velocity.z * delta );

          

          prevTime = time;

        }

        render();

    }


    function render()
    {


      renderer.render(scene, camera);
        
    }