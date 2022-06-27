<template>
  <q-page :padding="$q.platform.is.desktop">
    <router-view />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();
</script>
