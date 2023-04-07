import { defineStore } from 'pinia'

export default defineStore('snackbar', {
  state: () => ({
    isOpen: false,
    type: null,
    text: null
  }),
  actions: {
    showMSG(type, text, timer = 3000) {
      this.isOpen = true
      this.type = type
      this.text = text

      const timeOutIndex = setTimeout(() => {
        this.isOpen = false
        this.type = null
        this.text = null
      }, timer)

      if (!this.isOpen) {
        clearTimeout(timeOutIndex)
      }
    }
  }
})
