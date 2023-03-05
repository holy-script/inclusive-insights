<template>
  <q-page id="app">
    <canvas id="screen"></canvas>
    <q-page-sticky
      position="top-right"
      :offset="[18, 18]"
    >
      <q-btn
        color="primary"
        label="Next"
        @click="mover"
      />
    </q-page-sticky>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        color="primary"
        :icon="isFullScreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="fuller"
      />
    </q-page-sticky>
    <q-page-sticky
      position="right"
      :offset="[36, 0]"
    >
      <q-card
        id="navCard"
        bordered
      >
        <q-splitter
          v-model="splitterModel"
          style="height: 50vh"
        >

          <template v-slot:before>
            <q-tabs
              v-model="tab"
              vertical
              class="text-teal"
            >
              <q-tab
                name="mails"
                icon="mail"
                label="Mails"
              />
              <q-tab
                name="alarms"
                icon="alarm"
                label="Alarms"
              />
              <q-tab
                name="movies"
                icon="movie"
                label="Movies"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="mails">
                <div class="text-h4 q-mb-md">Mails</div>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              </q-tab-panel>

              <q-tab-panel name="alarms">
                <div class="text-h4 q-mb-md">Alarms</div>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              </q-tab-panel>

              <q-tab-panel name="movies">
                <div class="text-h4 q-mb-md">Movies</div>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>
      </q-card>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import WebGL from "three/examples/jsm/capabilities/WebGL";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useQuasar } from "quasar";
import { gsap } from "gsap";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const $q = useQuasar();
    let index = -1;
    const arr = JSON.parse(localStorage.getItem("config")) || [];
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const mover = ref();
    const fuller = ref();
    const isFullScreen = ref(false);

    const startup = async () => {
      /** @type {HTMLCanvasElement}*/
      const canvas = document.getElementById("screen");

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("black");
      const loader = new GLTFLoader();

      const camera = new THREE.PerspectiveCamera(
        45,
        sizes.width / sizes.height,
        1,
        1000
      );
      camera.position.set(0, 0, 1);
      scene.add(camera);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        logarithmicDepthBuffer: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.enabled = true;
      renderer.gammaOutput = true;

      const ambLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambLight);

      const light1 = new THREE.SpotLight("gray", 1);
      light1.position.set(50, 100, 10);
      light1.castShadow = true;
      light1.penumbra = 0.3;
      scene.add(light1);
      const light2 = new THREE.SpotLight("gray", 1);
      light2.position.set(-50, -50, 10);
      light2.castShadow = true;
      light2.penumbra = 0.3;
      scene.add(light2);

      loader.load(
        // resource URL
        "src/assets/museum/scene.gltf",
        // called when the resource is loaded
        (gltf) => {
          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
            }
          });
          gltf.scene.position.set(-200, 0, 0);
          gltf.scene.scale.set(1, 1, 1);
          window.addEventListener("keydown", (e) => {
            if (e.key === "w") {
              camera.position.z -= 0.5;
            }

            if (e.key === "s") {
              camera.position.z += 0.5;
            }

            if (e.key === "a") {
              camera.position.x -= 0.5;
            }

            if (e.key === "d") {
              camera.position.x += 0.5;
            }

            if (e.key === "ArrowLeft") {
              camera.rotation.y += 0.1;
            }

            if (e.key === "ArrowRight") {
              camera.rotation.y -= 0.1;
            }

            if (e.key === "ArrowUp") {
              camera.position.y += 0.5;
            }

            if (e.key === "ArrowDown") {
              camera.position.y -= 0.5;
            }
          });

          scene.add(gltf.scene);
        },
        // called while loading is progressing
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        (error) => {
          console.log("An error happened");
        }
      );

      const clock = new THREE.Clock();

      const tick = async () => {
        const elapsedTime = clock.getElapsedTime();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };

      window.addEventListener("keyup", (e) => {
        if (e.key === "z") {
          const pos = camera.position;
          const rot = camera.rotation;
          arr.push({
            pos: {
              x: pos.x,
              y: pos.y,
              z: pos.z,
            },
            rot: {
              x: rot.x,
              y: rot.y,
              z: rot.z,
            },
          });
          console.log(arr);
          localStorage.setItem("config", JSON.stringify(arr));
        }
        if (e.key === "v") {
          arr.splice(0, arr.length);
          localStorage.removeItem("config");
        }
      });

      window.addEventListener("resize", () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;

        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.enabled = true;
        renderer.gammaOutput = true;
      });

      tick();

      const moveCam = async () => {
        index++;
        if (index > arr.length - 1) {
          index = 0;
        }
        gsap.to(camera.position, {
          x: arr[index].pos.x,
          y: arr[index].pos.y,
          z: arr[index].pos.z,
          duration: 1,
          ease: "linear",
        });
        gsap.to(camera.rotation, {
          x: arr[index].rot.x,
          y: arr[index].rot.y,
          z: arr[index].rot.z,
          duration: 1,
          ease: "linear",
        });
      };

      const goFullScreen = async () => {
        isFullScreen.value = !isFullScreen.value;
        const app = document.getElementById("app");
        const fullScreenElement =
          document.fullscreenElement || document.webkitFullScreenElement;
        if (!fullScreenElement) {
          if (app.requestFullscreen) app.requestFullscreen();
          else if (app.webkitRequestFullScreen) app.webkitRequestFullScreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullScreen)
            document.webkitExitFullScreen();
        }
      };

      return { moveCam, goFullScreen };
    };

    onMounted(async () => {
      if (WebGL.isWebGLAvailable()) {
        const threeApi = await startup();
        const { moveCam, goFullScreen } = threeApi;
        mover.value = moveCam;
        fuller.value = goFullScreen;
        if (arr.length) mover.value();
      } else {
        const warning = WebGL.getWebGLErrorMessage();
        $q.notify({
          message: warning.innerHTML,
          html: true,
          timeout: 0,
          color: "dark",
          classes: ["errLink"],
        });
      }
    });

    return {
      mover,
      fuller,
      isFullScreen,
      tab: ref("mails"),
      splitterModel: ref(20), //add shadows, bruh
    };
  },
});
</script>

<style lang="sass">
.errLink
	a
		color: red !important
#screen
	position: fixed
	top: 0
	left: 0
	outline: none

#navCard
	width: 50vw
</style>
