<script>
import { mapState, mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import useModalStore from '@/stores/modal'
import SaleModal from '@/components/SaleModal.vue'
import UpdateProfileModal from '@/components/UpdateProfileModal.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'
import IconAvatarSVG from '@/components/icons/IconAvatarSVG.vue'
import IconHomeSVG from '@/components/icons/IconHomeSVG.vue'
import IconUserSVG from '@/components/icons/IconUserSVG.vue'
import IconStarSVG from '@/components/icons/IconStarSVG.vue'
import IconTrophySVG from '@/components/icons/IconTrophySVG.vue'
import IconMenuCSS from '@/components/icons/IconMenuCSS.vue'
import IconOptionCSS from '@/components/icons/IconOptionCSS.vue'
import IconPlusCSS from '@/components/icons/IconPlusCSS.vue'
import { usersCollection } from '@/includes/firebase'

export default {
  name: 'Home',
  components: {
    IconAvatarSVG,
    IconHomeSVG,
    IconUserSVG,
    IconStarSVG,
    IconTrophySVG,
    IconPlusCSS,
    IconMenuCSS,
    IconOptionCSS,
    SaleModal,
    UpdateProfileModal,
    ProfileMenu
  },
  data() {
    return {
      users: [],
      userToCompare: null,
      isOptionsOpen: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['id', 'fullName', 'totalSales', 'totalRevenue', 'avatar']),
    ...mapState(useModalStore, ['isUpdateProfileModalOpen']),
    ...mapWritableState(useModalStore, ['isSaleModalOpen'])
  },
  methods: {
    selectUserToCompare(idOfUserToCompare) {
      this.userToCompare = this.users.find(({ id }) => id === idOfUserToCompare)
    },
    getPosition(idToSearch) {
      return this.users.findIndex(({ id }) => id === idToSearch) + 1
    },
    load() {
      usersCollection
        .orderBy('totalRevenue', 'desc')
        .get()
        .then((snap) => {
          const newUsers = []
          snap.forEach((doc) => {
            newUsers.push({ id: doc.id, ...doc.data() })
          })

          this.users = newUsers
        })
        .catch((error) => console.log(error))
    }
  },
  created() {
    this.load()
  }
}
</script>

<template>
  <header>
    <nav class="flex items-center justify-between h-16 p-4 bg-white relative">
      <button
        class="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-200"
        value="MENU"
      >
        <IconMenuCSS />
      </button>
      <h1 class="font-semibold text-xl">Leaderboard</h1>
      <button
        class="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-200"
        value="OPTION"
        @click.prevent="isOptionsOpen = !isOptionsOpen"
      >
        <IconOptionCSS />
      </button>
      <ProfileMenu v-if="isOptionsOpen" />
    </nav>
  </header>
  <main class="bg-slate-300 p-2 pb-32 grow">
    <section class="relative bg-white rounded py-6 pl-16">
      <div
        class="flex items-center justify-center absolute top-0 bottom-0 -left-14 my-auto rounded-md bg-slate-300 h-20 w-20 rotate-45"
      >
        <div class="rounded-md bg-red-500 h-16 w-16 relative">
          <span class="absolute -rotate-45 text-white right-0 top-0 bottom-0 my-auto font-medium">{{
            getPosition(id)
          }}</span>
        </div>
      </div>
      <header class="flex items-center gap-4">
        <img v-if="avatar" :src="avatar.url" class="h-10 w-10 rounded-full" alt="profile image" />
        <IconAvatarSVG v-else class="h-10 w-10" />
        <div>
          <h2 class="font-medium text-lg">{{ fullName }}</h2>
          <h3 class="text-sm">Sales Corp</h3>
        </div>
      </header>
      <main class="flex gap-8 mt-2">
        <div class="flex flex-col">
          <h4>Total Sales</h4>
          <p class="font-medium text-lg">{{ totalSales }}</p>
        </div>
        <div class="flex flex-col">
          <h4>Total Revenue</h4>
          <p class="font-medium text-lg">${{ totalRevenue }}</p>
        </div>
      </main>
    </section>
    <section
      v-if="userToCompare && userToCompare.id !== id"
      class="relative bg-white rounded py-6 pl-16 mt-2"
    >
      <div
        class="flex items-center justify-center absolute top-0 bottom-0 -left-14 my-auto rounded-md bg-slate-300 h-20 w-20 rotate-45"
      >
        <div class="rounded-md bg-white h-16 w-16 relative">
          <span class="absolute -rotate-45 text-black right-0 top-0 bottom-0 my-auto font-medium">{{
            getPosition(userToCompare.id)
          }}</span>
        </div>
      </div>
      <header class="flex items-center gap-4">
        <img
          v-if="userToCompare.avatar"
          :src="userToCompare.avatar.url"
          class="h-10 w-10 rounded-full"
          alt="profile image"
        />
        <IconAvatarSVG v-else class="h-10 w-10" />
        <div>
          <h2 class="font-medium text-lg">{{ userToCompare.fullName }}</h2>
          <h3 class="text-sm">Sales Corp</h3>
        </div>
      </header>
      <main class="flex gap-8 mt-2">
        <div class="flex flex-col">
          <h4>Total Sales</h4>
          <p class="font-medium text-lg">{{ userToCompare.totalSales }}</p>
        </div>
        <div class="flex flex-col">
          <h4>Total Revenue</h4>
          <p class="font-medium text-lg">${{ userToCompare.totalRevenue }}</p>
        </div>
      </main>
    </section>
    <section class="bg-white text-center rounded mt-2">
      <ul class="list-none px-2 py-4">
        <li
          v-for="(user, index) in users"
          :key="user.id"
          class="flex items-center gap-6 p-2 rounded-md"
          :class="{ 'bg-yellow-100': index === 0 }"
          @click.prevent="() => selectUserToCompare(user.id)"
        >
          <div v-if="index !== 0" class="flex justify-center w-4">{{ index + 1 }}</div>
          <div v-else class="flex justify-start">
            <IconTrophySVG class="h-4 w-4 fill-yellow-500" />
          </div>
          <div class="text-left">
            <img
              v-if="user.avatar"
              :src="user.avatar.url"
              class="h-8 w-8 rounded-full"
              alt="profile image"
            />
            <IconAvatarSVG v-else class="h-8 w-8" />
          </div>
          <div class="grow text-left font-medium">{{ user.fullName }}</div>
          <div class="font-medium text-left w-10">${{ user.totalRevenue }}</div>
          <IconStarSVG class="h-4 w-4" />
        </li>
      </ul>
    </section>
  </main>
  <footer class="bg-slate-900 flex items-center justify-between fixed bottom-0 h-16 w-full px-4">
    <button class="flex items-center justify-center h-8 w-8" value="MENU">
      <IconHomeSVG class="fill-red-500" />
    </button>
    <div
      class="flex items-center justify-center bg-slate-300 h-20 w-20 rotate-45 rounded-md absolute mx-auto left-0 right-0 bottom-10"
    >
      <button
        class="flex items-center justify-center bg-red-500 text-white h-16 w-16 rounded-md relative"
        @click.prevent="isSaleModalOpen = true"
      >
        <IconPlusCSS class="rotate-45 w-8 h-8" />
      </button>
    </div>
    <button class="flex items-center justify-center h-8 w-8" value="MENU">
      <IconUserSVG class="fill-red-500" />
    </button>
  </footer>

  <SaleModal v-if="isSaleModalOpen" :loadData="load" />
  <UpdateProfileModal v-if="isUpdateProfileModalOpen" :loadData="load" />
</template>
