<template>
  <div>
    <hello></hello>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { getMessageList } from '@/api/request'

export default defineComponent({
	name: 'Home',
	components: {
    Hello: defineAsyncComponent({
      loader: () => import('components/Hello.vue')
    })
  },
  async setup () {
    try {
      const data = await getMessageList()
      console.log('data ===', data)
    } catch (e) {
      console.error(e)
    }
    return {
    }
  }
})
</script>
