<template>
  <div>
    <q-ajax-bar color="teal-3"></q-ajax-bar>
    <router-view />
  </div>
</template>

<script setup>
import { provide } from "@vue/runtime-core";

provide("api", "https://paradisias-api.herokuapp.com/");
<<<<<<< Updated upstream
=======
// provide("api", "http://192.168.43.108:8000/");
>>>>>>> Stashed changes
</script>
