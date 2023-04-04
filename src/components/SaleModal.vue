<script>
import { mapState, mapWritableState } from 'pinia'
import { db, storage, Timestamp } from '@/includes/firebase'
import useBackdropStore from '@/stores/backdrop'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'SaleModal',
  props: ['loadData'],
  data() {
    return {
      client: '',
      revenue: 0,
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
    resetSaleForm() {
      this.client = ''
      this.revenue = 0
      this.date = new Date().toISOString().split('T')[0]
      this.receiptStorageName = null
      this.receiptURL = null
    },
    async handleSubmit({ target: form }) {
      if (form.checkValidity()) {
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
          this.loadData()
          this.isOpen = false
          this.isSaleModalOpen = false
        } catch (error) {
          console.log(error)
        }
      }
    },
    async handleReset() {
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
        this.handleReset()
      }
      this.isSaleModalOpen = false
    }
  },
  unmounted() {
    this.closeHandler = null
  }
}
</script>

<template>
  <div
    class="absolute left-0 right-0 mx-auto flex flex-col items-center gap-2 py-6 px-4 bg-white mt-16 rounded-md w-80 z-50"
  >
    <h2 class="self-start mb-2 text-xl">New Sale</h2>
    <form
      class="space-y-10 w-full"
      @submit.prevent="handleSubmit"
      @reset.prevent="handleReset"
      role="form"
      autocomplete="off"
    >
      <div class="relative flex flex-col">
        <input
          type="text"
          id="client"
          class="peer h-12 rounded-md border-2 border-gray-900 bg-transparent px-3 placeholder-transparent outline-none focus:border-red-500"
          placeholder="Client"
          required
          v-model="client"
        />
        <label
          for="client"
          class="absolute top-0 bottom-0 left-3 m-auto h-max -translate-y-6 bg-white p-1 text-xs text-gray-900 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Client
        </label>
      </div>
      <div class="relative flex flex-col">
        <input
          type="number"
          id="revenue"
          class="peer h-12 rounded-md border-2 border-gray-900 bg-transparent px-3 placeholder-transparent outline-none focus:border-red-500"
          placeholder="Revenue"
          required
          v-model.number="revenue"
        />
        <label
          for="revenue"
          class="absolute top-0 bottom-0 left-3 m-auto h-max -translate-y-6 bg-white p-1 text-xs text-gray-900 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Revenue
        </label>
      </div>
      <div class="relative flex flex-col">
        <input
          type="date"
          id="date"
          class="peer h-12 rounded-md border-2 border-gray-900 bg-transparent px-3 placeholder-transparent outline-none focus:border-red-500"
          required
          v-model="date"
        />
        <label
          for="date"
          class="absolute top-0 bottom-0 left-3 m-auto h-max -translate-y-6 bg-white p-1 text-xs text-gray-900 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
        >
          Date
        </label>
      </div>
      <div
        class="flex items-center justify-center min-h-max h-32 rounded-md bg-gray-300 text-gray-400 hover:bg-red-300 hover:text-gray-100"
        :class="{ 'bg-red-300': isDragOver }"
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
          class="relative hover:after:content-['X'] hover:after:cursor-pointer hover:after:font-bold hover:after:text-xl hover:after:flex hover:after:items-center hover:after:justify-center hover:after:text-gray-400 hover:after:absolute hover:after:m-auto hover:after:h-12 hover:after:w-12 hover:after:bg-slate-200 hover:after:top-0 hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:rounded-full"
          @click.prevent="deleteThumbnail()"
        >
          <img :src="receiptURL" alt="receipt" class="aspect-square max-h-32" />
        </div>
        <span v-else class="font-semibold" :class="{ 'text-gray-100': isDragOver }">
          Add Receipt
        </span>
      </div>
      <div class="flex flex-col gap-4">
        <input
          className="h-12 w-full rounded-md bg-red-500 text-sm font-medium tracking-wider text-white shadow-md outline-none disabled:opacity-75"
          type="submit"
          value="ADD"
        />
        <input
          className="h-12 w-full rounded-md text-sm font-medium tracking-wider text-black shadow-md outline-none disabled:opacity-75"
          type="reset"
          value="CANCEL"
        />
      </div>
    </form>
  </div>
</template>
