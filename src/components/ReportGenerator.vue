<template>
  <q-card class="q-pa-lg">
    <q-toolbar class="q-mb-lg desktop-only">
      <q-btn round flat icon="fa fa-arrow-left" @click="emits('back')"></q-btn>
      <q-space></q-space>

      <q-btn icon="event" label="date" class="q-mx-sm" color="blue-8">
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="updateProxy"
        >
          <q-date v-model="selectedRange">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn v-close-popup label="Cancel" color="primary" flat />
              <q-btn
                v-close-popup
                label="OK"
                color="primary"
                flat
                @click="save"
              />
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
        jour
        <q-tooltip class="text-subtitle2"> Rapport d'aujourdui </q-tooltip>
      </q-btn>
      <q-btn class="q-mx-sm" color="orange-8" @click="selectedRange = 'week'">
        <q-icon left size="xs" name="fa fa-calendar-week" />
        semaine
        <q-tooltip class="text-subtitle2"> Rapport de cette semaine </q-tooltip>
      </q-btn>
      <q-btn class="q-mx-sm" color="purple" @click="selectedRange = 'month'">
        <q-icon left size="xs" name="fa fa-calendar-days" />
        mois
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
          <q-btn
            icon="event"
            label="date"
            class="q-mx-sm full-width"
            color="blue-8"
          >
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
              @before-show="updateProxy"
            >
              <q-date v-model="selectedRange">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn v-close-popup label="Cancel" color="primary" flat />
                  <q-btn
                    v-close-popup
                    label="OK"
                    color="primary"
                    flat
                    @click="save"
                  />
                </div>
              </q-date>
            </q-popup-proxy>
            <q-tooltip class="text-subtitle2">
              Choisir une date pour générer son rapport
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-xs-12 q-pa-sm">
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
        <div class="col-xs-12 q-pa-sm">
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
        <div class="col-xs-12 q-pa-sm">
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
    </q-toolbar>

    <PdfGenerator :title="`rapport-${new Date().toLocaleDateString()}`">
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
            <q-toolbar-title class="text-center">
              Rapport {{ selectedRange == "day" ? "d'" : "de" }}
              {{ currentSelectionText }}
            </q-toolbar-title>
          </q-toolbar>
          <q-card flat>
            <q-card-section horizontal>
              <q-card-section id="chart">
                <apexchart
                  type="pie"
                  width="300"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </q-card-section>
              <q-card-section>
                <p>
                  {{ currentSelectionText }} nous avons eu
                  {{ currentSelectionCount }} locations qui ont généré
                  {{ currentSelectionRevenue }} FCFA de revenue brut, avec
                  {{ currentSelectionDepenseCount }} dépense{{
                    currentSelectionDepenseCount > 1 ? "s" : ""
                  }}
                  qui a couté {{ currentSelectionDepenseAmount }} FCFA <br />
                  Ci dessous les tableaux de locations et de depenses
                  {{ selectedRange == "day" ? "d'" : "de" }}
                  {{ currentSelectionText.toLowerCase() }}.
                </p>
              </q-card-section>
            </q-card-section>
          </q-card>
          <q-card flat>
            <div class="q-py-md">
              <q-table
                v-model:pagination="pagination"
                :rows-per-page-options="[0]"
                flat
                bordered
                title="hhhhh"
                :rows="currentSelectionRows"
                :columns="columns"
                :hide-pagination="true"
                hide-bottom
              >
                <template #top>
                  <div class="row justify-center text-center">
                    <div class="col">
                      <p class="text-center text-subtitle1">
                        Tableau récapitulatif des locations de ce jour
                      </p>
                    </div>
                  </div>
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
import PdfGenerator from "src/components/PdfGenerator.vue";
import TitleComponent from "src/components/TitleComponent.vue";
import { ref, onMounted, inject, computed, watchEffect } from "vue";
import { isToday, isThisWeek, isThisMonth } from "date-fns";

const emits = defineEmits(["back"]);
const token = inject("token");
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
const currentSelectionRevenue = ref(0);
const currentSelectionCount = ref(0);
const currentSelectionDepenseCount = ref(0);
const currentSelectionDepenseAmount = ref(0);
const currentSelectionRows = ref([]);

// tableau
const columns = [
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
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

// graphique
const series = ref([
  currentSelectionDepenseAmount.value,
  currentSelectionRevenue.value,
]);

watchEffect(() => {
  currentSelectionDepenseAmount.value = 0;
  currentSelectionRevenue.value = 0;

  if (selectedRange.value == "day") {
    currentSelectionText.value = "Aujourd'hui";
    currentSelectionCount.value = todayLocations.value.length;
    currentSelectionDepenseCount.value = todayDepenses.value.length;
    todayDepenses.value.forEach((el) => {
      currentSelectionDepenseAmount.value += el.amount;
    });
    todayLocations.value.forEach((el) => {
      currentSelectionRevenue.value += el.totalPrice;
    });
    currentSelectionRows.value = todayLocations.value;
  } else if (selectedRange.value == "week") {
    currentSelectionText.value = "Cette Semaine";
    currentSelectionCount.value = thisWeekLocations.value.length;
    currentSelectionDepenseCount.value = thisWeekDepenses.value.length;
    thisWeekDepenses.value.forEach((el) => {
      currentSelectionDepenseAmount.value += el.amount;
    });
    thisWeekLocations.value.forEach((el) => {
      currentSelectionRevenue.value += el.totalPrice;
    });
    currentSelectionRows.value = thisWeekLocations.value;
  } else if (selectedRange.value == "month") {
    currentSelectionText.value = "Ce mois";
    currentSelectionCount.value = thisMonthLocations.value.length;
    currentSelectionDepenseCount.value = thisMonthDepenses.value.length;

    thisMonthDepenses.value.forEach((el) => {
      currentSelectionDepenseAmount.value += el.amount;
    });
    thisMonthLocations.value.forEach((el) => {
      currentSelectionRevenue.value += el.totalPrice;
    });
    currentSelectionRows.value = thisMonthLocations.value;
  } else {
    currentSelectionText.value = `Le ${new Date(
      selectedRange.value
    ).toLocaleDateString()}`;
    currentSelectionRows.value = thisMonthLocations.value;
  }
  series.value = [
    currentSelectionDepenseAmount.value,
    currentSelectionRevenue.value,
  ];
});
const chartOptions = {
  chart: {
    width: 380,
    type: "pie",
  },
  labels: ["Depenses", "Revenue"],
  responsive: [
    {
      breakpoint: 450,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};
</script>
