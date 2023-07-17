import { Color3, MeshBuilder, PBRMaterial, Quaternion, Scene, float } from "babylonjs";
import { GuiManager } from './GuiManager';


/** 
 * Class contains operation applied on mesh loaded in index ts
 * Mesh Pick
 * Update Transforms
*/
export class MeshManager {


    /**
     * Selected Mesh node
     * @type {Mesh} 
     * @memberof MeshManager
     */
    selectedNode: any = null;


    /**
     * refrence of scene created in index
     * @type {Scene} 
     * @memberof MeshManager 
     */
    scene: Scene | any;

    /**
     * refrence of GuiManager 
     * @type {GuiManager reference} 
     * @memberof MeshManager 
     */
    private uiManager: GuiManager | any;

    /**
     * Mesh Store
     * @type {Object} 
     * @memberof MeshManager
     */
    private meshProperties: any = {

        Cube: {
            width: 1,
            height: 1,
            depth: 1,
            defaultPosition: [0, 0, 0],
            material: null
        },
        Cylinder: {
            diameter: 1,
            height: 1,
            defaultPosition: [2, 0, 0],
            material: null
        },
        IcoSphere: {
            radius: 1,
            subdivisions: 4,
            defaultPosition: [-2, 0, 0],
            material: null
        }
    }

    constructor(scene: Scene, canvas: HTMLCanvasElement | any) {
        this.uiManager = new GuiManager(this);
        this.scene = scene;
        this.pickMeshFromScene(canvas);


        //#region setting material 
        scene.clearColor.r = 0.2;
        scene.clearColor.g = 0.2;
        scene.clearColor.b = 0.2;
        // scene.environmentTexture = CubeTexture.CreateFromPrefilteredData("/environment.dds", scene);
        this.meshProperties.Cube.material = new PBRMaterial("pbr", scene);
        this.meshProperties.IcoSphere.material = new PBRMaterial("pbr2", scene);
        this.meshProperties.Cylinder.material = new PBRMaterial("pbr3", scene);
        this.scene.getMeshByName("Cube").material = this.meshProperties.Cube.material;
        this.scene.getMeshByName("IcoSphere").material = this.meshProperties.IcoSphere.material;
        this.scene.getMeshByName("Cylinder").material = this.meshProperties.Cylinder.material;
        this.meshProperties.Cube.material.metallic = 0.5;
        this.meshProperties.Cube.material.roughness = 0.5;
        this.meshProperties.IcoSphere.material.metallic = 0.5;
        this.meshProperties.IcoSphere.material.roughness =0.5;
        this.meshProperties.Cylinder.material.metallic = 0.5;
        this.meshProperties.Cylinder.material.roughness =0.5;
        this.meshProperties.Cube.material.albedoColor = Color3.Gray();
        this.meshProperties.IcoSphere.material.albedoColor = Color3.Gray();
        this.meshProperties.Cylinder.material.albedoColor = Color3.Gray();
        //#endregion

    }

    /**
    * Mesh picker event function
    * @memberof MeshManager
    */
    private pickMeshFromScene(canvas: HTMLCanvasElement) {
        let pickInfo: any;
        canvas.addEventListener(
            'click',
            () => {
                // console.log("dblclick")
                pickInfo = this.scene.pick(
                    this.scene.pointerX,
                    this.scene.pointerY,
                    (mesh: any) => {
                        return mesh;
                    }
                );
                if (pickInfo.hit && pickInfo.pickedMesh) {
                    this.selectedNode = pickInfo.pickedMesh;
                    this.uiManager.UpdateMeshSelectionOnUI();
                    if (this.selectedNode.material) {
                        this.selectedNode.material.wireframe = true;
                        setTimeout(() => {
                            this.selectedNode.material.wireframe = false;

                        }, 200);
                    }
                }

            }
        );
    }

    /**
    * Update SelectedNode variable when mesh selected from ui
    * @memberof MeshManager
    */
    selectMeshFromUi(name: string) {
        this.selectedNode = this.scene.getMeshByName(name)

    }


    //#region 3D Transform Update functions when changed for ui

    /**
    * Common function used for updating mesh transform position, rotation when changed for ui
    * @memberof MeshManager
    */
    update3DTransform(transforms: any, updateUi: boolean) {

        if (this.selectedNode) {
            if (transforms.position)
                this.selectedNode.position.set(parseFloat(transforms.position[0]), parseFloat(transforms.position[1]), parseFloat(transforms.position[2]));

            if (transforms.rotation) {
                // this.selectedNode.rotationQuaternion=null;
                this.selectedNode.rotationQuaternion = Quaternion.FromEulerAngles(parseFloat(transforms.rotation[0]), parseFloat(transforms.rotation[1]), parseFloat(transforms.rotation[2]));
                // this.selectedNode.rotation = new Vector3(parseFloat(transforms.rotation[0]), parseFloat(transforms.rotation[1]), parseFloat(transforms.rotation[2])); 
            }

        }
    }

    /**
    * Update Cube mesh transform width, height and depth when changed for ui
    * @memberof MeshManager
    */
    updateCubeMesh(transforms: any) {

        if (this.selectedNode.name == "Cube") {
            if (transforms.width)
                this.meshProperties.Cube.width = transforms.width;
            else if (transforms.height)
                this.meshProperties.Cube.height = transforms.height;
            else if (transforms.depth)
                this.meshProperties.Cube.depth = transforms.depth;
            var prevMesh = this.scene.getMeshByName("Cube")
            var prevPosition = prevMesh._position;
            var prevrotation = prevMesh._rotationQuaternion;
            prevMesh.dispose();
            const Cube = MeshBuilder.CreateBox("Cube", { updatable: true, width: this.meshProperties.Cube.width, height: this.meshProperties.Cube.height, depth: this.meshProperties.Cube.depth }, this.scene);
            Cube.position = prevPosition
            Cube.rotationQuaternion = prevrotation
            Cube.material = this.meshProperties.Cube.material;
            
            this.selectedNode = Cube;
        }
    }
    /**
    * Update Cylinder mesh transform diameter,height when changed for ui
    * @memberof MeshManager
    */
    updateCylinderMesh(transforms: any) {

        if (this.selectedNode.name == "Cylinder") {
            if (transforms.diameter)
                this.meshProperties.Cylinder.diameter = transforms.diameter;
            else if (transforms.height)
                this.meshProperties.Cylinder.height = transforms.height;

            var prevMesh = this.scene.getMeshByName("Cylinder")
            var prevPosition = prevMesh._position;
            var prevrotation = prevMesh._rotationQuaternion;
            prevMesh.dispose();

            const cylinder = MeshBuilder.CreateCylinder("Cylinder", { updatable: true, diameter: this.meshProperties.Cylinder.diameter, height: this.meshProperties.Cylinder.height }, this.scene);
            // cylinder.position.set(2, 0, 0);
            cylinder.position = prevPosition
            cylinder.rotationQuaternion = prevrotation
            this.selectedNode = cylinder;
            
            cylinder.material = this.meshProperties.Cylinder.material;

        }
    }

    /**
    * Update IcoSphere mesh transform radius and subdivisions when changed for ui
    * @memberof MeshManager
    */
    updateIcoSphereMesh(transforms: any) {

        if (this.selectedNode.name == "IcoSphere") {
            if (transforms.diameter)
                this.meshProperties.IcoSphere.radius = transforms.diameter / 2;
            else if (transforms.subdivisions)
                this.meshProperties.IcoSphere.subdivisions = transforms.subdivisions;

            var prevMesh = this.scene.getMeshByName("IcoSphere")
            var prevPosition = prevMesh._position;
            var prevrotation = prevMesh._rotationQuaternion;
            prevMesh.dispose();
            const IcoSphere = MeshBuilder.CreateIcoSphere("IcoSphere", { updatable: true, radius: this.meshProperties.IcoSphere.radius, subdivisions: this.meshProperties.IcoSphere.subdivisions }, this.scene);

            // IcoSphere.position.set(-2, 0, 0);
            IcoSphere.position = prevPosition
            IcoSphere.rotationQuaternion = prevrotation
            this.selectedNode = IcoSphere;
            IcoSphere.material = this.meshProperties.IcoSphere.material;
        }
    }

    updateSelectedMeshPosition(value: any) {

        if (this.selectedNode.name) {


            this.selectedNode.position.y = value;
        }
    }

    /**
 * Disable all scene nodes
 * @memberof MeshManager
 */
    disableAllNode() {
        for (let index = 0; index < this.scene.meshes.length; index++) {
            const element = this.scene.meshes[index];
            element.setEnabled(false)
        }
    }

    /**
    * Set Selecetd node for animation
    * @memberof MeshManager
    */
    setEnableNodeForAnimation(amplitude: float) {
        this.selectedNode.setEnabled(true);
        this.selectedNode.position.x = 0;
        this.selectedNode.position.y = amplitude;
        this.selectedNode.position.z = 0;
    }

    /**
    * Reset all mesh nodes position
    * @memberof MeshManager
    */
    ResetAllMesh() {
        const meshes = Object.keys(this.meshProperties);
        for (let index = 0; index < meshes.length; index++) {
            const meshName = meshes[index];
            let mesh = this.scene.getMeshByName(meshName);
            mesh.setEnabled(true);
            const defaultPosition = this.meshProperties[meshName].defaultPosition;
            mesh.position.set(defaultPosition[0], defaultPosition[1], defaultPosition[2])
            if (this.selectedNode.name == meshName)
                this.uiManager.updateUITransform(mesh)
        }

    }
    //#endregion

}


