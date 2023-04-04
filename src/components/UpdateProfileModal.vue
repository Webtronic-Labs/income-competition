<script>
import { mapState, mapWritableState } from 'pinia'
import { storage, usersCollection } from '@/includes/firebase'
import useBackdropStore from '@/stores/backdrop'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'UpdateProfileModal',
  props: ['loadData'],
  data() {
    return {
      storageName: null,
      url: null,
      isDragOver: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['id', 'avatar']),
    ...mapWritableState(useBackdropStore, ['isOpen', ['closeHandler']]),
    ...mapWritableState(useModalStore, ['isUpdateProfileModalOpen'])
  },
  methods: {
    async deleteThumbnail(avatarStorageName) {
      const storageNameToDelete = avatarStorageName ?? this.storageName

      if (storageNameToDelete) {
        const storageRef = storage.ref()
        const profilesRef = storageRef.child(storageNameToDelete)
        try {
          await profilesRef.delete()
          this.storageName = null
          this.url = null
        } catch (error) {
          console.log(error)
        }
      }
    },
    async handleCancel() {
      if (this.storageName) {
        await this.deleteThumbnail()
      }

      this.isUpdateProfileModalOpen = false
      this.isOpen = false
    },
    async handleUpdate() {
      if (!this.storageName) {
        return
      }

      try {
        const avatarPrev = this.avatar
        await usersCollection.doc(this.id).set(
          {
            avatar: {
              storageName: this.storageName,
              url: this.url
            }
          },
          { merge: true }
        )

        if (avatarPrev.storageName) {
          await this.deleteThumbnail(avatarPrev.storageName)
        }

        this.isOpen = false
        this.isUpdateProfileModalOpen = false
        this.loadData()
      } catch (error) {
        console.log(error)
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

        this.storageName = `profiles/${new Date().getMilliseconds()}`
        const storageRef = storage.ref()
        const profilesRef = storageRef.child(this.storageName)
        const task = profilesRef.put(file)

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
            this.url = await task.snapshot.ref.getDownloadURL()
          }
        )
      })
    }
  },
  mounted() {
    this.isOpen = true
    this.closeHandler = () => {
      this.handleCancel()
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
    <div
      class="flex items-center justify-center min-h-max h-32 w-full rounded-md bg-gray-300 text-gray-400 hover:bg-red-300 hover:text-gray-100"
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
        v-if="url"
        class="relative hover:after:content-['X'] hover:after:cursor-pointer hover:after:font-bold hover:after:text-xl hover:after:flex hover:after:items-center hover:after:justify-center hover:after:text-gray-400 hover:after:absolute hover:after:m-auto hover:after:h-12 hover:after:w-12 hover:after:bg-slate-200 hover:after:top-0 hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:rounded-full"
        @click.prevent="deleteThumbnail()"
      >
        <img :src="url" alt="profile" class="aspect-square max-h-32" />
      </div>
      <span v-else class="font-semibold" :class="{ 'text-gray-100': isDragOver }">
        Add Profile Picture
      </span>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <button
        class="h-12 w-full bg-red-500 rounded-md text-sm font-medium tracking-wider text-white shadow-md outline-none disabled:opacity-75"
        @click.prevent="handleUpdate"
        :disabled="!storageName"
      >
        UPDATE
      </button>
      <button
        class="h-12 w-full rounded-md text-sm font-medium tracking-wider text-black shadow-md outline-none disabled:opacity-75"
        @click.prevent="handleCancel"
      >
        CANCEL
      </button>
    </div>
  </div>
</template>
