import { MeshManager } from './MeshManager';
import { AnimationManager } from './AnimationManager';


/**
 * Lite Gui Library
 */
declare var UILib: any;

/** 
 * Class contains operation related to UI
 * Ui Creation and events from ui
*/
export class GuiManager {

    /** 
     * refrence of Lite Gui Library 
     * @type {Lite Gui Object} 
     * @memberof GuiManager
     */
    private uiInstance: any;

    /**
     * refrence of MeshManager 
     * @type {MeshManager Object} 
     * @memberof GuiManager 
     */
    private meshmanager: MeshManager | any;

    /**
     * refrence of AnimationManager 
     * @type {AnimationManager Object} 
     * @memberof GuiManager 
     */
    private animManager: AnimationManager | any;

    /**
     * Scene Heirachy List
     * @type {UI List} 
     * @memberof GuiManager 
     */
    private sceneTree: any;

    /**
     * Enable DIsbale Update from ui to 3D
     * @type {boolean} 
     * @memberof GuiManager 
     */
    private updateIn3D: boolean = true;

    /**
      * panle to display poreprties on mesh selection
      * @type {UI Panel} 
      * @memberof GuiManager 
      */
    private inspectorUi: any;

    /**
      * panel to display Scene active meshes
      * @type {UI Panel} 
      * @memberof GuiManager 
      */
    private heirarchyUi: any;

    /**
     * Used for creating and updating list in heiracrhy
     * @type {Array} 
     * @memberof GuiManager 
     */
    private SceneArray = [
        "Cube",
        "Cylinder",
        "IcoSphere"
    ];


    /**
     * Sub panels creted inside inspector panel 
     * @type {UI Panel} 
     * @memberof GuiManager 
     */
    private cubePanel: any;
    private cylinderPanel: any;
    private icospherePanel: any;
    private transformPanel: any;
    private animPanel: any;
    private infoPanel: any;
    private animResetButton: any;

    constructor(meshmanager: MeshManager) {

        var promise1 = this.loadUiJs()
        var promise2 = this.loadUiCss()
        Promise.all([promise1, promise2]).then((values) => {
            this.uiInstance = values[0]
            this.createUi();
        });

        this.animManager = new AnimationManager();
        this.meshmanager = meshmanager;

    }


    //#region UI File Loader

    /**
     * Promise Function load lite gui js file
     * @memberof GuiManager
     */
    private loadUiJs() {
        return new Promise((resolve, reject) => {
            var script = document.createElement("script");
            script.src = "/uijs/ui.js"; // lOAD SOUND LIB HOWLER.JS
            script.type = "text/javascript";
            script.onload = function () {
                resolve(UILib);
            };

            document.getElementsByTagName("head")[0].appendChild(script);
        });
    }
    /**
     * Promise Function load lite gui css file
     * @memberof GuiManager
     */
    private loadUiCss() {
        return new Promise((resolve, reject) => {
            var style = document.createElement("link");
            style.id = "ui"; // lOAD SOUND LIB HOWLER.JS
            style.href = "/uijs/ui.css"; // lOAD SOUND LIB HOWLER.JS
            style.type = "text/css";
            style.rel = "stylesheet";
            style.onload = function () {
                resolve("");
            };

            document.getElementsByTagName("head")[0].appendChild(style);
        });
    }
    //#endregion

    /**
    * Create Ui call internal fucntion to create scene heirarchy and inspector
    * @memberof GuiManager
    */
    createUi() {
        this.uiInstance.init();
        this.createHeirarchy();
        this.createInspector();
        this.createInfoPanel();
    }

    /**
    * Create panel to display instruction for use
    * @memberof GuiManager
    */
    createInfoPanel() {
        var heirarchy = new this.uiInstance.Dialog(null, { title: "Demo Details", close: false, minimize: false, width: "600", height: "140", scroll: false, resizable: false, draggable: false });
        heirarchy.show();
        heirarchy.root.style.left = screen.width / 2;
        heirarchy.root.style.top = null;
        heirarchy.root.style.bottom = 0
        heirarchy.root.style.opacity = 0.8
        var selection = new this.uiInstance.Inspector();

        var data = selection.addInfo("Select Edit :", "1. Click On Mesh to Pick or Select From Scene in Heirarchy Panel <br>" 
            + " 2. Adjust mesh transform and properties in inspector");

        var data = selection.addInfo("Animation :", "1. Animation will play on any selected node in heirarchy <br>" 
            + "2. Adjust animation properties and click on play<br>" + ""
            + "3. Before playing node bounce animation I have done reset camera view via animation<br>"
            + "4. On animation complete click on Back button to reset");
        this.animResetButton = selection.addButton(null, "Back", {
            height: 100,
            callback: () => {
                this.inspectorUi.root.style.display = "block";
                this.heirarchyUi.root.style.display = "block";
                this.meshmanager.ResetAllMesh();
                this.animResetButton.style.display = "none"
                this.animManager.stopBackButtonAnim();

            }
        })
        this.animResetButton.style.display = "none"
        heirarchy.add(selection);

    }
    /**
    * Create Scene heirarchy ui and selection events
    * @memberof GuiManager
    */
    createHeirarchy() {
        var heirarchy = new this.uiInstance.Dialog(null, { title: "Scene", close: false, minimize: false, width: "400", height: 0, scroll: false, resizable: false, draggable: false });
        heirarchy.show();
        heirarchy.root.style.left = "0px"
        // heirarchy.root.style.right = 0;
        heirarchy.root.style.left = null;
        heirarchy.root.style.top = "5px"
        heirarchy.root.style.opacity = 0.8

        var selection = new this.uiInstance.Inspector();
        this.sceneTree = selection.addList(null, this.SceneArray, {
            callback: (name: any) => {
                // console.log(name)
                this.meshmanager.selectMeshFromUi(name);
                this.updateUITransform(this.meshmanager.selectedNode);
                this.hideShowPanel()
            }
        })
        heirarchy.add(selection);

        this.heirarchyUi = selection;


    }

    /**
      * Create Inspector ui
      * Display transform and animation ui
      * @memberof GuiManager
      */
    createInspector() {

        var Inspector = new this.uiInstance.Dialog('Settings', { title: "Inspector", close: false, minimize: false, width: "400", height: 0, scroll: false, resizable: false, draggable: false });
        Inspector.show();
        // dialog.root.style.left = "0px"
        Inspector.root.style.right = 0;
        Inspector.root.style.left = null;
        Inspector.root.style.top = "5px"
        Inspector.root.style.opacity = 0.8
        this.inspectorUi = new this.uiInstance.Inspector();

        this.inspectorUi.startContainer();
        this.transformPanel = this.inspectorUi.addSection("Transforms");
        this.inspectorUi.addVector3("Position:", [1, 1, 1], {
            step: 0.1,
            min: 0.1,
            max: 20,
            callback: (value: any[]) => {
                if (this.updateIn3D)
                    this.meshmanager.update3DTransform({ position: value }, false)

                // this.selectedNode.position.set(parseFloat(value[0]), parseFloat(value[1]), parseFloat(value[2]));
                // console.log(this.currentInstance.meshManager.DirectionLight.position);

            }
        });
        this.inspectorUi.addVector3("Rotation:", [1, 1, 1], {
            step: 0.1,
            min: 0.1,
            max: 180,
            callback: (value: any[]) => {
                if (this.updateIn3D)
                    this.meshmanager.update3DTransform({ rotation: value }, false)
            }
        });
        this.inspectorUi.addVector3("Scaling:", [1, 1, 1], {
            step: 1,
            min: 0.1,
            max: 100,
            callback: (value: any[]) => {
                if (this.updateIn3D)
                    this.meshmanager.update3DTransform({ scaling: value }, false)
            }
        });
        // this.inspectorUi.getWidget("Rotation:").style.display = "none"
        this.inspectorUi.getWidget("Scaling:").style.display = "none"

        this.inspectorUi.endContainer();
        this.inspectorUi.addSeparator();

        this.inspectorUi.startContainer();
        this.cubePanel = this.inspectorUi.addSection("Cube");

        this.inspectorUi.addSlider("Width", 1, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateCubeMesh({ width: value })
            }
        });
        this.inspectorUi.addSlider("Height", 1, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateCubeMesh({ height: value })
            }
        });
        this.inspectorUi.addSlider("Depth", 1, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateCubeMesh({ depth: value })
            }
        });

        this.inspectorUi.endContainer();

        this.inspectorUi.startContainer();
        this.cylinderPanel = this.inspectorUi.addSection("Cylinder");

        this.inspectorUi.addSlider("Diameter", 1, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateCylinderMesh({ diameter: value })
            }
        });
        this.inspectorUi.addSlider("height", 2, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateCylinderMesh({ height: value })
            }
        });
        this.inspectorUi.endContainer();

        this.inspectorUi.startContainer();

        this.icospherePanel = this.inspectorUi.addSection("IcoSphere");

        this.inspectorUi.addSlider("Diameter", 2, {
            min: 0.1,
            max: 2,
            step: 0.1,
            callback: (value: any) => {
                this.meshmanager.updateIcoSphereMesh({ diameter: value })
            }
        });
        this.inspectorUi.addSlider("subdivisions", 4, {
            min: 1,
            max: 10,
            val: "number",
            step: 1,
            callback: (value: any) => {
                this.meshmanager.updateIcoSphereMesh({ subdivisions: value })
            }
        });
        this.inspectorUi.endContainer();


        this.inspectorUi.addSeparator();

        this.inspectorUi.startContainer();
        this.animPanel = this.inspectorUi.addSection("Animation");

        let amplitude = 2;
        this.inspectorUi.addSlider("amplitude", 2, {
            min: 2,
            max: 8,
            val: "number",
            step: 1,
            callback: (value: any) => {
                amplitude = value;
            }
        });

        let animDuration = 2000;
        this.inspectorUi.addSlider("duration (in ms)", 2000, {
            min: 2000,
            max: 10000,
            step: 100,
            val: "number",
            callback: (value: any) => {
                value = Math.floor(value);
                animDuration = value;

            }
        });
        this.inspectorUi.addButton(null, "Play", {
            selected: true,
            width: "100%",
            callback: () => {

                //hide ui when animation starts
                this.inspectorUi.root.style.display = "none";
                this.heirarchyUi.root.style.display = "none";
                // console.log(this.meshmanager.scene)
                this.meshmanager.disableAllNode();
                this.meshmanager.setEnableNodeForAnimation(amplitude);

                this.animManager.setCameraAnimPreview(this.meshmanager.scene.cameras[0], amplitude)
                    .then(() => {
                        this.animManager.applyBouncing(this.meshmanager.selectedNode, amplitude, animDuration)
                            .then(() => {
                                //show ui when animation completes
                                // this.inspectorUi.root.style.display = "block";
                                this.animManager.animateBackButton(this.animResetButton);
                                this.animResetButton.style.display = "block";
                            })
                    })
            }
        });

        this.inspectorUi.endContainer();
        this.cubePanel.style.display = "none"
        this.cylinderPanel.style.display = "none"
        this.icospherePanel.style.display = "none"
        this.transformPanel.style.display = "none"
        this.animPanel.style.display = "none"

        Inspector.add(this.inspectorUi);
    }

    /**
    * Update Mesh Selection On UI when mesh picked from 3D
    * @memberof GuiManager
    */
    UpdateMeshSelectionOnUI() {
        this.sceneTree.selectIndex(this.SceneArray.indexOf(this.meshmanager.selectedNode.name))
        this.updateUITransform(this.meshmanager.selectedNode);
        this.hideShowPanel();
    }

    /**
     * Hide show mesh inpsector panels as per mesh selection
     * @memberof GuiManager
     */
    hideShowPanel() {
        this.cubePanel.style.display = "none"
        this.cylinderPanel.style.display = "none"
        this.icospherePanel.style.display = "none"
        this.transformPanel.style.display = "block"
        this.animPanel.style.display = "block"
        if (this.meshmanager.selectedNode.name == "Cube")
            this.cubePanel.style.display = "block"
        else if (this.meshmanager.selectedNode.name == "Cylinder")
            this.cylinderPanel.style.display = "block"
        else if (this.meshmanager.selectedNode.name == "IcoSphere")
            this.icospherePanel.style.display = "block"

    }

    /**
    * Update mesh selection in heirarchy 
    * @memberof GuiManager
    */
    UpdateInspectorValues(name: string) {
        this.sceneTree.selectIndex(this.SceneArray.indexOf(name))
    }

    /**
    * Update mesh transform on ui
    * @memberof GuiManager
    */
    updateUITransform(mesh: any) {
        this.updateIn3D = false;
        this.inspectorUi.getWidget("Position:").setValue([mesh._position._x, mesh._position._y, mesh._position._z]);
        this.inspectorUi.getWidget("Rotation:").setValue([mesh._rotationQuaternion._x, mesh._rotationQuaternion._y, mesh._rotationQuaternion._z]);
        this.inspectorUi.getWidget("Scaling:").setValue([mesh._scaling._x, mesh._scaling._y, mesh._scaling._z]);
        this.inspectorUi.getWidget("amplitude").setValue(mesh._position.y);
        this.updateIn3D = true;
    }
}

