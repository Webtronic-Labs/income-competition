<script>
import IconSpinnerCSS from './icons/IconSpinnerCSS.vue'

export default {
  name: 'AuthFormButton',
  components: { IconSpinnerCSS },
  props: {
    content: String,
    isLoading: Boolean
  },
  emits: ['update:modelValue']
}
</script>
<template>
  <input
    v-if="!isLoading"
    class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 font-medium tracking-wider h-12 w-full rounded-md shadow-md mt-8 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:via-gray-600 disabled:to-gray-700 hover:bg-gradient-to-r hover:from-gray-600 hover:via-gray-700 hover:to-gray-800"
    type="submit"
    :value="content"
  />
  <div
    v-else
    class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center h-12 w-full mt-8 rounded-md shadow-md"
  >
    <IconSpinnerCSS />
  </div>
</template>
