<script>
import { mapWritableState } from 'pinia'
import useBackdropStore from '@/stores/backdrop'

export default {
  name: 'Backdrop',
  computed: {
    ...mapWritableState(useBackdropStore, ['isOpen', 'closeHandler'])
  },
  methods: {
    handleClick(event) {
      if (event.target.id === 'backdrop') {
        if (this.closeHandler) {
          this.closeHandler()
        }
        this.isOpen = false
      }
    }
  }
}
</script>

<template>
  <div
    id="backdrop"
    class="absolute top-0 left-0 h-full w-full bg-black bg-opacity-70 z-50"
    @click.prevent="handleClick"
  ></div>
</template>
