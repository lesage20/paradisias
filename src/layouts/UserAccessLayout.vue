<template>
  <q-layout view="hHh Lpr fFf" @scroll="logScroll">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="my-xl fixed-top" :class="{'bg-light-dark': isTop}" :elevated="!isTop">
      <q-toolbar v-if="isTop">
        <!--  <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" /> -->
        <span class="text-teal-8" :class="{'text-h4': $q.screen.gt.sm,'text-h6': $q.screen.lt.md, }">
          Paradisias <span v-if="$q.screen.gt.sm">Hotel</span>
        </span>
        <q-space></q-space>

        <q-btn color="teal-8" :size="$q.screen.gt.sm ? 'md': 'sm' " :style="{margin: '0 .5rem 0 0'}"
          class="ma-2  text-grey-4">
          Connexion
        </q-btn>

        <q-btn color="pink-8" :size="$q.screen.gt.sm ? 'md': 'sm' " :style="{margin: '0 .5rem 0 0'}"
          class="mx-2 text-grey-4">
          Créer mon compte
        </q-btn>


      </q-toolbar>
      <q-tabs v-else>
        <q-route-tab icon="map" to="/your/route" replace label="One Tab" />
        <q-route-tab icon="assignment" to="/some/other/route" replace label="Other Tab" />
      </q-tabs>


    </q-header>

    <!-- (Optional) The Footer -->
    <!-- <q-footer reveal>
      <q-toolbar>
        <q-tabs>
          <q-route-tab icon="map" to="/your/route" replace label="One Tab" />
          <q-route-tab icon="assignment" to="/some/other/route" replace label="Other Tab" />
        </q-tabs>
      </q-toolbar>
    </q-footer> -->



    <!-- <q-page-container> -->
    <!-- This is where pages get injected -->
    <router-view />
    <!-- </q-page-container> -->

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const isTop = ref(true)
const logScroll = (evt) => {
  if (evt.position > 60) {
    isTop.value = false
  }
  else {
    isTop.value = true
  }
}

</script>
<style lang="scss">
.bg-light-dark {
  background: linear-gradient(to right, rgb(0, 0, 0, .5), rgb(0, 0, 0, .5));
}
</style>
