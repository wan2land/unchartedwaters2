<template>
  <div
    class="key"
    ref="key"
    :class="{ active: activated }"
    @touchstart.prevent="onTouchStart"
    @touchend.prevent="onTouchEnd"
    @mousedown.prevent="onMouseDown"
    @mouseleave.prevent="onMouseUp"
    @mouseup.prevent="onMouseUp"
  >
    <div class="label">
      <span v-html="label" />
      <template v-if="sublabel">
        <span class="or">or</span>
        <span>{{ sublabel }}</span>
      </template>
    </div>
    <div class="description" v-if="description" v-html="description"></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

function touchContainElem(touches: TouchList, elem: HTMLElement) {
  for (const { clientX, clientY } of touches as any as Touch[]) {
    const target = document.elementFromPoint(clientX, clientY)
    if (target === elem || elem.contains(target)) {
      return true
    }
  }
  return false
}

export default Vue.extend({
  props: {
    label: {
      type: String,
    },
    sublabel: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  data() {
    return {
      activated: 0, // 0 = none, 1 = touch event, 2 = mouse event
    }
  },
  mounted() {
    // for debug :-)
    // this.$on('keydown', (e: any) => console.log('down', e.eventType === 1 ? 'touch' : 'mouse'))
    // this.$on('keyup', (e: any) => console.log('up', e.eventType === 1 ? 'touch' : 'mouse'))
  },
  beforeDestroy() {
    if (this.activated === 1) {
      document.removeEventListener('touchmove', this.onTouchMove)
    }
  },
  methods: {
    onTouchStart() {
      if (this.activated) {
        return
      }
      this.activated = 1
      this.$emit('keydown', { eventType: 1 })

      document.addEventListener('touchmove', this.onTouchMove)
    },
    onTouchMove($event: TouchEvent) {
      if (!touchContainElem($event.touches, this.$refs.key as HTMLDivElement)) {
        this.onTouchEnd()
      }
    },
    onTouchEnd() {
      if (!this.activated) {
        return
      }
      this.activated = 0
      this.$emit('keyup', { eventType: 1 })

      document.removeEventListener('touchmove', this.onTouchMove)
    },
    onMouseDown() {
      if (this.activated) {
        return
      }
      this.activated = 2
      this.$emit('keydown', { eventType: 2 })
    },
    onMouseUp() {
      if (!this.activated) {
        return
      }
      this.activated = 0
      this.$emit('keyup', { eventType: 2 })
    },
  },
})
</script>
