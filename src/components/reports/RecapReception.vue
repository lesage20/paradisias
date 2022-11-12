<template>
  <q-card class="q-pa-lg">
    <q-toolbar class="q-mb-lg desktop-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>
    </q-toolbar>
    <q-toolbar class="q-ma-none q-pa-none mobile-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>
    </q-toolbar>
    <PdfGenerator :title="`recap_reception_${new Date().toLocaleDateString()}`">
      <template #content>
        <div>
          <q-toolbar class="q-ma-none q-pb-none q-px-lg">
            <span style="font-size: 12px" class="text-grey">
              Paradisias Hotel
            </span>
            <q-space></q-space>
            <span style="font-size: 12px" class="text-grey">
              Tel: +225 0787572030
            </span>
          </q-toolbar>
          <q-separator inset></q-separator>
          <q-toolbar class="q-mt-lg">
            <q-toolbar-title class="text-center text-uppercase">
              Recapitulatif point des receptionniste
            </q-toolbar-title>
          </q-toolbar>
          <q-toolbar class="q-pr-xl q-pa-none q-ma-none">
            <q-space></q-space>
            Date: {{ new Date().toLocaleDateString() }}
          </q-toolbar>

          <q-card flat>
            <div class="q-py-sm">
              <q-table v-model:pagination="pagination" wrap-cells :rows-per-page-options="[0]" flat bordered
                :rows="rows" :columns="columns" separator="cell" :hide-pagination="true" hide-bottom>
                <template #body-cell-observation="attr">
                  <q-td :attr="attr" cols="1" @click="attr.row.active = true">
                    <q-input v-if="attr.row.active" v-model="attr.row.model" :autogrow="true" label="observation"
                      type="textarea" @keyup.enter.ctrl="attr.row.active = false"></q-input>
                    <p v-else class="text-wrap">{{ attr.row.model }}</p>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-card>
        </div>
      </template>
    </PdfGenerator>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import axios from "axios";
import PdfGenerator from "./PdfGenerator.vue";
import { ref, onMounted, inject, computed } from "vue";
import { isToday, isThisWeek, isThisMonth } from "date-fns";
import { useLoginStore as store } from "src/stores/login";
import { useRouter } from "vue-router";

const emits = defineEmits(["back"]);
const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const router = useRouter();
const endpoints = [
  api + "hotel/reservations/",
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "accounts/clients/",
];
const reservations = ref([]);
const locations = ref([]);
const chambres = ref([]);
const clients = ref([]);

const todayReservations = ref([]);
const thisMonthLocations = ref([]);

onMounted(() => {
  axios
    .all(
      endpoints.map((endpoint) =>
        axios.get(endpoint, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      )
    )
    .then(
      axios.spread((reservationList, locationList, chambreList, clientList) => {
        reservations.value = reservationList.data;
        locations.value = locationList.data;
        chambres.value = chambreList.data;
        clients.value = clientList.data;
        chambres.value.forEach((el) => {
          el.reservations = reservations.value.filter(
            (res) => el.id == res.room
          );
        });
        todayReservations.value = reservations.value.filter((loc) =>
          isToday(new Date(loc.checkIn))
        );

        thisMonthLocations.value = reservations.value.filter((loc) =>
          isThisMonth(new Date(loc.checkIn))
        );
      })
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
         // dialog
        //   .update({
        //     title: "Erreur de réseau",
        //     message:
        //       "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
        //     ok: "actualiser",
        //     progress: false,
        //     persistent: true,
        //   })
        //   .onOk(() => {
        //     window.location.reload();
        //   });
      } else {
        if (err.response.status == "401") {
          dialog
            .update({
              title: "Erreur",
              message:
                "Votre delai de connexion est passé veuillez vous reconnecter",
              ok: "se connecter",
              progress: false,
            })
            .onOk(() => {
              store().logout();
              router.push({ name: "Login" });
            });
        } else {
          dialog.update({
            title: "Erreur",
            message: `Une erreur s'est produite. <br/> code d'erreur: <b> ${err.response.status} </b> <br/> message: ${err.response.message}`,
            persistent: false,
            ok: true,
            progress: false,
          });
        }
      }
    });
});

const TotalRooms = computed(() => chambres.value.length);

const BusyRooms = computed(
  () => locations.value.filter((loc) => isToday(new Date(loc.checkIn))).length
);
const BusyRoomsObs = ref("");

const FreeLocations = computed(
  () => locations.value.filter((loc) => loc.totalPrice == 0).length
);
const FreeLocationsObs = ref("");

const RevenuCash = computed(() => {
  let revenu = 0;
  locations.value
    .filter((loc) => isToday(new Date(loc.checkIn)))
    .forEach((loc) => {
      revenu += loc.payment == "espece" ? loc.totalPrice : 0;
    });
  return revenu;
});
const RevenuCashObs = ref("");

const RevenuVirtual = computed(() => {
  let revenu = 0;
  locations.value
    .filter((loc) => isToday(new Date(loc.checkIn)))
    .forEach((loc) => {
      revenu += loc.payment != "espece" ? loc.totalPrice : 0;
    });
  return revenu;
});
const RevenuVirtualObs = ref("");

const FreeRooms = computed(() => TotalRooms.value - BusyRooms.value);
const FreeRoomsObs = ref("");

const TotalRevenu = computed(() => RevenuCash.value + RevenuVirtual.value);
const TotalRevenuObs = ref("");

const rows = ref([
  {
    label: "Chambres Occupées",
    valeur: BusyRooms,
    prix: false,
    observation: BusyRoomsObs,
    model: "",
    active: false,
  },
  {
    label: "Chambres Occupées Gratuites",
    valeur: FreeLocations,
    prix: false,
    observation: FreeLocationsObs,
    model: "",
  },
  {
    label: "Chambres Libres",
    valeur: FreeRooms,
    prix: false,
    observation: FreeRoomsObs,
    model: "",
  },
  {
    label: "Recette en espèce",
    valeur: RevenuCash,
    prix: true,
    observation: RevenuCashObs,
    model: "",
  },
  {
    label: "Autres types de recette (cheque, devise, etc)",
    valeur: RevenuVirtual,
    prix: true,
    observation: RevenuVirtualObs,
    model: "",
  },
  {
    label: "Montant Total Versé",
    valeur: TotalRevenu,
    prix: true,
    observation: TotalRevenuObs,
    model: "",
  },
  {
    label: "Report",
    valeur: "Occupation",
    prix: false,
    observation: "",
    model: "",
  },
]);
// tableau
const columns = [
  {
    name: "Label",
    required: true,
    label: "Designation",
    align: "start",
    field: (row) => row.label,
    format: (val) => `${val}`,
  },
  {
    name: "valeur",
    required: true,
    label: "Quantité ou Prix",
    align: "center",
    field: (row) => row,
    format: (val) => `${val.valeur} ${val.prix ? "FCFA" : ""}`,
  },
  {
    name: "observation",
    required: true,
    label: "Observation",
    align: "center",
    field: (row) => row.observation,
    format: (val) => ``,
  },
];
</script>
