<template>
  <q-page
    id="app"
    class="flex flex-center bg-black"
  >
    <canvas id="screen"></canvas>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      style="animation-duration: 2s"
    >
      <div
        id="title"
        class="text-h2 text-center text-white absolute-center"
        v-show="showTitle"
      >
        Inclusive
        <wbr>
        Insights
      </div>
    </transition>
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
      :offset="[72, 0]"
    >
      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        style="animation-duration: 1s"
      >
        <q-card
          v-show="showMenu"
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
      </transition>
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
    const showTitle = ref(true);
    const showMenu = ref(false);

    const startup = async (dismiss) => {
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
        "scene.gltf",
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
          dismiss();
          gsap.delayedCall(1, () => {
            showTitle.value = false;
            gsap.delayedCall(1, () => {
              showMenu.value = true;
            });
          });
        },
        (xhr) => {
          const contentLength = 106404;
          const percent = (xhr.loaded / contentLength) * 100;
          dismiss({
            message: `Loading assets ${percent}%...`,
          });
        },
        (error) => {
          console.log("An error happened", error);
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
        const notif = $q.notify({
          message: "Loading assets 0%...",
          timeout: 0,
          color: "dark",
          textColor: "info",
          type: "ongoing",
        });
        const threeApi = await startup(notif);
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
      showTitle,
      showMenu,
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

#title
	text-transform: uppercase
	font-size: 7rem
	line-height: 8rem
	font-weight: 800
	text-shadow: 6px -5px #3E94E7, 5px -4px #3E94E7, 4px -5px #3E94E7, 4px -6px #3E94E7, 3px -4px #3E94E7,3px -5px #3E94E7, 2px -3px #3E94E7, 2px -4px #3E94E7,1px -2px #3E94E7, 1px -3px #3E94E7, 0 -1px #3E94E7,0 -2px #3E94E7, -1px 0 #3E94E7, -1px 2px #3E94E7, -2px 1px #3E94E7, -2px 3px #3E94E7, -3px 2px #3E94E7, -3px 4px #3E94E7, -4px 3px #3E94E7, -4px 5px #3E94E7, -5px 4px #3E94E7, -5px 6px #3E94E7, -6px 5px #3E94E7, -6px 7px #3E94E7, -7px 6px #3E94E7, -7px 8px #3E94E7, -8px 7px #3E94E7, -8px 9px #3E94E7, -9px 8px #3E94E7, -9px 10px #3E94E7, -10px 9px #3E94E7, -10px 11px #3E94E7, -11px 10px #3E94E7, -11px 12px #3E94E7, -12px 11px #3E94E7, -12px 13px #3E94E7, -13px 12px #3E94E7, -13px 14px #3E94E7, -14px 13px #3E94E7, -14px 15px #3E94E7, -15px 14px #3E94E7, -15px 16px #3E94E7, -16px 15px #3E94E7, -16px 17px #3E94E7, -17px 16px #3E94E7, -17px 18px #3E94E7, -18px 17px #3E94E7, -18px 19px #3E94E7, -19px 18px #3E94E7, -19px 20px #3E94E7, -20px 19px #3E94E7, -20px 21px #3E94E7, -21px 20px #3E94E7, -21px 22px #3E94E7, -22px 21px #3E94E7, -22px 23px #3E94E7, -23px 25px #3E94E7, -23px 24px #3E94E7, -24px 26px #3E94E7, -24px 25px #3E94E7, -25px 27px #3E94E7, -25px 26px #3E94E7, -26px 28px #3E94E7, -26px 27px #3E94E7, -27px 29px #3E94E7, -27px 28px #3E94E7, -28px 30px #3E94E7, -28px 29px #3E94E7, -29px 31px #3E94E7, -29px 30px #3E94E7, -30px 32px #3E94E7, -30px 31px #3E94E7,
</style>
