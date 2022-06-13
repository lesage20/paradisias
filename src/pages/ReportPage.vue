<template>
  <q-page padding>
    <div v-show="menu" class="row q-py-md">
      <div class="col-sm-6 col-md-6 q-pa-sm text-center text-teal">
        <div class="q-py-sm">
          <q-btn
            :class="$q.platform.is.desktop ? '' : 'full-width'"
            outline
            :size="$q.platform.is.desktop ? '50px' : 'md'"
            no-caps
            flat
            @click="
              comp = 'ReportGenerator';
              menu = false;
            "
          >
            <q-icon
              :left="$q.platform.is.desktop ? false : true"
              :size="$q.platform.is.desktop ? '200px' : 'md'"
              name="fa-solid fa-file"
            ></q-icon>
            Génerer rapport
          </q-btn>
        </div>
      </div>
      <div class="col-sm-6 col-md-6 q-pa-sm text-center text-blue-8">
        <div class="q-py-sm">
          <q-btn
            outline
            :size="$q.platform.is.desktop ? '50px' : 'md'"
            no-caps
            flat
            @click="
              comp = 'ListDownloader';
              menu = false;
            "
          >
            <q-icon
              :left="$q.platform.is.desktop ? false : true"
              :size="$q.platform.is.desktop ? '200px' : 'md'"
              name="fa-solid fa-download"
            ></q-icon>
            Télécharger Liste
          </q-btn>
        </div>
      </div>
    </div>
    <div v-show="!menu" class="row justify-center">
      <div class="col">
        <keep-alive>
          <component :is="comp" @back="menu = true"></component>
        </keep-alive>
      </div>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import ListDownloader from "src/components/ListDownloader.vue";
import ReportGenerator from "src/components/ReportGenerator.vue";
import { ref, computed, watch, defineComponent } from "vue";
const $q = useQuasar();
export default defineComponent({
  components: {
    ListDownloader,
    ReportGenerator,
  },
  data: () => ({
    comp: "",
    menu: true,
  }),
  watch: {
    comp() {
      console.log(this.comp);
    },
  },
});
</script>
