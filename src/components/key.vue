<template>
  <div class="key" @click="$emit('click', $event)">
    <div class="label">{{ label }}</div>
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
    description: {
      type: String,
    },
  },
})
</script>
