<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import useModalStore from '@/stores/modal'
import IconAvatarSVG from '@/components/icons/IconAvatarSVG.vue'
import IconPencilSVG from '@/components/icons/IconPencilSVG.vue'

export default {
  name: 'ProfileMenu',
  components: {
    IconAvatarSVG,
    IconPencilSVG
  },
  data() {
    return {
      isAvatarHover: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['fullName', 'avatar']),
    ...mapWritableState(useModalStore, ['isUpdateProfileModalOpen'])
  },
  methods: {
    ...mapActions(useUserStore, ['signOut']),
    async logOut() {
      await this.signOut()
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<template>
  <div
    class="bg-white absolute top-16 right-2 mt-2 z-20 w-40 rounded shadow-xl overflow-hidden text-gray-600"
  >
    <div class="relative px-4 py-2 space-y-2 border-b-2 border-opacity-10 border-b-gray-500">
      <span
        @mouseover.prevent="isAvatarHover = true"
        @mouseleave.prevent="isAvatarHover = false"
        class="bg-rose-300 block absolute mx-auto left-12 right-0 rounded-full max-w-fit p-1 cursor-pointer"
        :class="{ hidden: !isAvatarHover }"
        @click.prevent="isUpdateProfileModalOpen = true"
      >
        <IconPencilSVG class="fill-white h-6 w-6" />
      </span>
      <img
        v-if="avatar"
        :src="avatar.url"
        class="h-12 w-12 mx-auto rounded-full"
        alt="profile image"
        @mouseover.prevent="isAvatarHover = true"
        @mouseleave.prevent="isAvatarHover = false"
      />
      <IconAvatarSVG
        v-else
        class="h-12 w-12 mx-auto"
        @mouseover.prevent="isAvatarHover = true"
        @mouseleave.prevent="isAvatarHover = false"
      />
      <p class="text-center font-medium text-sm">{{ fullName }}</p>
    </div>
    <ul class="list-none">
      <li>
        <a
          class="block h-full w-full px-4 py-2 hover:bg-rose-300 hover:text-white"
          href="#"
          @click.prevent="logOut"
        >
          LOGOUT
        </a>
      </li>
    </ul>
  </div>
</template>
