<template>
  <q-page padding>
    <div v-show="menu" class="row q-py-md">
      <!-- <div class="col-sm-6 col-md-6 q-pa-sm text-center text-teal">
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
      </div> -->
      <div class="col-12">
        <q-card :flat="$q.platform.is.desktop">
          <q-list padding separator>
            <q-toolbar>
              <q-item-label class="text-h4"> Liste des rapports </q-item-label>
            </q-toolbar>
            <q-separator
              :class="{ 'q-mb-lg': $q.platform.is.mobile }"
            ></q-separator>

            <q-item
              v-for="rap in listRapport"
              :key="rap.label"
              v-ripple="{ color: 'teal' }"
              clickable
              @click="rap.callBack"
            >
              <q-item-section side>
                <q-icon :name="rap.icon"> </q-icon>
              </q-item-section>
              <q-item-label class="text-h5">
                {{ rap.label }}
              </q-item-label>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <div v-show="!menu" class="row justify-center">
      <div class="col">
        <component :is="comp" @back="menu = true"></component>
      </div>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import { ref, computed, watch, defineComponent } from "vue";
import ListDownloader from "src/components/ListDownloader.vue";
import ReportGenerator from "src/components/ReportGenerator.vue";
import ReservationReport from "src/components/ReservationReport.vue";
import SituationChambre from "src/components/SituationChambre.vue";
import RecapReception from "src/components/RecapReception.vue";
const $q = useQuasar();
export default defineComponent({
  components: {
    ListDownloader,
    ReportGenerator,
    ReservationReport,
    SituationChambre,
    RecapReception,
  },
  data: () => ({
    comp: "",
    menu: true,
  }),
  computed: {
    listRapport() {
      return [
        {
          label: "Fiche de réservations",
          icon: "fa fa-file",
          callBack: () => {
            this.comp = "ReservationReport";
            this.menu = false;
          },
        },
        {
          label: "Feuille de situation des chambres",
          icon: "fa fa-file",
          callBack: () => {
            this.comp = "SituationChambre";
            this.menu = false;
          },
        },
        {
          label: "Rapport d'occupation des chambres",
          icon: "fa fa-file",
          callBack: () => {
            this.comp = "SituationChambre";
            this.menu = false;
          },
        },
        {
          label: "Recapitulatif point réceptionniste",
          icon: "fa fa-file",
          callBack: () => {
            this.comp = "RecapReception";
            this.menu = false;
          },
        },

        { label: "Rapport de passation", icon: "fa fa-file" },
        {
          label: "Rapport global",
          icon: "fa fa-file",
          callBack: () => {
            this.comp = "ReportGenerator";
            this.menu = false;
          },
        },
        {
          label: "Téléchargeur de liste",
          icon: "fa fa-download",
          callBack: () => {
            this.comp = "ListDownloader";
            this.menu = false;
          },
        },
      ];
    },
  },
  watch: {
    comp() {
      console.log(this.comp);
    },
  },
});
</script>
