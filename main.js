const {OrbitControls} = THREE;
const preloader = document.getElementById("preloader");

let percent = 0;
let interval;
function loadingTime(length) {
  preloader.style.display = "inline";
  preloader.firstElementChild.textContent = "Loading: 0%";
  percent = 0;
  interval = setInterval(() => {
    preloader.firstElementChild.textContent = `Loading: ${percent}%`;
    percent = Math.min(percent + 1, 100);
  }, length / 150);
  setTimeout(() => {
    preloader.style.display = "none";
    clearInterval(interval);
  }, length);
}
function loadingProcess() {
  preloader.style.display = "inline";
  preloader.firstElementChild.textContent = "Loading: 0%";
  return {
    load: percent => {
    preloader.firstElementChild.textContent = `Loading: ${percent}%`;
    },
    end: () => {
      preloader.style.display = "none";
    }
  };
}

const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(50);

window.onresize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

let positionZ = 0;

let back = new THREE.CubeTextureLoader().setPath("./cubemap/").load([
      "cubemap_1.png",
      "cubemap_3.png",
      "cubemap_4.png",
      "cubemap_5.png",
      "cubemap_0.png",
      "cubemap_2.png",
]);

let astro = {};
let spin = () => {};

const {load, end} = loadingProcess();
const loader = new THREE.STLLoader();
loader.load("astro.stl", geometry => {
    geometry.scale(0.03, 0.03, 0.03);
    geometry.translate(0, 0, -2.3);
    astro = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: 0xa5d0e2,
        roughness: 0.5,
        metalness: 0.3,
        envMap: back
      })
    );
    scene.add(astro);
    spin = () => {
      astro.rotation.x += 0.01;
      astro.rotation.y += 0.005;
      astro.rotation.z += 0.01;
      // mesh.rotation.x += 100;
      // mesh.rotation.y += 100;
      // mesh.rotation.z += 100;
    };
    setTimeout(end, 500);
  },
	xhr => {
    const percent = Math.floor(xhr.loaded / xhr.total * 100);
    load(percent);
	},
	err => {
		console.log("An error happened");
	});

//start

const space = new THREE.TextureLoader().load('space.jpg');

scene.background = back;

const torus = new THREE.Mesh(

  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0x02FFE3,
    roughness: 0.019,
    metalness: 1,
    envMap: back
  })
);
scene.add(torus);
//end

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(30,30,30);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);





let i = 1;
function changeBackground(){
  
  if (i % 2 == 0){
    back = new THREE.CubeTextureLoader().setPath("./cubemap/").load([
      "cubemap_1.png",
      "cubemap_3.png",
      "cubemap_4.png",
      "cubemap_5.png",
      "cubemap_0.png",
      "cubemap_2.png",
    ]);
  }
  else{
    back = new THREE.CubeTextureLoader().setPath("./cubemap/").load([
      "room1.jpeg",
      "room2.jpeg",
      "room3.jpeg",
      "room4.jpeg",
      "room5.jpeg",
      "room6.jpeg",
    ]); 
  }
  i++;
  scene.background = back;
  torus.material.color.set(0xe6d8b2);
  torus.material.envMap = back;
  torus.material.needsUpdate = true;
  loadingTime(1000);
}




//contact form stuff vvv

//get data
const nameInput = document.querySelector('#name');
const email = document.querySelector('#email');
const message = document.querySelector('#message');
const success = document.querySelector('#success');
const errorNodes = document.querySelectorAll(".error");

function validateForm() {

  // https://formspree.io/f/mayvkoer

  clearMessages();
  let errorFlag = false;
  let nameValue = undefined;
  let emailValue = undefined;
  let messageValue = undefined;
  
  if(nameInput.value.length < 1){
    errorNodes[0].innerText = "Name cannot be blank";
    nameInput.classList.add("error-border");
    errorFlag = true;
  } else
    nameValue = nameInput.value;

  if(!emailIsValid(email.value)){
    errorNodes[1].innerText = "Invalid email address";
    email.classList.add("error-border");
    errorFlag = true;
  } else
    emailValue = email.value;

  if(message.value.length < 1){
    errorNodes[2].innerText = "Please enter message";
    message.classList.add("error-border");
    errorFlag = true;
  } else
    messageValue = message.value;

  if(!errorFlag){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://formspree.io/f/mayvkoer");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`name=${nameValue}&email=${emailValue}&message=${messageValue}`);
    success.innerText = "success";
  }
}

//clear error/ success messages i fixed it yay
  function clearMessages(){
    for(let i = 0; i < errorNodes.length; i++){
      errorNodes[i].innerText = "";
    }
    success.innerText = "";
    nameInput.classList.remove("error-border");
    email.classList.remove("error-border");
    message.classList.remove("error-border");
  }

function emailIsValid(email){
  let pattern = /\S+@\S+\.\S+/;
  return pattern.test(email);
}










// const lightHelper = new THREE.PointLightHelper(pointLight);

// scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const ivanTexture = new THREE.TextureLoader().load('ivan.jpg');
const ivan = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5),
  new THREE.MeshBasicMaterial( { map: ivanTexture } )
);

scene.add(ivan);



ivan.position.z = 55;
ivan.position.y = 2;
ivan.position.setX(-15);


const planetTexture = new THREE.TextureLoader().load('planet.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');



const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture
  })
);

scene.add(planet);

planet.position.z = 25;
planet.position.setX(-10);

torus.rotation.x += 90;
torus.rotation.y += 90;
torus.rotation.z += 90;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  planet.rotation.x += 0.05;
  planet.rotation.y += 0.075;
  planet.rotation.z += 0.05;

  ivan.rotation.y += 0.01;
  ivan.rotation.z += 0.01;
  
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
  
}

document.body.onscroll = moveCamera;


window.addEventListener("wheel", e => {
  positionZ += e.deltaY * 0.01;
});


function animate() {
  
  requestAnimationFrame(animate);

  positionZ = Math.max(Math.min(positionZ, 70), 5);
  camera.position.setZ(positionZ);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  spin();

  //controls.update();
  
  renderer.render(scene, camera);
}

animate();











