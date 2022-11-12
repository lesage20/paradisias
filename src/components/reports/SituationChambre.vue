<template>
  <q-card class="q-pa-lg">
    <q-toolbar class="q-mb-lg desktop-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>
      <!-- <q-btn class="q-mx-xs">Saisir hors services</q-btn> -->
      <q-input v-model="roomHS" class="q-mx-xs" dense borderless type="number" label="Chambres Hors service" />
      <!-- <q-btn class="q-mx-xs">Saisir Non Arrivées</q-btn> -->
      <q-input v-model="nonArriv" class="q-mx-xs" dense borderless type="number" label="Non Arrivées" />
    </q-toolbar>
    <q-toolbar class="q-ma-none q-pa-none mobile-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>
    </q-toolbar>
    <PdfGenerator :title="`situation_chambre_${new Date().toLocaleDateString()}`">
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
              Feuille de situation des chambres
            </q-toolbar-title>
          </q-toolbar>
          <q-toolbar class="q-pr-xl q-pa-none q-ma-none">
            <q-space></q-space>
            Date: {{ new Date().toLocaleDateString() }}
          </q-toolbar>

          <q-card flat>
            <div class="q-py-sm">
              <q-table v-model:pagination="pagination" :rows-per-page-options="[0]" flat bordered :rows="rows"
                :columns="columns" separator="cell" :hide-pagination="true" hide-bottom>
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
import { ref, onMounted, inject, computed, watch } from "vue";
import { isToday, isThisWeek, isThisMonth } from "date-fns";

const emits = defineEmits(["back"]);
const token = inject("token");
const api = inject("api");
const $q = useQuasar();

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
const WaitingCheckIn = computed(
  () => locations.value.filter((loc) => isToday(new Date(loc.checkIn))).length
);

const WaitingCheckOut = computed(
  () => locations.value.filter((loc) => isToday(new Date(loc.checkOut))).length
);
const FreeLocations = computed(
  () => locations.value.filter((loc) => loc.totalPrice == 0).length
);
const roomHS = ref(0);
const nonArriv = ref(0);
const FreeRooms = computed(() => TotalRooms.value - BusyRooms.value);
const TotalBusyRooms = computed(() => BusyRooms.value + FreeLocations.value);
const Occupation = computed(
  () => (TotalBusyRooms.value * 100) / (TotalRooms.value || 1)
);

const rows = ref([
  {
    label: "Total Chambre",
    valeur: TotalRooms,
  },
  {
    label: "Chambres Occupées",
    valeur: BusyRooms,
  },
  {
    label: "Arrivées Prévues",
    valeur: WaitingCheckIn,
  },
  {
    label: "Depart Preévus",
    valeur: WaitingCheckOut,
  },

  {
    label: "Chambres Occupées Gratuites",
    valeur: FreeLocations,
  },
  {
    label: "Hors Services",
    valeur: roomHS.value,
  },
  {
    label: "Non Arrivées",
    valeur: nonArriv.value,
  },
  {
    label: "Chambres Libres",
    valeur: FreeRooms,
  },
  {
    label: "Total Chambres Occupée",
    valeur: TotalBusyRooms,
  },
  {
    label: "Taux Occupation",
    valeur: Occupation,
    pourcent: true,
  },
]);
// tableau
const columns = [
  {
    name: "Label",
    required: true,
    label: "Label",
    align: "start",
    field: (row) => row.label,
    format: (val) => `${val}`,
  },
  {
    name: "valeur",
    required: true,
    label: "Valeur",
    align: "center",
    field: (row) => row,
    format: (val) => `${val.valeur} ${val.pourcent ? "%" : ""}`,
  },
];
watch([roomHS, nonArriv], (value) => {
  rows.value = [
    {
      label: "Total Chambre",
      valeur: TotalRooms,
    },
    {
      label: "Chambres Occupées",
      valeur: BusyRooms,
    },
    {
      label: "Arrivées Prévues",
      valeur: WaitingCheckIn,
    },
    {
      label: "Depart Preévus",
      valeur: WaitingCheckOut,
    },

    {
      label: "Chambres Occupées Gratuites",
      valeur: FreeLocations,
    },
    {
      label: "Hors Services",
      valeur: roomHS.value,
    },
    {
      label: "Non Arrivées",
      valeur: nonArriv.value,
    },
    {
      label: "Chambres Libres",
      valeur: FreeRooms,
    },
    {
      label: "Total Chambres Occupée",
      valeur: TotalBusyRooms,
    },
    {
      label: "Taux Occupation",
      valeur: Occupation,
      pourcent: true,
    },
  ];
});
</script>
