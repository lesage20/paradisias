<template>
  <div>
    <q-ajax-bar color="red" style="height: 4px"></q-ajax-bar>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>
import { provide } from "vue";

if (process.env.DEV) {
  provide("api", "http://192.168.43.108:8000/");
} else {
  provide("api", "https://paradisias-api.herokuapp.com/");
}
</script>
