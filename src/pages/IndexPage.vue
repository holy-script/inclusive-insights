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
      <!-- <q-btn
        push
        class="shadow-10"
        color="primary"
        label="Next"
        @click="mover"
      /> -->
    </q-page-sticky>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        push
        class="shadow-10"
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
          class="shadow-10"
        >
          <q-splitter
            after-class="customScroll"
            v-model="splitterModel"
            style="height: 50vh"
          >

            <template v-slot:before>
              <q-tabs
                v-model="tab"
                vertical
                class="text-teal flex flex-center space-around justify-center"
              >
                <q-tab
                  name="home"
                  icon="home"
                  label="Home"
                />
                <q-tab
                  name="empathize"
                  icon="public"
                  label="Empathize"
                />
                <q-tab
                  name="about"
                  icon="info"
                  label="About Us"
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
                <q-tab-panel name="home">
                  <div class="text-h4 q-mb-md">Hello, Friend 👋</div>
                  <div class="text-h6">Welcome to Inclusive Insights!</div>
                  <br>
                  <p>
                    Our mission is to help reduce bias and discrimination in the workplace so women can thrive in their careers and their achievements can be celebrated.
                  </p>
                  <p>
                    Our tool provides guidance and insights on how to create more inclusive and equitable workplaces, recognize and address bias, and learn from the experiences of influential women who have revolutionized their industries. Whether you're an employer, employee, or simply interested in learning more about diversity and inclusion, Inclusive Insights has something for everyone.
                  </p>
                </q-tab-panel>

                <q-tab-panel name="empathize">
                  <div class="text-h4 q-mb-md">We Accept All 🤗</div>
                  <div class="text-h6">Understand And Be Understood</div>
                  <br>
                  <p>
                    Want to learn from the experiences of some of the most influential women in the industry?
                  </p>
                  <p>
                    Our Chat feature allows you to simulate conversations with historical or contemporary influential women who have revolutionized their industries. You can choose a scenario or input a scenario you are personally facing, and the chatbot will simulate a conversation in the style of the chosen influential woman.
                  </p>
                  <p>
                    Each conversation is narrated by a text-to-speech API, providing users with insights and guidance on how to overcome bias and discrimination in the workplace. You can choose from a range of influential women, including Ada Lovelace, Grace Hopper, and Ruth Bader Ginsburg, among others. Start a conversation today and learn from the best!
                  </p>
                </q-tab-panel>

                <q-tab-panel name="about">
                  <div class="text-h4 q-mb-md">About Us 💻</div>
                  <div class="text-h6">Why Make This?</div>
                  <br>
                  <p>
                    Inclusive Insights was created as part of the Avanade International Women's Day Hackathon, with the goal of developing innovative solutions to reduce bias and discrimination in the workplace.
                  </p>
                  <p>
                    Our team consists of passionate individuals with a diverse range of backgrounds and experiences, united by our shared commitment to creating more inclusive and equitable workplaces.
                  </p>
                  <p>
                    We believe that everyone deserves a fair and equal chance to succeed, regardless of their gender, race, age, or background, and we're committed to making that a reality through our work.
                  </p>
                </q-tab-panel>
              </q-tab-panels>
            </template>

          </q-splitter>

          <q-btn
            id="chatBtn"
            color="secondary"
            icon="chat"
            stack
            rounded
            push
            class="shadow-4"
            @click="chatter"
          >
            Chat Now
          </q-btn>
        </q-card>
      </transition>
    </q-page-sticky>
    <q-page-sticky
      position="left"
      :offset="[72, 0]"
    >
      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        style="animation-duration: 1s"
      >
        <q-card
          bordered
          v-show="showChat"
          id="chatCard"
          class="shadow-10 flex column justify-evenly"
        >
          <q-btn
            color="warning"
            label="Menu"
            @click="resumer"
            id="menuBtn"
          />
          <q-scroll-area
            id="chatBox"
            class="q-pa-md"
            ref="scrollArea"
            @scroll="monitorScroll"
          >
            <q-chat-message
              v-for="(msg, index) in chatsList"
              :key="index"
              :name="msg.byUser ? 'You' : 'ChatGPT Narrator'"
              :text="[msg.chat]"
              :sent="msg.byUser"
              :stamp="msg.time"
            >
            </q-chat-message>
          </q-scroll-area>
          <div
            id="chatInput"
            class="flex row justify-evenly items-center"
          >
            <q-form
              autofocus
              @submit.prevent.stop
              style="width: 90%"
            >
              <q-input
                rounded
                outlined
                label="Type Here..."
                v-model="chatQuery"
                :disable="loadingChat"
                maxlength="200"
              >
                <template v-slot:prepend>
                  <q-avatar>
                    <img :src="chatgptLogo">
                    <q-tooltip>
                      Powered by ChatGPT!
                    </q-tooltip>
                  </q-avatar>
                </template>
                <template v-slot:append>
                  <q-btn
                    color="secondary"
                    icon="send"
                    rounded
                    push
                    :disable="!chatQuery"
                    :loading="loadingChat"
                    class="shadow-4"
                    type="submit"
                    @click="sendChat"
                  />
                </template>
              </q-input>
            </q-form>
          </div>
        </q-card>
      </transition>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import WebGL from "three/examples/jsm/capabilities/WebGL";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useQuasar } from "quasar";
import { gsap } from "gsap";
import { api } from "boot/axios";

import chatgptLogo from "assets/chatgpt-logo.png";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const $q = useQuasar();
    let index = -1;
    const orientations = {
      menu: [
        {
          pos: { x: -8, y: 7, z: -26.5 },
          rot: { x: -6.123233995736766e-17, y: -2.600000000000001, z: 0 },
        },
        {
          pos: { x: 34, y: 7.5, z: -28.5 },
          rot: { x: -6.123233995736766e-17, y: -4.100000000000001, z: 0 },
        },
        {
          pos: { x: 46.5, y: 8, z: 18 },
          rot: { x: -6.123233995736766e-17, y: -5.999999999999995, z: 0 },
        },
        {
          pos: { x: 11.5, y: 7.5, z: 5.5 },
          rot: { x: -6.123233995736766e-17, y: -6.5999999999999925, z: 0 },
        },
      ],
      chat: [
        {
          pos: { x: 29.5, y: 8, z: -25.5 },
          rot: { x: -6.123233995736766e-17, y: -2, z: 0 },
        },
      ],
    };
    let arr = orientations.menu;
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const mover = ref();
    const fuller = ref();
    const chatter = ref();
    const resumer = ref();
    const isFullScreen = ref(false);
    const showTitle = ref(true);
    const showMenu = ref(false);
    const showChat = ref(false);
    const timeline = gsap.timeline();
    const chatQuery = ref("");
    const womenList = [
      "Justice Ruth Bader Ginsburg",
      "Grace Hopper",
      "Marissa Mayer",
    ];
    const chatsList = ref([]);
    const loadingChat = ref(false);
    const scrollArea = ref(null);
    const scrollerHeight = ref(0);

    const getTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    };

    const sendChat = async () => {
      const chat = chatQuery.value;
      loadingChat.value = true;
      chatQuery.value = "";

      chatsList.value.push({
        chat,
        byUser: true,
        time: getTime(new Date()),
      });

      const { data } = await api.post("/detect", {
        chat,
      });

      chatsList.value.push({
        chat: data,
        byUser: false,
        time: getTime(new Date()),
      });

      loadingChat.value = false;
      setTimeout(() => {}, 3000);
    };

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

      // window.addEventListener("keyup", (e) => {
      //   if (e.key === "z") {
      //     const pos = camera.position;
      //     const rot = camera.rotation;
      //     arr.push({
      //       pos: {
      //         x: pos.x,
      //         y: pos.y,
      //         z: pos.z,
      //       },
      //       rot: {
      //         x: rot.x,
      //         y: rot.y,
      //         z: rot.z,
      //       },
      //     });
      //     console.log(arr);
      //     localStorage.setItem("config", JSON.stringify(arr));
      //   }
      //   if (e.key === "v") {
      //     arr.splice(0, arr.length);
      //     localStorage.removeItem("config");
      //   }
      // });

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

      const moveCam = async (alt) => {
        index++;

        if (index > arr.length - 1) {
          index = 0;
        }

        const duration = alt == undefined ? 10 : 1;

        const positioning = gsap.to(camera.position, {
          x: arr[index].pos.x,
          y: arr[index].pos.y,
          z: arr[index].pos.z,
          duration,
          ease: "linear",
          immediateRender: false,
        });
        const rotating = gsap.to(camera.rotation, {
          x: arr[index].rot.x,
          y: arr[index].rot.y,
          z: arr[index].rot.z,
          duration,
          ease: "linear",
          immediateRender: false,
        });

        timeline
          .add(positioning, 0)
          .add(rotating, 0)
          .play(0)
          .eventCallback("onComplete", () => {
            timeline.pause().remove(positioning).remove(rotating);
            if (!showChat.value) moveCam();
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

      const goChat = async () => {
        timeline.pause().kill();
        for (let child of timeline.getChildren()) {
          child.kill();
        }
        arr = orientations.chat;
        showMenu.value = false;
        showChat.value = true;
        moveCam(0);
      };

      const goMenu = async () => {
        showMenu.value = true;
        showChat.value = false;
        arr = orientations.menu;
        moveCam(index);
      };

      return { moveCam, goFullScreen, goChat, goMenu };
    };

    onMounted(async () => {
      console.log((await api.get("")).data);
      if (WebGL.isWebGLAvailable()) {
        const notif = $q.notify({
          message: "Loading assets 0%...",
          timeout: 0,
          color: "dark",
          textColor: "info",
          type: "ongoing",
        });
        const threeApi = await startup(notif);
        const { moveCam, goFullScreen, goChat, goMenu } = threeApi;
        mover.value = moveCam;
        fuller.value = goFullScreen;
        chatter.value = goChat;
        resumer.value = goMenu;
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

    const monitorScroll = (info) => {
      scrollerHeight.value = info.verticalSize;
    };

    watch(scrollerHeight, (val) => {
      scrollArea.value.setScrollPosition("vertical", val);
    });

    return {
      mover,
      fuller,
      chatter,
      resumer,
      isFullScreen,
      tab: ref("home"),
      splitterModel: ref(20), //add shadows, bruh
      showTitle,
      showMenu,
      showChat,
      chatQuery,
      chatgptLogo,
      sendChat,
      loadingChat,
      chatsList,
      scrollArea,
      scrollerHeight,
      monitorScroll,
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
	position: relative
	width: 50vw

#title
	text-transform: uppercase
	font-size: 7rem
	line-height: 8rem
	font-weight: 800
	text-shadow: 6px -5px #3E94E7, 5px -4px #3E94E7, 4px -5px #3E94E7, 4px -6px #3E94E7, 3px -4px #3E94E7,3px -5px #3E94E7, 2px -3px #3E94E7, 2px -4px #3E94E7,1px -2px #3E94E7, 1px -3px #3E94E7, 0 -1px #3E94E7,0 -2px #3E94E7, -1px 0 #3E94E7, -1px 2px #3E94E7, -2px 1px #3E94E7, -2px 3px #3E94E7, -3px 2px #3E94E7, -3px 4px #3E94E7, -4px 3px #3E94E7, -4px 5px #3E94E7, -5px 4px #3E94E7, -5px 6px #3E94E7, -6px 5px #3E94E7, -6px 7px #3E94E7, -7px 6px #3E94E7, -7px 8px #3E94E7, -8px 7px #3E94E7, -8px 9px #3E94E7, -9px 8px #3E94E7, -9px 10px #3E94E7, -10px 9px #3E94E7, -10px 11px #3E94E7, -11px 10px #3E94E7, -11px 12px #3E94E7, -12px 11px #3E94E7, -12px 13px #3E94E7, -13px 12px #3E94E7, -13px 14px #3E94E7, -14px 13px #3E94E7, -14px 15px #3E94E7, -15px 14px #3E94E7, -15px 16px #3E94E7, -16px 15px #3E94E7, -16px 17px #3E94E7, -17px 16px #3E94E7, -17px 18px #3E94E7, -18px 17px #3E94E7, -18px 19px #3E94E7, -19px 18px #3E94E7, -19px 20px #3E94E7, -20px 19px #3E94E7, -20px 21px #3E94E7, -21px 20px #3E94E7, -21px 22px #3E94E7, -22px 21px #3E94E7, -22px 23px #3E94E7, -23px 25px #3E94E7, -23px 24px #3E94E7, -24px 26px #3E94E7, -24px 25px #3E94E7, -25px 27px #3E94E7, -25px 26px #3E94E7, -26px 28px #3E94E7, -26px 27px #3E94E7, -27px 29px #3E94E7, -27px 28px #3E94E7, -28px 30px #3E94E7, -28px 29px #3E94E7, -29px 31px #3E94E7, -29px 30px #3E94E7, -30px 32px #3E94E7, -30px 31px #3E94E7,

#chatBtn
	position: absolute
	top: 2rem
	right: 3rem

.customScroll::-webkit-scrollbar-track

	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
	background-color: #F5F5F5

.customScroll::-webkit-scrollbar

	width: 10px
	background-color: #F5F5F5

.customScroll::-webkit-scrollbar-thumb

	background-color: #F90
	background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)
	border-radius: 14px

.navBar
	background-color: #3E94E7

#chatCard
	width: 40vw
	height: 60vh
	position: relative

#menuBtn
	position: absolute
	top: -3rem
	left: 0rem

#chatBox
	height: 80%
	background: #3E94E7
	border-radius: 7px 7px 0 0
	box-shadow: 0 -7px 9px -7px rgb(0 0 0 / 70%) inset

#chatInput
	height: 20%
	width: 100%
	border-radius: 0 0 7px 7px
</style>
