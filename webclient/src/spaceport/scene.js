import * as THREE from 'three/build/three.module';
import { Ship } from './Ship';

export const scene = ({ ref }) => {
	let t = 0.01;
	const shipInterval = 2;
	let nextShip = shipInterval;

	var scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	const width = ref.current.clientWidth;
	const height = ref.current.clientHeight;
	renderer.setSize(width, height);

	const camera = new THREE.PerspectiveCamera(65, width / height, 0.01, 1000);
	camera.position.set(3, 0.5, 5);
	camera.lookAt(new THREE.Vector3(-9, 0, 3));
	scene.add(camera);

	ref.current.appendChild(renderer.domElement);

	var sphere = new THREE.SphereBufferGeometry(1);
	var object = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(0xff0000));
	var boxHelp = new THREE.BoxHelper(object, 0xffff00);
	// scene.add(boxHelp);

	let ships = [];
	const ship = new Ship();
	scene.add(ship.mesh);
	ships.push(ship);

	const animate = () => {
		const deltaTime = 0.075;
		t += deltaTime;

		// register mouse event for 'onmove'
		// get mouse x & y
		// const mu = mousex / ref.width
		// const mv = mousey / ref.heigh

		// camera.x = sin(mu * Math.PI * 2)
		// camera.z = cos(mu * Math.PI * 2)

		if (t > nextShip) {
			console.log('bing');
			const ship = new Ship();
			scene.add(ship.mesh);
			ships.push(ship);
			nextShip += shipInterval + (Math.random() - 0.5) * 2;
		}

		for (const ship of ships) {
			ship.update({ deltaTime });
			if (ship.kill) {
				console.log('killing ship');
				scene.remove(ship.mesh);
			}
		}

		ships = ships.filter((s) => !s.kill);

		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	};

	animate();

	renderer.render(scene, camera);
};
