<template>
  <div class="key" @click="$emit('click', $event)">
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
})
</script>
