<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import { db, storage, Timestamp } from '@/includes/firebase'
import useBackdropStore from '@/stores/backdrop'
import useSnackbarStore from '@/stores/snackbar'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import IconPaperClipSVG from './icons/IconPaperClipSVG.vue'

export default {
  name: 'SaleModal',
  props: ['loadData'],
  data() {
    return {
      client: '',
      revenue: null,
      date: new Date().toISOString().split('T')[0],
      receiptStorageName: null,
      receiptURL: null,
      isDragOver: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['id']),
    ...mapWritableState(useUserStore, ['totalSales', 'totalRevenue']),
    ...mapWritableState(useBackdropStore, ['isOpen', ['closeHandler']]),
    ...mapWritableState(useModalStore, ['isSaleModalOpen'])
  },
  methods: {
    ...mapActions(useSnackbarStore, ['showMSG']),
    resetSaleForm() {
      this.client = ''
      this.revenue = 0
      this.date = new Date().toISOString().split('T')[0]
      this.receiptStorageName = null
      this.receiptURL = null
    },
    async submitHandler($event) {
      if ($event.target.checkValidity()) {
        try {
          await db.collection(`users/${this.id}/sales`).add({
            client: this.client,
            revenue: this.revenue,
            date: Timestamp.fromDate(
              new Date(`${new Date().toISOString().split('T')[0]}T23:59:59`)
            ),
            receiptImg: {
              receiptStorageName: this.receiptStorageName,
              receiptURL: this.receiptURL
            }
          })
          await db
            .collection('users')
            .doc(this.id)
            .set(
              {
                totalSales: this.totalSales + 1,
                totalRevenue: this.totalRevenue + this.revenue
              },
              { merge: true }
            )
          this.resetSaleForm()
          this.showMSG('success', 'Sale successfully added!')
          this.loadData()
          this.isOpen = false
          this.isSaleModalOpen = false
        } catch (error) {
          console.log(error)
          this.showMSG('error', 'Something went wrong!')
        }
      }
    },
    async resetHandler() {
      if (this.receiptStorageName) {
        await this.deleteThumbnail()
      }
      this.resetSaleForm()
      this.isOpen = false
      this.isSaleModalOpen = false
    },
    async deleteThumbnail() {
      if (this.receiptStorageName) {
        const storageRef = storage.ref()
        const receiptsRef = storageRef.child(this.receiptStorageName)
        try {
          await receiptsRef.delete()
          this.receiptStorageName = null
          this.receiptURL = null
        } catch (error) {
          console.log(error)
        }
      }
    },
    upload(event) {
      this.isDragOver = false
      const files = [...event.dataTransfer.files]
      files.forEach((file) => {
        if (
          file.type !== 'image/png' &&
          file.type !== 'image/svg+xml' &&
          file.type !== 'image/jpeg'
        ) {
          return
        }
        this.receiptStorageName = `receipts/${new Date().getMilliseconds()}`
        const storageRef = storage.ref()
        const receiptsRef = storageRef.child(this.receiptStorageName)
        const task = receiptsRef.put(file)
        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(progress)
          },
          (error) => {
            console.log(error)
          },
          async () => {
            this.receiptURL = await task.snapshot.ref.getDownloadURL()
          }
        )
      })
    }
  },
  mounted() {
    this.isOpen = true
    this.closeHandler = () => {
      if (this.receiptStorageName) {
        this.resetHandler()
      }
      this.isSaleModalOpen = false
    }
  },
  unmounted() {
    this.closeHandler = null
  },
  components: { IconPaperClipSVG }
}
</script>

<template>
  <div
    class="bg-white absolute left-0 right-0 w-80 z-50 flex flex-col items-center gap-4 mx-auto mt-16 px-4 py-6 rounded-md text-gray-600"
  >
    <h2 class="self-start font-medium text-lg">New Sale</h2>
    <form
      class="space-y-10 w-full"
      @submit.prevent="submitHandler"
      @reset.prevent="resetHandler"
      role="form"
      autocomplete="off"
    >
      <div class="relative flex flex-col">
        <input
          class="peer bg-transparent h-12 px-3 rounded-md outline-none border-2 border-gray-300 placeholder-transparent focus:border-rose-600"
          id="client"
          placeholder="Client"
          required
          type="text"
          v-model="client"
        />
        <label
          for="client"
          class="bg-white absolute h-max top-0 bottom-0 left-3 m-auto text-xs -translate-y-6 p-1 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Client
        </label>
      </div>
      <div class="relative flex flex-col">
        <input
          class="peer bg-transparent h-12 px-3 rounded-md outline-none border-2 border-gray-300 placeholder-transparent focus:border-rose-600"
          id="revenue"
          placeholder="Revenue"
          required
          type="number"
          v-model.number="revenue"
        />
        <label
          for="revenue"
          class="bg-white absolute h-max top-0 bottom-0 left-3 m-auto text-xs -translate-y-6 p-1 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Revenue
        </label>
      </div>
      <div class="relative flex flex-col">
        <input
          class="peer bg-transparent h-12 px-3 rounded-md outline-none border-2 border-gray-300 placeholder-transparent focus:border-rose-600"
          id="date"
          required
          type="date"
          v-model="date"
        />
        <label
          for="date"
          class="bg-white absolute h-max top-0 bottom-0 left-3 m-auto text-xs -translate-y-6 p-1 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Date
        </label>
      </div>
      <div
        class="bg-gray-200 min-h-max h-32 flex items-center justify-center rounded-md text-gray-400 hover:bg-rose-300 hover:text-gray-100"
        :class="{ 'bg-rose-300': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <div
          v-if="receiptURL"
          class="relative hover:after:content-['X'] hover:after:cursor-pointer hover:after:font-bold hover:after:text-xl hover:after:flex hover:after:items-center hover:after:justify-center hover:after:text-gray-100 hover:after:absolute hover:after:m-auto hover:after:h-12 hover:after:w-12 hover:after:bg-rose-300 hover:after:top-0 hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:rounded-full"
          @click.prevent="deleteThumbnail()"
        >
          <img :src="receiptURL" alt="receipt" class="aspect-square max-h-32" />
        </div>
        <p v-else class="flex font-medium" :class="{ 'text-gray-100': isDragOver }">
          <IconPaperClipSVG class="-rotate-45" /><span>Add Receipt</span>
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <input
          class="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-gray-300 font-medium tracking-wider h-12 w-full rounded-md shadow-md disabled:bg-gradient-to-r disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 hover:bg-gradient-to-r hover:from-rose-600 hover:via-rose-700 hover:to-rose-800"
          type="submit"
          value="ADD"
        />
        <input
          class="font-medium tracking-wider h-12 w-full rounded-md shadow-md hover:bg-gray-100"
          type="reset"
          value="CANCEL"
        />
      </div>
    </form>
  </div>
</template>
