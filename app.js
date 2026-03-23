const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const instructions = document.getElementById("instructions");

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.0;
    const isSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-ar");
    
    if (!isSupported) {
        instructions.innerText = "Ваш браузер не поддерживает AR. Используйте Chrome на Android или специальный браузер на iOS.";
        return scene;
    }


    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
            referenceSpaceType: "local-floor"
        }
    });

    instructions.innerText = "Нажмите на кнопку AR в углу и наведите на QR-код";

    const featuresManager = xr.baseExperience.featuresManager;
    

    const imageTracking = featuresManager.enableFeature(BABYLON.WebXRFeaturesManager.JS_WEBXR_IMAGE_TRACKING, "latest", {
        images: [
            {
                src: "marker.png", 
                estimatedRealWorldWidth: 0.1 
            }
        ]
    });

    // Загрузка модели
    BABYLON.SceneLoader.ImportMesh("", "./", "model.glb", scene, function (meshes) {
        const wolf = meshes[0];
        wolf.setEnabled(false); 
        imageTracking.onTrackedImageUpdatedObservable.add((image) => {
            instructions.style.display = "none"; 
            wolf.setEnabled(true);
            
            // Позиционирование
            image.transformationMatrix.decompose(wolf.scaling, wolf.rotationQuaternion, wolf.position);
            
            if (scene.animationGroups.length > 0) {
                scene.animationGroups[0].play(true);
            }
        });
    });

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});

window.addEventListener("resize", () => engine.resize());