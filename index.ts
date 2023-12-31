import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion} from 'babylonjs';
import 'babylonjs-loaders';


import { MeshManager } from './src/MeshManager';


const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);
function prepareScene() {

	// Camera
	const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

	// Light
	new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

	// Objects
	const Cube = MeshBuilder.CreateBox("Cube", { updatable: true }, scene);
	Cube.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

	const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", { updatable: true }, scene);
	icosphere.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);
	icosphere.position.set(-2, 0, 0);

	const cylinder = MeshBuilder.CreateCylinder("Cylinder", { updatable: true }, scene);
	cylinder.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);
	cylinder.position.set(2, 0, 0);

	
    new MeshManager(scene, canvas);

	
}
prepareScene();

engine.runRenderLoop(() => {

	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})




