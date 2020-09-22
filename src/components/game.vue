<template>
  <div>
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

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { create } from 'nipplejs'

import Key from './components/key.vue'
import { createDos } from '../dos/create-dos'
import { detectFileChange } from '../fs/detect-file-change'
import { createIdbFileSystem } from '../fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler, createKeyboardEvent, EventHandler } from '../event'

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
