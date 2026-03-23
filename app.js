const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function() {
    const scene = new BABYLON.Scene(engine);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const xr = await scene.createDefaultXRExpirienceAsync ({
        uiOptions: {
            sessionMode: "immersive-ar",
            referenceSpaceType: "local-floor"
        }
    })

    const featuresManager = xr.baseExpirience.featuresManager;

  const imageTracking = featuresManager.enableFeature(BABYLON.WebXRFeaturesManager.JS_WEBXR_IMAGE_TRACKING, "latest", {
        images: [
            {
                src: "marker.png", 
                estimatedRealWorldWidth: 0.1 // 10 см
            }
        ]
    });

const result = await BABYLON.SceneLoader.ImportMeshAsync("", "./", "model.glb", scene);
    const wolfModel = result.meshes[0];
    wolfModel.setEnabled(false); // Скрываем модель, пока маркер не найден

    // Обработка появления маркера
    imageTracking.onTrackedImageUpdatedObservable.add((image) => {
        wolfModel.setEnabled(true);
        
    
        image.transformationMatrix.decompose(wolfModel.scaling, wolfModel.rotationQuaternion, wolfModel.position);
        if (result.animationGroups.length > 0) {
            
            const dance = result.animationGroups.find(ag => ag.name.includes("dance")) || result.animationGroups[0];
            dance.play(true); // Цикличное воспроизведение
        }
    });

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});

window.addEventListener("resize", () => {
    engine.resize();
});