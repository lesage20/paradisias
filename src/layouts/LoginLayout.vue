<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <q-page-container class="bg-grey-3">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LoginLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    return {};
  },
});
</script>
