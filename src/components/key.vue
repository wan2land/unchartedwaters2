<template>
  <div class="key"
       ref="key"
       :class="{ active: activated }"
       @mousedown.prevent="keydown($event)"
       @mouseleave.prevent="keyup($event)"
       @mouseup.prevent="keyup($event)"
       @touchstart.prevent="keydown($event)"
       @touchmove.prevent="touchleave($event)"
       @touchend.prevent="keyup($event)"
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
  data: () => ({
      activated: false,
  }),
  methods: {
    touchleave($event: TouchEvent) {
      const keyElement = this.$refs.key as Element;
      const touchedKeyElement = document.elementFromPoint($event.touches[0].clientX, $event.touches[0].clientY)
      if (keyElement !== touchedKeyElement) this.keyup($event);
    },
    keydown($event: Event) {
      this.activated = true;
      this.$emit('gamepad-keydown', $event);
    },
    keyup($event: Event) {
      this.activated = false;
      this.$emit('gamepad-keyup', $event);
    }
  }
})
</script>
<style scoped>

</style>