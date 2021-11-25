var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
global.
var example;
(function (example) {
    // Away3Dライブラリを読み込み
    var View3D = away.containers.View3D;
    var TextureMaterial = away.materials.TextureMaterial;
    var PlaneGeometry = away.primitives.PlaneGeometry;
    var Mesh = away.entities.Mesh;
    var RequestAnimationFrame = away.utils.RequestAnimationFrame;
    var HoverController = away.controllers.HoverController;
    var ParticleAnimationSet = away.animators.ParticleAnimationSet;
    var ParticleAnimator = away.animators.ParticleAnimator;
    var ParticleBillboardNode = away.animators.ParticleBillboardNode;
    var ParticlePropertiesMode = away.animators.ParticlePropertiesMode;
    var ParticleVelocityNode = away.animators.ParticleVelocityNode;
    var ParticleColorNode = away.animators.ParticleColorNode;
    var ParticleFollowNode = away.animators.ParticleFollowNode;
    var ParticleGeometryHelper = away.tools.ParticleGeometryHelper;
    var ParticleGeometryTransform = away.tools.ParticleGeometryTransform;
    var Vector3D = away.geom.Vector3D;
    var ColorTransform = away.geom.ColorTransform;
    var ObjectContainer3D = away.containers.ObjectContainer3D;
    var BlendMode = away.display.BlendMode;
    var WireframePlane = away.primitives.WireframePlane;
    var AssetLibrary = away.library.AssetLibrary;
    var RESOURCE_LIST = [
        "imgs/cloud_1.png",
        "imgs/cloud_2.png",
        "imgs/cloud_3.png",
        "imgs/cloud_4.png",
        "imgs/star.png"
    ];
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.call(this);
            this._loadedCount = 0;
            var touchManager = new utils.TouchManager();
            touchManager.enableTouch();
            touchManager.addListener(document.body);
            AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceCompelte, this);
            for (var i = 0; i < RESOURCE_LIST.length; i++) {
                away.library.AssetLibrary.load(new away.net.URLRequest(RESOURCE_LIST[i]));
            }
        }
        Main.prototype.onResourceCompelte = function (event) {
            this._loadedCount++;
            if (this._loadedCount < RESOURCE_LIST.length)
                return;
            this.onLoadImage();
        };
        Main.prototype.onLoadImage = function () {
            var _this = this;
            // Floor
            var floor = new WireframePlane(2000, 2000, 40, 40, 0x999999, 1, WireframePlane.ORIENTATION_XZ);
            floor.y = -450;
            this.scene.addChild(floor);
            // Particles
            this.initParticles();
            this.followTarget = new ObjectContainer3D();
            this.scene.addChild(this.followTarget);
            this.createParticle(this.followTarget, AssetLibrary.getAsset(RESOURCE_LIST[0]), 229, 102, 255); // スモーク風パーティクル
            this.createParticle(this.followTarget, AssetLibrary.getAsset(RESOURCE_LIST[1]), 102, 204, 255); // スモーク風パーティクル
            this.createParticle(this.followTarget, AssetLibrary.getAsset(RESOURCE_LIST[2]), 102, 153, 255); // スモーク風パーティクル
            this.createParticle(this.followTarget, AssetLibrary.getAsset(RESOURCE_LIST[3]), 178, 102, 255); // スモーク風パーティクル
            this.createParticle(this.followTarget, AssetLibrary.getAsset(RESOURCE_LIST[3]), 255, 102, 255); // スモーク風パーティクル
            // アニメーションさせるためにループイベントを指定します
            var raf = new RequestAnimationFrame(this.onEnterFrame, this);
            raf.start();
            // カメラコントローラーを用意します
            this.cameraController = new HoverController(this.camera, null, -80, 0, 1000, 0, 90);
            document.onmousedown = function (event) { return _this.onMouseDown(event); };
            document.onmouseup = function (event) { return _this.onMouseUp(event); };
            document.onmousemove = function (event) { return _this.onMouseMove(event); };
            window.onresize = function (event) { return _this.onResize(); };
            this.onResize();
            // 計測用
            this.stats = new Stats();
            document.body.appendChild(this.stats.domElement);
        };
        /**
         * Initialise the particles
         */
        Main.prototype.initParticles = function () {
            //setup the base geometry for one particle
            var plane = new PlaneGeometry(64, 64, 1, 1, false);
            //create the particle geometry
            var geometrySet = [];
            var setTransforms = new Array();
            var particleTransform;
            for (var i = 0; i < 500; i++) {
                geometrySet.push(plane);
                particleTransform = new ParticleGeometryTransform();
                setTransforms.push(particleTransform);
            }
            this.particleGeometry = ParticleGeometryHelper.generateGeometry(geometrySet, setTransforms);
        };
        /**
         * Initialiser function for particle properties
         */
        Main.prototype.initParticleProperties = function (properties) {
            properties.startTime = Math.random() * 4.1;
            properties.duration = 2 + 2 * Math.random(); // 継続時間
            // 移動量
            properties[ParticleVelocityNode.VELOCITY_VECTOR3D] = new Vector3D((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200 - 200);
        };
        /**
         * Create Particles
         * @param followTarget    追随させたいターゲット
         * @param bitmap    ビットマップオブジェクト
         */
        Main.prototype.createParticle = function (followTarget, bitmap, colorR, colorG, colorB) {
            // HTMLの<img>オブジェクトからテクスチャを作成
            //			var ts = new HTMLImageElementTexture(bitmap, false);
            var particleMaterial = new TextureMaterial(bitmap);
            particleMaterial.alphaBlending = true;
            particleMaterial.blendMode = BlendMode.ADD;
            //create the particle animation set
            var particleAnimationSet = new ParticleAnimationSet(true, true, true);
            colorR /= 255;
            colorG /= 255;
            colorB /= 255;
            //define the particle animations and init function
            particleAnimationSet.addAnimation(new ParticleBillboardNode());
            particleAnimationSet.addAnimation(new ParticleVelocityNode(ParticlePropertiesMode.LOCAL_STATIC));
            particleAnimationSet.addAnimation(new ParticleColorNode(ParticlePropertiesMode.GLOBAL, true, true, false, false, new ColorTransform(colorR, colorG, colorB, 1), new ColorTransform(colorR, colorG, colorB, 0.0)));
            particleAnimationSet.addAnimation(this.particleFollowNode = new ParticleFollowNode(true, false));
            particleAnimationSet.initParticleFunc = this.initParticleProperties;
            //create the particle meshes
            var particleMesh = new Mesh(this.particleGeometry, particleMaterial);
            this.scene.addChild(particleMesh);
            //create and start the particle animators
            var animator = new ParticleAnimator(particleAnimationSet);
            particleMesh.animator = animator;
            animator.start();
            this.particleFollowNode.getAnimationState(animator).followTarget = followTarget;
        };
        /** 毎フレーム時に実行されるループイベントです */
        Main.prototype.onEnterFrame = function (time) {
            this.stats.begin();
            // Update Particles
            var time = new Date().getTime();
            var rot = time / 3;
            var distance = (time * 0.25) % 2000 - 1000;
            // run circle
            this.followTarget.x = 300 * Math.cos(-rot * Math.PI / 180);
            this.followTarget.y = 300 * Math.sin(-rot * Math.PI / 180);
            this.followTarget.z = distance;
            this.render(); // レンダリング
            this.stats.end();
        };
        /** マウスを押したとき */
        Main.prototype.onMouseDown = function (event) {
            this.lastPanAngle = this.cameraController.panAngle;
            this.lastTiltAngle = this.cameraController.tiltAngle;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            this.isMouseDown = true;
        };
        /** マウスを離したとき */
        Main.prototype.onMouseUp = function (event) {
            this.isMouseDown = false;
        };
        /** マウスを動かした時 */
        Main.prototype.onMouseMove = function (event) {
            if (this.isMouseDown) {
                this.cameraController.panAngle = 0.3 * (event.clientX - this.lastMouseX) + this.lastPanAngle;
                this.cameraController.tiltAngle = 0.3 * (event.clientY - this.lastMouseY) + this.lastTiltAngle;
            }
        };
        Main.prototype.onResize = function () {
            // 実験的に解像度対応をしてみる
            var ratio = window.devicePixelRatio;
            this.width = window.innerWidth * ratio;
            this.height = window.innerHeight * ratio;
            this.render();
            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";
        };
        return Main;
    })(View3D);
    example.Main = Main;
})(example || (example = {}));
// ページが読み込まれてから実行します
window.onload = function () { return new example.Main(); };
