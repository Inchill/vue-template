<template>
  <div>
    <h1>hello, {{ msg }}</h1>
    <img src="../assets/Totoro.jpg"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup (props, context) {
    console.log(props, context)
    let msg = 'vue3 + ts + webpack5'
		return {
      msg
    }
	}
})
</script>

<style lang="stylus">
h1
  color orange
</style>
