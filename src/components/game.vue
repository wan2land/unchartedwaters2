<template>
  <div class="game">
    <div class="tools">
      <a class="tool-item tool-fullscreen icon" @click="toggleFullScreen">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M118.916,46.417c1.057,1.055 2.305,1.584 3.75,1.584c0.666,0 1.362,-0.139 2.083,-0.417c2.168,-0.944 3.251,-2.584 3.251,-4.917l0,-37.333c0,-1.444 -0.528,-2.694 -1.585,-3.749c-1.053,-1.056 -2.305,-1.584 -3.749,-1.584l-37.333,0c-2.333,0 -3.972,1.111 -4.918,3.333c-0.943,2.167 -0.555,4.084 1.168,5.75l11.999,11.999l-29.582,29.583l-29.583,-29.584l12,-11.999c1.722,-1.666 2.111,-3.583 1.167,-5.749c-0.945,-2.223 -2.584,-3.334 -4.917,-3.334l-37.333,0c-1.445,0 -2.695,0.528 -3.751,1.584c-1.055,1.055 -1.583,2.305 -1.583,3.749l0,37.333c0,2.334 1.112,3.973 3.333,4.917c0.667,0.277 1.334,0.417 2.001,0.417c1.444,0 2.694,-0.528 3.75,-1.584l11.999,-11.998l29.583,29.582l-29.583,29.582l-11.999,-12c-1.667,-1.723 -3.583,-2.111 -5.751,-1.168c-2.222,0.946 -3.333,2.585 -3.333,4.919l0,37.333c0,1.444 0.528,2.694 1.583,3.75c1.057,1.055 2.307,1.582 3.751,1.582l37.333,0c2.334,0 3.972,-1.111 4.917,-3.332c0.944,-2.168 0.555,-4.083 -1.167,-5.752l-12,-11.997l29.583,-29.585l29.582,29.585l-12,11.999c-1.722,1.666 -2.11,3.584 -1.166,5.75c0.944,2.223 2.584,3.334 4.918,3.334l37.333,0c1.444,0 2.694,-0.529 3.75,-1.585c1.054,-1.054 1.582,-2.305 1.582,-3.749l0,-37.333c0,-2.333 -1.083,-3.973 -3.251,-4.918c-2.277,-0.943 -4.221,-0.556 -5.833,1.169l-11.998,11.997l-29.584,-29.581l29.584,-29.583l11.999,12Z" />
        </svg>
      </a>
      <!-- <a class="tool-item tool-save icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M126.333,35.332c-1.111,-2.665 -2.445,-4.777 -4.001,-6.332l-23.333,-23.334c-1.555,-1.554 -3.666,-2.888 -6.333,-4c-2.665,-1.111 -5.11,-1.666 -7.332,-1.666l-77.334,0c-2.221,0 -4.111,0.777 -5.666,2.333c-1.556,1.555 -2.333,3.444 -2.333,5.667l0,112c0,2.224 0.777,4.113 2.333,5.668c1.555,1.554 3.445,2.332 5.666,2.332l112.001,0c2.223,0 4.112,-0.778 5.667,-2.332c1.554,-1.555 2.331,-3.444 2.331,-5.668l0,-77.333c0,-2.223 -0.555,-4.667 -1.666,-7.335Zm-72.999,-22c0,-0.722 0.264,-1.346 0.792,-1.874c0.528,-0.527 1.153,-0.791 1.875,-0.791l16.001,0c0.72,0 1.345,0.263 1.873,0.791c0.529,0.528 0.793,1.152 0.793,1.874l0,26.667c0,0.724 -0.266,1.348 -0.793,1.876c-0.528,0.526 -1.153,0.791 -1.873,0.791l-16.001,0c-0.722,0 -1.348,-0.264 -1.875,-0.791c-0.528,-0.529 -0.792,-1.152 -0.792,-1.876l0,-26.667Zm42.668,104.002l-64.002,0l0,-32.001l64.002,0l0,32.001Zm21.334,0l-10.67,0l0,-34.668c0,-2.223 -0.778,-4.111 -2.333,-5.667c-1.555,-1.555 -3.444,-2.333 -5.665,-2.333l-69.334,0c-2.223,0 -4.112,0.778 -5.668,2.333c-1.555,1.555 -2.333,3.444 -2.333,5.667l0,34.668l-10.666,0l0,-106.668l10.666,0l0,34.667c0,2.223 0.777,4.111 2.333,5.667c1.556,1.555 3.445,2.333 5.667,2.333l48.002,0c2.221,0 4.112,-0.778 5.666,-2.333c1.554,-1.555 2.333,-3.444 2.333,-5.667l0,-34.667c0.833,0 1.915,0.277 3.25,0.833c1.335,0.555 2.279,1.11 2.834,1.666l23.418,23.417c0.556,0.556 1.111,1.515 1.666,2.876c0.558,1.361 0.834,2.431 0.834,3.209l0,74.667Z" />
        </svg>
      </a>
      <a class="tool-item tool-load icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M126.994,66.077c-0.982,-2.056 -2.482,-3.632 -4.491,-4.726c-2.012,-1.095 -4.224,-1.642 -6.638,-1.642l-12.874,0l0,-10.729c0,-4.112 -1.476,-7.644 -4.426,-10.594c-2.951,-2.951 -6.482,-4.425 -10.594,-4.425l-36.476,0l0,-2.146c0,-4.112 -1.475,-7.644 -4.425,-10.593c-2.95,-2.951 -6.482,-4.426 -10.594,-4.426l-21.457,0c-4.112,0 -7.644,1.475 -10.594,4.426c-2.95,2.949 -4.425,6.481 -4.425,10.593l0,64.37c0,4.112 1.475,7.643 4.425,10.593c2.95,2.951 6.482,4.426 10.594,4.426l72.954,0c2.993,0 6.122,-0.771 9.387,-2.314c3.263,-1.541 5.854,-3.498 7.776,-5.867l19.781,-24.339c2.056,-2.592 3.083,-5.273 3.083,-8.046c0.001,-1.61 -0.334,-3.128 -1.006,-4.561Zm-118.411,-34.261c0,-1.787 0.625,-3.307 1.877,-4.559c1.251,-1.251 2.771,-1.877 4.56,-1.877l21.457,0c1.788,0 3.307,0.625 4.559,1.877c1.251,1.252 1.877,2.772 1.877,4.559l0,4.292c0,1.788 0.627,3.308 1.878,4.559c1.251,1.251 2.771,1.878 4.559,1.878l38.621,0c1.788,0 3.309,0.626 4.561,1.877c1.25,1.251 1.876,2.771 1.876,4.559l0,10.729l-51.495,0c-3.039,0 -6.169,0.771 -9.388,2.313c-3.218,1.542 -5.811,3.498 -7.778,5.868l-17.164,21.12l0,-57.195Zm109.628,41.438l-19.713,24.339c-1.116,1.386 -2.704,2.57 -4.761,3.552c-2.056,0.984 -3.978,1.476 -5.766,1.476l-72.952,0c-2.369,0 -3.553,-0.783 -3.553,-2.347c0,-0.715 0.402,-1.609 1.207,-2.683l19.713,-24.339c1.162,-1.386 2.759,-2.559 4.794,-3.52c2.033,-0.961 3.944,-1.442 5.733,-1.442l72.952,0c2.369,0 3.553,0.783 3.553,2.347c0,0.762 -0.401,1.633 -1.207,2.617Z" />
        </svg>
      </a>
      <a class="tool-item tool-mute-off icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M64,88.613c6.77,0 12.563,-2.41 17.384,-7.228c4.819,-4.819 7.229,-10.616 7.229,-17.385l0,-39.384c0,-6.77 -2.408,-12.564 -7.229,-17.385c-4.821,-4.819 -10.614,-7.231 -17.384,-7.231c-6.77,0 -12.564,2.412 -17.385,7.231c-4.821,4.82 -7.231,10.615 -7.231,17.385l0,39.384c0,6.769 2.411,12.566 7.231,17.385c4.82,4.818 10.615,7.228 17.385,7.228Z" />
          <path d="M106.844,50.692c-0.971,-0.974 -2.128,-1.462 -3.461,-1.462c-1.332,0 -2.486,0.488 -3.461,1.462c-0.974,0.975 -1.461,2.128 -1.461,3.461l0,9.847c0,9.487 -3.373,17.602 -10.116,24.346c-6.742,6.743 -14.858,10.115 -24.346,10.115c-9.487,0 -17.602,-3.372 -24.346,-10.115c-6.743,-6.742 -10.115,-14.858 -10.115,-24.346l0,-9.847c0,-1.333 -0.487,-2.486 -1.461,-3.461c-0.975,-0.974 -2.127,-1.462 -3.461,-1.462c-1.335,0 -2.489,0.488 -3.463,1.462c-0.974,0.975 -1.462,2.128 -1.462,3.461l0,9.847c0,11.333 3.783,21.193 11.347,29.576c7.563,8.384 16.909,13.192 28.038,14.422l0,10.154l-19.692,0c-1.333,0 -2.487,0.488 -3.461,1.463c-0.975,0.974 -1.462,2.128 -1.462,3.461c0,1.331 0.487,2.488 1.462,3.462c0.974,0.973 2.128,1.462 3.461,1.462l49.229,0c1.333,0 2.489,-0.488 3.462,-1.462c0.975,-0.974 1.463,-2.13 1.463,-3.462c0,-1.333 -0.488,-2.487 -1.463,-3.461c-0.973,-0.975 -2.128,-1.463 -3.462,-1.463l-19.689,0l0,-10.154c11.127,-1.23 20.472,-6.038 28.036,-14.422c7.565,-8.383 11.349,-18.243 11.349,-29.576l0,-9.847c0,-1.332 -0.489,-2.485 -1.465,-3.461Z" />
        </svg>
      </a>
      <a class="tool-item tool-mute-on icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M30.693,72.691c-0.769,-3.077 -1.154,-5.974 -1.154,-8.692l0,-9.847c0,-1.333 -0.487,-2.487 -1.461,-3.461c-0.975,-0.975 -2.128,-1.462 -3.461,-1.462c-1.335,0 -2.489,0.488 -3.463,1.462c-0.974,0.974 -1.462,2.128 -1.462,3.461l0,9.846c0,5.693 1.078,11.18 3.231,16.464l7.77,-7.771Z" />
          <path d="M64,88.612c6.769,0 12.565,-2.41 17.383,-7.229c4.82,-4.818 7.231,-10.615 7.231,-17.384l0,-9.847l27.769,-27.768c0.512,-0.513 0.768,-1.103 0.768,-1.769c0,-0.667 -0.256,-1.257 -0.768,-1.769l-6.307,-6.308c-0.514,-0.514 -1.104,-0.77 -1.77,-0.77c-0.666,0 -1.256,0.256 -1.768,0.77l-94.921,94.921c-0.513,0.513 -0.769,1.103 -0.769,1.768c0,0.668 0.256,1.258 0.769,1.77l6.307,6.308c0.513,0.513 1.103,0.768 1.769,0.768c0.667,0 1.257,-0.255 1.77,-0.768l19.538,-19.538c5.64,3.488 11.666,5.565 18.076,6.231l0,10.154l-19.692,0c-1.333,0 -2.488,0.488 -3.461,1.463c-0.975,0.973 -1.463,2.128 -1.463,3.461c0,1.331 0.488,2.488 1.463,3.461c0.973,0.974 2.128,1.463 3.461,1.463l49.229,0c1.333,0 2.487,-0.489 3.461,-1.463c0.975,-0.973 1.462,-2.129 1.462,-3.461c0,-1.333 -0.487,-2.488 -1.462,-3.461c-0.974,-0.975 -2.128,-1.463 -3.461,-1.463l-19.692,0l0,-10.154c11.128,-1.23 20.473,-6.038 28.038,-14.421c7.563,-8.384 11.346,-18.243 11.346,-29.576l0,-9.849c0,-1.333 -0.488,-2.486 -1.461,-3.461c-0.976,-0.974 -2.129,-1.461 -3.462,-1.461c-1.333,0 -2.487,0.487 -3.462,1.461c-0.974,0.975 -1.461,2.128 -1.461,3.461l0,9.847c0,9.487 -3.373,17.602 -10.115,24.344c-6.743,6.743 -14.859,10.115 -24.346,10.115c-5.538,0 -10.794,-1.306 -15.769,-3.923l7.385,-7.382c2.771,0.974 5.565,1.459 8.385,1.459Z" />
          <path d="M78.192,4.539c-4.231,-3.025 -8.962,-4.539 -14.192,-4.539c-6.769,0 -12.565,2.412 -17.384,7.231c-4.82,4.82 -7.23,10.615 -7.23,17.385l0,39.383l47.767,-47.768c-1.744,-4.769 -4.73,-8.666 -8.961,-11.692Z" />
        </svg>
      </a> -->
    </div>
    <div
      class="screen"
      :style="{
        '--screen-width': `${width}px`,
        '--screen-height': `${height}px`,
      }"
      ref="screen"
    >
      <div class="canvas-container">
        <canvas ref="canvas"></canvas>
      </div>
      <!-- <div class="dosbox-container">
        <div class="canvas"></div>
      </div> -->
      <div class="event-blocker"></div>
    </div>
    <div class="controller">
      <div class="container">
        <div class="keyboard">
          <div class="col">
            <div class="line">
              <Key label="ESC" @click="keypress('Escape')" />
              <Key label="Q" description="Open<br />Menu 1" @click="keypress('KeyQ')" />
              <Key label="W" description="Open<br />Menu 2" @click="keypress('KeyW')" />
              <Key label="E" description="Open<br />Menu 3" @click="keypress('KeyE')" />
              <Key label="R" description="Open<br />Menu 4" @click="keypress('KeyR')" />
            </div>
            <div class="line">
              <Key label="1" @click="keypress('Digit1')" />
              <Key label="2" @click="keypress('Digit2')" />
              <Key label="3" @click="keypress('Digit3')" />
              <Key label="4" @click="keypress('Digit4')" />
              <Key label="5" @click="keypress('Digit5')" />
            </div>
            <div class="line">
              <Key label="6" @click="keypress('Digit6')" />
              <Key label="7" @click="keypress('Digit7')" />
              <Key label="8" @click="keypress('Digit8')" />
              <Key label="9" @click="keypress('Digit9')" />
              <Key label="0" @click="keypress('Digit0')" />
            </div>
          </div>
          <Key class="key-enter" label="Enter" @click="keypress('Enter')" />
        </div>
        <div class="joystick" ref="mobileController">
          <div class="label">Gesture<br />Zone</div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="message" v-if="message">{{ message }}</div>
    </transition>

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { create } from 'nipplejs'

import Key from '../components/key.vue'
import { createDos } from '../dos/create-dos'
import { detectFileChange } from '../fs/detect-file-change'
import { createIdbFileSystem } from '../fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler, createKeyboardEvent, EventHandler } from '../event'


const SAVE_FILE_PATH = 'KOUKAI2.DAT'

const KEY_MAPS: Record<string, number> = {
  // Original Keypad
  Digit0: 48,
  Digit1: 49,
  Digit2: 50,
  Digit3: 51,
  Digit4: 52,
  Digit5: 53,
  Digit6: 54,
  Digit7: 55,
  Digit8: 56,
  Digit9: 57,

  Numpad0: 96,
  Numpad1: 97,
  Numpad2: 98,
  Numpad3: 99,
  Numpad4: 100,
  Numpad5: 101,
  Numpad6: 102,
  Numpad7: 103,
  Numpad8: 104,
  Numpad9: 105,

  NumpadAdd: 107,
  NumpadSubtract: 109,
  NumpadMultiply: 106,
  NumpadDivide: 111,
  NumpadEqual: 198,
  NumpadEnter: 13,

  NumpadDecimal: 110,

  Enter: 13, // Enter
  Space: 32, // Space

  ArrowLeft: 100,
  ArrowUp: 104,
  ArrowRight: 102,
  ArrowDown: 98,

  Escape: 27, // Escape

  // Extend
  KeyQ: 107, // +
  KeyW: 109, // -
  KeyE: 106, // *
  KeyR: 111, // /

  // Special
  ArrowLeftDown: 97,
  ArrowRightDown: 99,
  ArrowLeftUp: 103,
  ArrowRightUp: 105,
}

const JOYSTICK_MAPS: Record<string, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export default Vue.extend({
  components: {
    Key,
  },
  props: {
    mod: {
      type: String,
    },
    entry: {
      type: String,
    },
  },
  data() {
    return {
      width: 640,
      height: 480,
      isClearExit: false,
      message: null as string | null,
      enabledMOdalHelp: true,
      keydownHandlers: [] as EventHandler[],
      keyupHandlers: [] as EventHandler[],
    }
  },
  async mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()

    const canvas = this.$refs.canvas as HTMLCanvasElement
    const controller = this.$refs.mobileController as HTMLElement

    const joystick = create({
      zone: controller,
    })

    blockAddEventListener(document, ['keydown', 'keyup', 'keypress'])

    const db = this.mod
      ? await createIdbFileSystem(this.mod, 1)
      : await createIdbFileSystem('water2', 1)
    const { fs, main } = await createDos(canvas)

    if (this.mod) {
      await fs.extract(`/static/${this.mod}.zip`)
    } else {
      await fs.extract('/static/water2.zip')
    }
    
    const saveFileBody = await db.load<Uint8Array>(SAVE_FILE_PATH)
    if (saveFileBody) {
      // Overwrite Save File
      ;(fs as any).fs.writeFile(SAVE_FILE_PATH, saveFileBody)
    }

    const ci = await main(['-c', this.entry ?? 'KOEI.COM'])

    this.keydownHandlers = getBlockedHandler(document, 'keydown')
    this.keyupHandlers = getBlockedHandler(document, 'keyup')

    restoreAddEventListener(document)

    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('keyup', this.onKeyup)

    let currentJoystickCode: string | null = null
    let isRunningJoystick = false
    const triggerEventStream = (code: string) => {
      this.keydown(code)
      setTimeout(() => {
        this.keyup(code)
        setTimeout(() => {
          if (isRunningJoystick && currentJoystickCode) {
            triggerEventStream(currentJoystickCode)
          }
        }, 60)
      }, 100)
    }
    joystick.on('move', (e, data) => {
      if (data.force > 0.3) {
        if (data.angle.degree >= 22.5 && data.angle.degree < 67.5) {
          currentJoystickCode = 'ArrowRightUp'
        } else if (data.angle.degree >= 67.5 && data.angle.degree < 112.5) {
          currentJoystickCode = 'ArrowUp'
        } else if (data.angle.degree >= 112.5 && data.angle.degree < 157.5) {
          currentJoystickCode = 'ArrowLeftUp'
        } else if (data.angle.degree >= 157.5 && data.angle.degree < 202.5) {
          currentJoystickCode = 'ArrowLeft'
        } else if (data.angle.degree >= 202.5 && data.angle.degree < 247.5) {
          currentJoystickCode = 'ArrowLeftDown'
        } else if (data.angle.degree >= 247.5 && data.angle.degree < 292.5) {
          currentJoystickCode = 'ArrowDown'
        } else if (data.angle.degree >= 292.5 && data.angle.degree < 337.5) {
          currentJoystickCode = 'ArrowRightDown'
        } else {
          currentJoystickCode = 'ArrowRight'
        }
        if (isRunningJoystick) {
          return
        }
        isRunningJoystick = true
        triggerEventStream(currentJoystickCode)
      }
    })
    joystick.on('end', (e, data) => {
      isRunningJoystick = false
      currentJoystickCode = null
    })

    let messageSt: any = null
    detectFileChange(fs, SAVE_FILE_PATH, async () => {
      db.save(SAVE_FILE_PATH, (fs as any).fs.readFile(SAVE_FILE_PATH))
      this.message = 'Save Success!'
      if (messageSt) {
        clearTimeout(messageSt)
      }
      this.isClearExit = true
      messageSt = setTimeout(() => {
        this.message = null
        messageSt = null
        setTimeout(() => {
          this.isClearExit = false
        }, 5000)
      }, 100)
    })
    window.addEventListener('beforeunload', this.onBeforeUnload)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
    window.removeEventListener('beforeunload', this.onBeforeUnload)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      const { width: screenWidth, height: screenHeight } = (this.$refs.screen as HTMLElement).getBoundingClientRect()
      console.log(screenWidth / 640, screenHeight/ 480)
      if (screenWidth / 640 > screenHeight / 480) {
        this.width = ~~(screenHeight * 640 / 480)
        this.height = screenHeight
      } else {
        this.width = screenWidth
        this.height = ~~(screenWidth * 480 / 640)
      }
    },
    onBeforeUnload(e: BeforeUnloadEvent) {
      if (this.isClearExit) {
        return
      }
      e.preventDefault()
      return e.returnValue = '페이지를 벗어나면 저장하지 않은 내용이 날아갈 수 있습니다.'
    },
    onKeydown(e: KeyboardEvent) {
      this.keydown(e.code)
    },
    onKeyup(e: KeyboardEvent) {
      this.keyup(e.code)
    },
    toggleFullScreen() {
      const doc = window.document
      if(!doc.fullscreenElement) {
        doc.documentElement.requestFullscreen()
      } else {
        doc.exitFullscreen()
      }
    },
    keypress(code: string) {
      this.keydown(code)
      setTimeout(() => this.keyup(code), 120)
    },
    keydown(code: string) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keydown', KEY_MAPS[code])
        this.keydownHandlers.forEach(handler => handler(event))
      }
    },
    keyup(code: string) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keyup', KEY_MAPS[code])
        this.keyupHandlers.forEach(handler => handler(event))
      }
    },
  },
})
</script>
