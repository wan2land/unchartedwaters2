<template>
  <div class="key"
       ref="key"
       @mousedown.prevent="$emit('gamepad-keydown', $event)"
       @mouseleave.prevent="$emit('gamepad-keyup', $event)"
       @mouseup.prevent="$emit('gamepad-keyup', $event)"
       @touchstart.prevent="$emit('gamepad-keydown', $event)"
       @touchmove.prevent="touchleave($event)"
       @touchend.prevent="$emit('gamepad-keyup', $event)"
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
  methods: {
    touchleave($event: TouchEvent) {
      const keyElement = this.$refs.key as Element;
      const touchedKeyElement = document.elementFromPoint($event.touches[0].clientX, $event.touches[0].clientY)
      if (keyElement !== touchedKeyElement) this.$emit('gamepad-keyup', $event);
    }
  }
})
</script>
