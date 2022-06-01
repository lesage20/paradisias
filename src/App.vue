<template>
  <div>
    <q-ajax-bar color="teal-3"></q-ajax-bar>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
