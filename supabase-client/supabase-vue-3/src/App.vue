<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
    <GameMaster v-if="store.user"></GameMaster>
    <Profile v-if="store.user" />
    <Auth v-else />
  </div>
</template>

<script>
import { store } from "./store"
import { supabase } from "./supabase"
import Auth from "./components/Auth.vue"
import Profile from "./components/Profile.vue"
import GameMaster from "./components/GameMaster.vue"

export default {
  components: {
    Auth,
    Profile,
    GameMaster
  },

  setup() {
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    return {
      store,
    }
  },
}
</script>
