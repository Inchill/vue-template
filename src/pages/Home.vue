<template>
  <div>
    <hello></hello>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
	name: 'Home',
	components: {
    Hello: defineAsyncComponent({
      loader: () => import('components/Hello.vue')
    })
	}
})
</script>
