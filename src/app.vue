<template>
  <div class="view" @touchstart.stop>
    <div class="game">
      <canvas ref="canvas"></canvas>
      <div class="event-blocker"></div>
    </div>
    <div class="controller is-desktop">
      <div class="keyboard">
        <div class="line">
          <div class="key" @click="keypress('Escape')">
            <div class="label">ESC</div>
          </div>
          <div class="key key-1" @click="keypress('Digit1')">
            <div class="label">1</div>
            <div class="description">Open<br />Menu 1</div>
          </div>
          <div class="key" @click="keypress('Digit2')">
            <div class="label">2</div>
            <div class="description">Open<br />Menu 2</div>
          </div>
          <div class="key" @click="keypress('Digit3')">
            <div class="label">3</div>
            <div class="description">Open<br />Menu 3</div>
          </div>
          <div class="key" @click="keypress('Digit4')">
            <div class="label">4</div>
            <div class="description">Open<br />Menu 4</div>
          </div>
        </div>
        <div class="line">
          <div class="key key-q" @click="keypress('KeyQ')">
            <div class="label">Q</div>
            <div class="description">Set<br />Dest.</div>
          </div>
          <div class="key key-up" @click="keypress('ArrowUp')">
            <div class="label">↑</div>
          </div>
        </div>
        <div class="line">
          <div class="key key-space" @click="keypress('Space')">
            <div class="label">Space</div>
          </div>
          <div class="key key-left" @click="keypress('ArrowLeft')">
            <div class="label">←</div>
          </div>
          <div class="key" @click="keypress('ArrowDown')">
            <div class="label">↓</div>
          </div>
          <div class="key" @click="keypress('ArrowRight')">
            <div class="label">→</div>
          </div>
        </div>
      </div>
    </div>
    <div class="controller is-mobile">
      <div class="keyboard">
        <div class="line">
          <div class="key" @click="keypress('Escape')">
            <div class="label">ESC</div>
          </div>
          <div class="key key-1" @click="keypress('Digit1')">
            <div class="label">1</div>
          </div>
          <div class="key" @click="keypress('Digit2')">
            <div class="label">2</div>
          </div>
          <div class="key" @click="keypress('Digit3')">
            <div class="label">3</div>
          </div>
          <div class="key" @click="keypress('Digit4')">
            <div class="label">4</div>
          </div>
        </div>
        <div class="line">
          <div class="key key-space" @click="keypress('Space')">
            <div class="label">Space</div>
          </div>
        </div>
      </div>
      <div class="joystick" ref="mobileController">
        <div class="label">Gesture<br />Zone</div>
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

import { createDos } from './dos/create-dos'
import { detectFileChange } from './fs/detect-file-change'
import { createIdbFileSystem } from './fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler, createKeyboardEvent } from './event'

const SAVE_FILE_PATH = 'KOUKAI2.DAT'

const KEY_MAPS: Record<string, number> = {
  Digit1: 111, // /
  Digit2: 106, // *
  Digit3: 109, // -
  Digit4: 107, // +

  Escape: 27, // Escape

  ArrowUp: 104, // RightDigit8
  ArrowDown: 98, // RightDigit2
  ArrowLeft: 100, // RightDigit4
  ArrowRight: 102, // RightDigit6

  KeyQ: 101, // RightDigit5
  Enter: 13, // Enter
  Space: 32, // Space
}

const JOYSTICK_MAPS: Record<string, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export default Vue.extend({
  data() {
    return {
      message: null,
      enabledMOdalHelp: true,
      keydownHandlers: [],
      keyupHandlers: [],
    }
  },
  async mounted() {
    const canvas = this.$refs.canvas

    const joystick = create({
      zone: this.$refs.mobileController,
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
          if (isRunningJoystick) {
            triggerEventStream(currentJoystickCode)
          }
        }, 80)
      }, 120)
    }
    joystick.on('move', (e, data) => {
      if (data.force > 0.3) {
        currentJoystickCode = JOYSTICK_MAPS[data.direction.angle]
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
  methods: {
    onKeydown(e) {
      this.keydown(e.code)
    },
    onKeyup(e) {
      this.keyup(e.code)
    },
    keypress(code) {
      this.keydown(code)
      setTimeout(() => this.keyup(code), 120)
    },
    keydown(code) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keydown', KEY_MAPS[code])
        this.keydownHandlers.forEach(handler => handler(event))
      }
    },
    keyup(code) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keyup', KEY_MAPS[code])
        this.keyupHandlers.forEach(handler => handler(event))
      }
    },
  },
})
</script>
