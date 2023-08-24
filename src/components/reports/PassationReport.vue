<template>
  <q-card class="q-pa-lg">
    <q-toolbar class="q-mb-lg desktop-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>

      <q-btn icon="event" label="date" class="q-mx-sm" color="blue-8">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" @before-show="updateProxy">
          <q-date v-model="selectedRange">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn v-close-popup label="Cancel" color="primary" flat />
              <q-btn v-close-popup label="OK" color="primary" flat @click="save" />
            </div>
          </q-date>
        </q-popup-proxy>
        <q-tooltip class="text-subtitle2">
          Choisir une date pour générer son rapport
        </q-tooltip>
      </q-btn>
      <!-- <q-btn class="q-mx-sm" unelevated><q-tooltip class="text-subtitle2">Type de </q-tooltip></q-btn> -->
      <q-btn class="q-mx-sm" color="teal-6" @click="selectedRange = 'day'">
        <q-icon left size="xs" name="fa fa-calendar-day" />
        Aujourd'hui
        <q-tooltip class="text-subtitle2"> Rapport d'aujourdui </q-tooltip>
      </q-btn>

      <q-btn class="q-mx-sm" color="orange-8" @click="selectedRange = 'month'">
        <q-icon left size="xs" name="fa fa-calendar-days" />
        Ce Mois
        <q-tooltip class="text-subtitle2"> Rapport de ce mois </q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-toolbar class="q-ma-none q-pa-none mobile-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>
    </q-toolbar>
    <q-toolbar class="q-ma-none q-pa-none mobile-only">
      <div class="row" style="width: 100%">
        <div class="col-xs-12 q-pa-sm">
          <q-btn icon="event" label="date" class="q-mx-sm full-width" color="blue-8">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale" @before-show="updateProxy">
              <q-date v-model="selectedRange">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn v-close-popup label="Cancel" color="primary" flat />
                  <q-btn v-close-popup label="OK" color="primary" flat @click="save" />
                </div>
              </q-date>
            </q-popup-proxy>
            <q-tooltip class="text-subtitle2">
              Choisir une date pour générer son rapport
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-12 q-pa-sm">
          <q-btn class="q-mx-sm full-width" color="teal-6" @click="selectedRange = 'day'">
            <q-icon left size="xs" name="fa fa-calendar-day" />
            jour
            <q-tooltip class="text-subtitle2">
              Rapport Journalier de reservation
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-12 q-pa-sm">
          <q-btn class="q-mx-sm full-width" color="orange-8" @click="selectedRange = 'week'">
            <q-icon left size="xs" name="fa fa-calendar-week" />
            semaine
            <q-tooltip class="text-subtitle2">
              Rapport de cette semaine
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-12 q-pa-sm">
          <q-btn class="q-mx-sm full-width" color="purple" @click="selectedRange = 'month'">
            <q-icon left size="xs" name="fa fa-calendar-days" />
            mois
            <q-tooltip class="text-subtitle2"> Rapport de ce mois </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-toolbar>

    <PdfGenerator :title="`passation_service_${new Date().toLocaleDateString()}`">
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
              Rapport de passation de service
            </q-toolbar-title>
          </q-toolbar>
          <q-toolbar class="q-pr-xl q-pa-none q-ma-none">
            <q-space></q-space>
            Journée du
            {{
              selectedRange == "day"
              ? new Date().toLocaleDateString()
              : new Date(selectedRange).toLocaleDateString()
            }}
          </q-toolbar>

          <q-card flat>
            <div class="q-py-sm">
              <q-table v-model:pagination="pagination" :rows-per-page-options="[0]" flat bordered :rows="chambres"
                :columns="columns" separator="cell" :hide-pagination="true" hide-bottom>
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
import { ref, onMounted, inject, computed, watchEffect } from "vue";
import { isToday, isThisWeek, isThisMonth, isWithinInterval } from "date-fns";

const emits = defineEmits(["back"]);
const token = inject("token");
const api = inject("api");
const $q = useQuasar();

const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "accounts/clients/",
];
const reservations = ref([]);
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
      axios.spread((reservationList, chambreList, clientList) => {
        reservations.value = reservationList.data;
        chambres.value = chambreList.data;
        clients.value = clientList.data;
        chambres.value.forEach((el) => {
          el.reservations = reservations.value.filter(
            (res) => el.id == res.room
          );
        });
        todayReservations.value = reservations.value.filter((loc) => {
          const tod = new Date()
          return isWithinInterval(tod, {
            start: new Date(loc.checkIn),
            end: new Date(loc.checkOut),
          })
        }
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

// fonctionalites
function guestName(id) {
  let client = clients.value.filter((client) => client.id == id)[0];
  return Boolean(client) ? client.name + " " + client.firstname : "";
}

function roomNumber(id) {
  let room = chambres.value.filter((room) => room.id == id)[0];
  return room.number;
}
const selectedRange = ref("day");

// after selection
const currentSelectionText = ref("Aujourd'hui");

// tableau
const columns = [
  {
    name: "client",
    required: true,
    label: "Clients",
    align: "center",
    field: (row) =>
      row.reservations.length ? guestName(row.reservations[0].guest) : "",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "room",
    required: true,
    label: "Chambre",
    align: "center",
    field: (row) => row.number,
    format: (val) => `${val}`,
    sortable: true,
  },

  {
    name: "Prix",
    required: true,
    label: "Prix",
    align: "center",
    field: (row) =>
      row.reservations.length ? row.reservations[0].totalPrice : "",
    format: (val) => (val ? val + " FCFA" : ""),
    sortable: true,
  },

];
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

watchEffect(() => {
  if (selectedRange.value == "day") {
    currentSelectionText.value = "Aujourd'hui";
    chambres.value.forEach((el) => {
      el.reservations = todayReservations.value.filter(
        (res) => el.id == res.room
      );
    });
  } else if (selectedRange.value == "week") {
    currentSelectionText.value = "Cette Semaine";
  } else if (selectedRange.value == "month") {
    currentSelectionText.value = "Ce mois";
  } else {
    currentSelectionText.value = `Le ${new Date(
      selectedRange.value
    ).toLocaleDateString()}`;
    chambres.value.forEach((el) => {
      el.reservations = reservations.value.filter(
        (res) =>
          el.id == res.room &&
          new Date(selectedRange.value).toLocaleDateString() ==
          new Date(res.checkIn).toLocaleDateString()
      );
    });
  }
});
</script>
