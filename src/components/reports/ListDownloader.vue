<template>
  <q-page>
    <q-card class="q-pa-lg">
      <div class="row q-mb-lg">
        <div class="col-1">
          <q-btn
            round
            flat
            icon="fa fa-arrow-left"
            @click="emits('back')"
          ></q-btn>
        </div>

        <div class="col q-px-sm">
          <q-btn
            outline
            class="q-mx-sm full-width"
            color="green-8"
            @click="selectedList = 'location'"
          >
            <q-icon
              left
              size="xs"
              :name="
                selectedList == 'location'
                  ? 'fa fa-check-circle'
                  : 'fa-solid fa-list-check'
              "
            />
            Locations
            <q-tooltip class="text-subtitle2"> Liste de locations </q-tooltip>
          </q-btn>
        </div>
        <div class="col q-px-sm">
          <q-btn
            outline
            class="q-mx-sm full-width"
            color="orange-8"
            @click="selectedList = 'reservation'"
          >
            <q-icon
              left
              size="xs"
              :name="
                selectedList == 'reservation'
                  ? 'fa fa-check-circle'
                  : 'pending_actions'
              "
            />
            Réservations
            <q-tooltip class="text-subtitle2">
              Liste de Réservations
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col q-px-sm">
          <q-btn
            outline
            class="q-mx-sm full-width"
            color="red-8"
            @click="selectedList = 'depense'"
          >
            <q-icon
              left
              size="xs"
              :name="
                selectedList == 'depense'
                  ? 'fa fa-check-circle'
                  : 'fa fa-dollar-sign'
              "
            />
            Depenses
            <q-tooltip class="text-subtitle2"> Liste des depenses </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-xs-6 col-sm-6 col-md-3 q-px-sm">
          <q-btn
            icon="fa fa-table-list"
            label="Tout"
            class="q-mx-sm full-width"
            color="blue-8"
            @click="selectedRange = 'all'"
          >
            <q-tooltip class="text-subtitle2">
              Afficher la liste de tous/toutes les {{ selectedList }}s
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 q-px-sm">
          <q-btn
            class="q-mx-sm full-width"
            color="teal-6"
            @click="selectedRange = 'day'"
          >
            <q-icon left size="xs" name="fa fa-calendar-day" />
            jour
            <q-tooltip class="text-subtitle2"> Rapport d'aujourdui </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 q-px-sm">
          <q-btn
            class="q-mx-sm full-width"
            color="orange-8"
            @click="selectedRange = 'week'"
          >
            <q-icon left size="xs" name="fa fa-calendar-week" />
            semaine
            <q-tooltip class="text-subtitle2">
              Rapport de cette semaine
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 q-px-sm">
          <q-btn
            class="q-mx-sm full-width"
            color="purple"
            @click="selectedRange = 'month'"
          >
            <q-icon left size="xs" name="fa fa-calendar-days" />
            mois
            <q-tooltip class="text-subtitle2"> Rapport de ce mois </q-tooltip>
          </q-btn>
        </div>
      </div>

      <PdfGenerator
        :title="`liste_${selectedList}_${new Date().toLocaleDateString()}`"
      >
        <template #content>
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
            <q-toolbar-title class="text-center">
              Liste de {{ selectedList }}s
            </q-toolbar-title>
          </q-toolbar>

          <q-card flat>
            <div class="q-py-md">
              <q-table
                v-model:pagination="pagination"
                :rows-per-page-options="[0]"
                flat
                bordered
                :rows="currentSelectionRows"
                :hide-pagination="true"
                hide-bottom
                :columns="columns"
              >
              </q-table>
            </div>
          </q-card>
        </template>
      </PdfGenerator>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import axios from "axios";
import PdfGenerator from "./PdfGenerator.vue";
import { ref, onMounted, inject, computed, watchEffect } from "vue";
import { isToday, isThisWeek, isThisMonth } from "date-fns";

const emits = defineEmits(["back"]);
const token = inject("token");
const selectedList = ref("location");
const api = inject("api");
const $q = useQuasar();
const endpoints = [
  api + "hotel/locations/",
  api + "hotel/depenses/",
  api + "hotel/chambres/",
  api + "accounts/clients/",
];
const locations = ref([]);
const depenses = ref([]);
const chambres = ref([]);
const clients = ref([]);
const todayLocations = ref([]);
const todayDepenses = ref([]);
const thisWeekLocations = ref([]);
const thisWeekDepenses = ref([]);
const thisMonthLocations = ref([]);
const thisMonthDepenses = ref([]);

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
      axios.spread((locationList, depenseList, chambreList, clientList) => {
        locations.value = locationList.data;
        depenses.value = depenseList.data;
        chambres.value = chambreList.data;
        clients.value = clientList.data;
        todayLocations.value = locations.value.filter((loc) =>
          isToday(new Date(loc.checkIn))
        );
        thisWeekLocations.value = locations.value.filter((loc) =>
          isThisWeek(new Date(loc.checkIn))
        );
        thisMonthLocations.value = locations.value.filter((loc) =>
          isThisMonth(new Date(loc.checkIn))
        );
        todayDepenses.value = depenses.value.filter((dep) =>
          isToday(new Date(dep.date))
        );
        thisWeekDepenses.value = depenses.value.filter((dep) =>
          isThisWeek(new Date(dep.date))
        );
        thisMonthDepenses.value = depenses.value.filter((dep) =>
          isThisMonth(new Date(dep.date))
        );
      })
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        dialog
          .update({
            title: "Erreur de réseau",
            message:
              "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
            ok: "actualiser",
            progress: false,
            persistent: true,
          })
          .onOk(() => {
            window.location.reload();
          });
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
  return client.name + " " + client.firstname;
}

function roomNumber(id) {
  let room = chambres.value.filter((room) => room.id == id)[0];
  return room.number;
}
const selectedRange = ref("day");

// after selection
const currentSelectionText = ref("Aujourd'hui");
const currentSelectionRows = ref([]);

// tableau
const columns = ref([
  {
    name: "reference",
    required: true,
    label: "reference",
    align: "left",
    field: (row) => row.reference,
    format: (val) => `${val.toUpperCase()}`,
    sortable: true,
  },
  {
    name: "client",
    required: true,
    label: "Client",
    align: "center",
    field: (row) => guestName(row.guest),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "room",
    required: true,
    label: "Chambre",
    align: "center",
    field: (row) => roomNumber(row.room),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "amount",
    required: true,
    label: "Montant",
    align: "center",
    field: (row) => row.totalPrice,
    format: (val) => `${val} FCFA`,
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "status",
    align: "center",
    field: (row) => row.status,
    format: (val) => `${val}`,
    sortable: true,
  },
]);

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

// graphique

watchEffect(() => {
  if (selectedList.value == "location") {
    columns.value = [
      {
        name: "reference",
        required: true,
        label: "reference",
        align: "left",
        field: (row) => row.reference,
        format: (val) => `${val.toUpperCase()}`,
        sortable: true,
      },
      {
        name: "client",
        required: true,
        label: "Client",
        align: "center",
        field: (row) => guestName(row.guest),
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "room",
        required: true,
        label: "Chambre",
        align: "center",
        field: (row) => roomNumber(row.room),
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "amount",
        required: true,
        label: "Montant",
        align: "center",
        field: (row) => row.totalPrice,
        format: (val) => `${val} FCFA`,
        sortable: true,
      },
      {
        name: "status",
        required: true,
        label: "status",
        align: "center",
        field: (row) => row.status,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];
    if (selectedRange.value == "day") {
      currentSelectionText.value = "Aujourd'hui";
      currentSelectionRows.value = todayLocations.value;
    } else if (selectedRange.value == "week") {
      currentSelectionText.value = "Cette Semaine";
      currentSelectionRows.value = thisWeekLocations.value;
    } else if (selectedRange.value == "month") {
      currentSelectionText.value = "Ce mois";

      currentSelectionRows.value = thisMonthLocations.value;
    } else if (selectedRange.value == "all") {
      currentSelectionRows.value = locations.value;
    } else {
      currentSelectionText.value = `Le ${new Date(
        selectedRange.value
      ).toLocaleDateString()}`;
      currentSelectionRows.value = thisMonthLocations.value;
    }
  } else if (selectedList.value == "depense") {
    columns.value = [
      {
        name: "title",
        required: true,
        label: "Titre",
        align: "left",
        field: (row) => row.title,
        format: (val) => `${val.toUpperCase()}`,
        sortable: true,
      },

      {
        name: "date",
        required: true,
        label: "date",
        align: "center",
        field: (row) => new Date(row.date).toLocaleDateString(),
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "amount",
        required: true,
        label: "Montant",
        align: "center",
        field: (row) => row.amount,
        format: (val) => `${val} FCFA`,
        sortable: true,
      },
    ];
    if (selectedRange.value == "day") {
      currentSelectionText.value = "Aujourd'hui";
      currentSelectionRows.value = todayDepenses.value;
    } else if (selectedRange.value == "week") {
      currentSelectionText.value = "Cette Semaine";
      currentSelectionRows.value = thisWeekDepenses.value;
    } else if (selectedRange.value == "month") {
      currentSelectionText.value = "Ce mois";

      currentSelectionRows.value = thisMonthDepenses.value;
    } else if (selectedRange.value == "all") {
      currentSelectionRows.value = depenses.value;
    } else {
      currentSelectionText.value = `Le ${new Date(
        selectedRange.value
      ).toLocaleDateString()}`;
      currentSelectionRows.value = thisMonthDepenses.value;
    }
  }
});
</script>
