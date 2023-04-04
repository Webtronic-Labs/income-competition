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
  <div class="absolute top-16 right-2 mt-2 bg-white rounded shadow-xl overflow-hidden z-20 w-40">
    <div class="relative space-y-2 border-b-2 border-opacity-10 border-b-gray-500 px-4 py-2">
      <span
        @mouseover.prevent="isAvatarHover = true"
        @mouseleave.prevent="isAvatarHover = false"
        class="block absolute mx-auto left-12 right-0 rounded-full max-w-fit bg-red-200 p-1 cursor-pointer"
        :class="{ hidden: !isAvatarHover }"
        @click.prevent="isUpdateProfileModalOpen = true"
      >
        <IconPencilSVG class="h-6 w-6 opacity-60" />
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
      <p class="font-medium text-center">{{ fullName }}</p>
    </div>
    <ul class="list-none">
      <li>
        <a class="block h-full w-full px-4 py-2 hover:bg-gray-400" href="#" @click.prevent="logOut">
          LOGOUT
        </a>
      </li>
    </ul>
  </div>
</template>
