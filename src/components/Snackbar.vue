<script>
import { mapState, mapWritableState } from 'pinia'
import useBackdropStore from '@/stores/backdrop'
import useSnackbarStore from '@/stores/snackbar'
import IconCheckCircleSVG from '@/components/icons/IconCheckCircleSVG.vue'
import IconExclamationCircleSVG from '@/components/icons/IconExclamationCircleSVG.vue'
import IconInformationCircleSVG from '@/components/icons/IconInformationCircleSVG.vue'
import IconXCircleSVG from '@/components/icons/IconXCircleSVG.vue'

export default {
  name: 'Snackbar',
  components: {
    IconCheckCircleSVG,
    IconExclamationCircleSVG,
    IconInformationCircleSVG,
    IconXCircleSVG
  },
  computed: {
    ...mapState(useSnackbarStore, ['type', 'text']),
    ...mapWritableState(useBackdropStore, {
      isBackdropOpen: 'isOpen',
      closeHandler: 'closeHandler'
    }),
    ...mapWritableState(useSnackbarStore, { isSnackbarOpen: 'isOpen' })
  },
  mounted() {
    this.isBackdropOpen = true
    this.closeHandler = () => {
      this.isSnackbarOpen = false
    }
  },
  unmounted() {
    this.isBackdropOpen = false
  }
}
</script>

<template>
  <div
    class="bg-rose-600 absolute top-0 bottom-64 left-0 right-0 z-50 flex items-center gap-2 m-auto h-16 w-80 px-8 rounded-md shadow-lg"
  >
    <IconCheckCircleSVG v-if="type === 'success'" class="fill-green-300" />
    <IconExclamationCircleSVG v-if="type === 'danger'" class="fill-yellow-300" />
    <IconInformationCircleSVG v-if="type === 'information'" class="fill-blue-300" />
    <IconXCircleSVG v-if="type === 'error'" class="fill-red-300" />
    <p class="text-gray-300 font-medium text-sm">{{ text }}</p>
  </div>
</template>
