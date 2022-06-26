<template>
  <div>
    <q-ajax-bar color="orange-8"></q-ajax-bar>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>
import { provide } from "vue";

provide("api", "https://paradisias-api.herokuapp.com/");
// provide("api", "http://127.0.0.1:8000/");
</script>
