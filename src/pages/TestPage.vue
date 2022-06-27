<template>
  <q-page padding>
    <div class="row">
      <div class="col q-pa-md">
        <q-btn
          class="full-width"
          color="primary"
          @click="comp = 'TitleComponent'"
        >
          titre
        </q-btn>
      </div>
      <div class="col q-pa-md">
        <q-btn
          class="full-width"
          color="blue-8"
          @click="comp = 'ContentComponent'"
        >
          Contenu
        </q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <keep-alive>
          <component :is="comp"></component>
        </keep-alive>
      </div>
    </div>
    <div class="row">
      <div class="gradient col-12">{{ store().profile }}</div>
    </div>
  </q-page>
</template>
<script setup>
import TitleComponent from "src/components/TitleComponent.vue";
import ContentComponent from "src/components/ContentComponent.vue";
import { useLoginStore as store } from "src/stores/login";
import { ref } from "vue";
const comp = ref("TitleComponent");
</script>

<style>
.gradient {
  background-image: linear-gradient(135deg, #abdcff 10%, #0396ff 100%);
}
</style>
