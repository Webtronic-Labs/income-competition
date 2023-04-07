<script>
import IconTrophySVG from '@/components/icons/IconTrophySVG.vue'

export default {
  name: 'WelcomeHeader',
  components: {
    IconTrophySVG
  }
}
</script>
<template>
  <header class="bg-rose-600 relative flex flex-col items-center justify-center gap-4 h-64">
    <div
      class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 absolute h-full w-72 rounded-b-3xl mb-20 rotate-12"
    ></div>
    <IconTrophySVG class="fill-rose-600 w-12 z-20" />
    <h1 class="text-gray-300 font-light leading-tight tracking-widest text-xl z-10">RANKING</h1>
  </header>
</template>
