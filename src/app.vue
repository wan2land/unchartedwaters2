<template>
  <div class="view" @touchstart.stop>
    <div class="game">
      <canvas ref="canvas"></canvas>
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

    <div class="version">v{{ version }}</div>
    <a class="github" href="https://github.com/wan2land/unchartedwater2" target="_blank">
      <svg version="1.1" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      <span>View on Github</span>
    </a>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { create } from 'nipplejs'

import Key from './components/key.vue'
import { createDos } from './dos/create-dos'
import { detectFileChange } from './fs/detect-file-change'
import { createIdbFileSystem } from './fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler, createKeyboardEvent, EventHandler } from './event'

const version = require('../package.json').version

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
  data() {
    return {
      message: null as string | null,
      enabledMOdalHelp: true,
      keydownHandlers: [] as EventHandler[],
      keyupHandlers: [] as EventHandler[],
    }
  },
  async mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    const controller = this.$refs.mobileController as HTMLElement

    const joystick = create({
      zone: controller,
    })

    blockAddEventListener(document, ['keydown', 'keyup', 'keypress'])

    const db = await createIdbFileSystem('water2', 1)
    const { fs, main } = await createDos(canvas)

    await fs.extract('/static/water2.zip')
    
    const saveFileBody = await db.load<Uint8Array>(SAVE_FILE_PATH)
    if (saveFileBody) {
      // Overwrite Save File
      ;(fs as any).fs.writeFile(SAVE_FILE_PATH, saveFileBody)
    }

    const ci = await main(['-c', 'KOEI.COM'])

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
      messageSt = setTimeout(() => {
        this.message = null
        messageSt = null
      }, 100)
    })
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
  },
  computed: {
    version() {
      return version
    },
  },
  methods: {
    onKeydown(e: KeyboardEvent) {
      this.keydown(e.code)
    },
    onKeyup(e: KeyboardEvent) {
      this.keyup(e.code)
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
