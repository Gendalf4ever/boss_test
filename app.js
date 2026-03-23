const startButton = document.getElementById('startButton');

const start = async() => {
    startButton.style.display = "none";

    const mindarThree = new window.MINDAR.IMAGE.MindARBabylon({
        container: document.querySelector("#container"),
        imageTargetSrc: './marker.mind', 
    });

    const {engine, scene, camera} = await mindarThree.start();

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const anchor = mindarThree.addAnchor(0); 
    BABYLON.SceneLoader.ImportMesh("", "./", "model.glb", scene, (meshes) => {
        const root = meshes[0];
        root.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);    
        anchor.group.addChild(root);
        if (scene.animationGroups.length > 0) {
            scene.animationGroups[0].play(true);
        }
    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}

startButton.addEventListener('click', start);