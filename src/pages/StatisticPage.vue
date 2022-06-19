<template>
  <q-page :padding="true">
    <div class="row">
      <div class="col">
        <h2
          :class="{
            'q-px-sm text-subtitle1': true,
            'text-center': $q.platform.is.mobile,
          }"
        >
          Aujourd'hui
        </h2>
      </div>
      <div class="col-3 desktop-only">
        <q-select
          dense
          label="Choisir période"
          :options="['jour', 'semaine', 'mois']"
        >
        </q-select>
      </div>
    </div>

    <div class="row desktop-only">
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="teal"
          title="Locations"
          :number="todayLoc.length"
          icon="fa fa-list"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          title="Revenue"
          :number="todayRev"
          color="orange-9"
          icon="fa fa-dollar-sign fa-bounce"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="blue-8"
          title="Nouveau client"
          :number="todayClient"
          icon="fa fa-users"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="red-7"
          title="Dépensés"
          :number="todayDep"
          icon="fa fa-dollar-sign"
        />
      </div>
    </div>

    <q-card class="q-py-md mobile-only">
      <div class="row">
        <div class="col-xs-4 text-center">
          <div style="position: relative">
            <q-badge color="blue" class="q-mx-xs" outline>5</q-badge>
          </div>
          <p>Commandes</p>
        </div>
        <div class="col-xs-4 text-center">
          <div style="position: relative">
            <q-badge outline color="teal">600000 fcfa</q-badge>
          </div>
          <p>Revenue</p>
        </div>
        <div class="col-xs-4 text-center">
          <div>
            <q-badge outline class="q-mx-xs" color="teal">6</q-badge>
          </div>
          <p>Clients</p>
        </div>
      </div>
    </q-card>

    <h2
      :class="{
        'q-px-sm text-subtitle1': true,
        'text-center': $q.platform.is.mobile,
      }"
    >
      Cette Semaine
    </h2>
    <div class="q-py-sm row">
      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6 q-pb-sm': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': $q.platform.is.mobile,
        }"
      >
        <q-card id="chart">
          <q-item>
            <q-item-section
              :class="{
                'text-body2 text-center': true,
                'text-center': true,
              }"
            >
              <q-item-label
                :class="{
                  'text-body2 text-center': true,
                  'text-center': true,
                }"
              >
                Revenue par jour
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <apexchart
            type="bar"
            width="100%"
            :options="chartOptions"
            :series="daySeries"
          ></apexchart>
        </q-card>
      </div>

      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': false,
        }"
      >
        <q-card id="chart">
          <q-toolbar>
            <q-toolbar-title
              :class="{
                'text-body2': true,
                'text-center': $q.platform.is.mobile,
              }"
            >
              Type de chambre les plus loué
            </q-toolbar-title>
          </q-toolbar>
          <apexchart
            type="bar"
            width="100%"
            :options="optionsBar"
            :series="optionsBar.series"
          ></apexchart>
        </q-card>
      </div>
      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': true,
        }"
      >
        <q-card>
          <q-list>
            <q-item>
              <q-item-section class="text-center">
                <q-item-label> resumé de la semaine </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>

            <q-item v-if="$q.platform.is.desktop" dense>
              <q-item-section>
                <q-item-label> </q-item-label>
              </q-item-section>
              <q-item-section side></q-item-section>
            </q-item>
          </q-list>
          <q-list separator>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Revenue </q-item-label>
              </q-item-section>
              <q-item-section side>{{ weekRev }}F</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Dépense </q-item-label>
              </q-item-section>
              <q-item-section side>{{ weekDep }}F</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Locations </q-item-label>
              </q-item-section>
              <q-item-section side>{{ weekLoc }}</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> clients </q-item-label>
              </q-item-section>
              <q-item-section side>{{ weekClient }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section clickable>
                <q-item-label> Coupons utilisés </q-item-label>
              </q-item-section>
              <q-item-section side>5</q-item-section>
            </q-item>
            <q-item v-if="$q.platform.is.desktop" dense>
              <q-item-section>
                <q-item-label> </q-item-label>
              </q-item-section>
              <q-item-section side></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6 q-py-sm': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': true,
        }"
      >
        <q-card id="chart">
          <q-toolbar>
            <q-toolbar-title
              :class="{
                'text-body2': true,
                'text-center': $q.platform.is.mobile,
              }"
            >
              Nouveau client par jour
            </q-toolbar-title>
          </q-toolbar>
          <apexchart
            type="area"
            width="100%"
            :options="lineOptions"
            :series="seriesClient"
          ></apexchart>
        </q-card>
      </div>
    </div>
    <q-footer v-if="$q.platform.is.mobile" class="bg-grey-2 text-teal">
      <q-tabs color="teal" class="b">
        <q-tab icon="fa fa-calendar-day">Jour</q-tab>
        <q-tab icon="fa fa-calendar-week">Semaine</q-tab>
        <q-tab icon="fa fa-calendar-days">mois</q-tab>
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watchEffect, inject } from "vue";
import ImportantCard from "src/components/ImportantCard.vue";
import ReportChart from "src/components/ReportChart.vue";
import { useQuasar, QSpinnerIos } from "quasar";
import axios from "axios";
import {
  isThisWeek,
  isThisMonth,
  isToday,
  isMonday,
  isTuesday,
  isThursday,
  isWednesday,
  isFriday,
  isSaturday,
  isSunday,
} from "date-fns";
const api = inject("api");

const $q = useQuasar();
const series = ref([]);
const daySeries = ref([
  { name: "Revenues", data: [0, 0, 0, 0, 0, 0, 0], color: "#30BFBF" },
  { name: "Dépenses", data: [0, 0, 0, 0, 0, 0, 0], color: "#f67" },
]);
const seriesClient = ref([
  {
    name: "Clients",
    data: [0, 0, 0, 0, 0, 0, 0],
    color: "#30BFBF",
  },
]);
const locations = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const clients = ref([]);

const depenses = ref([]);

//  jour
const todayLoc = ref([]);
const todayDep = ref(0);
const todayRev = ref(0);
const todayClient = ref(0);

// semaine
const weekLoc = ref(0);
const weekDep = ref(0);
const weekClient = ref(0);
const weekRev = ref(0);
const monRev = ref(0);
const tueRev = ref(0);
const wedRev = ref(0);
const thuRev = ref(0);
const friRev = ref(0);
const satRev = ref(0);
const sunRev = ref(0);
const monDep = ref(0);
const tueDep = ref(0);
const wedDep = ref(0);
const thuDep = ref(0);
const friDep = ref(0);
const satDep = ref(0);
const sunDep = ref(0);
const monClient = ref(0);
const tueClient = ref(0);
const wedClient = ref(0);
const thuClient = ref(0);
const friClient = ref(0);
const satClient = ref(0);
const sunClient = ref(0);

// mois
const monthLoc = ref([]);
const monthDep = ref([]);
const monthRev = ref(0);

const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "hotel/depenses/",
  api + "accounts/clients/",
];
function getAllData() {
  let dialog = $q.dialog({
    title: "Récupération de données",
    persistent: true,
    progress: { spinner: QSpinnerIos, color: "primary" },
    message: "Veuillez patienter pendant que les données se chargent.",
    ok: false,
  });
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread(
      (locationList, chambresList, types, depenseList, clientsList) => {
        types_chambre.value = types.data;
        chambres.value = chambresList.data;
        locations.value = locationList.data;
        clients.value = clientsList.data;
        depenses.value = depenseList.data;
        clients.value.forEach((el) => {
          if (isToday(new Date(el.created_at))) {
            todayClient.value += 1;
          }
          if (isThisWeek(new Date(el.created_at))) {
            weekClient.value += 1;
            monClient.value += isMonday(new Date(el.created_at)) ? 1 : 0;
            tueClient.value += isTuesday(new Date(el.created_at)) ? 1 : 0;
            wedClient.value += isWednesday(new Date(el.created_at)) ? 1 : 0;
            thuClient.value += isThursday(new Date(el.created_at)) ? 1 : 0;
            friClient.value += isFriday(new Date(el.created_at)) ? 1 : 0;
            satClient.value += isSaturday(new Date(el.created_at)) ? 1 : 0;
            sunClient.value += isSunday(new Date(el.created_at)) ? 1 : 0;
          }
        });

        depenses.value.forEach((el) => {
          if (isToday(new Date(el.date))) {
            // todayDep.value.push(el);
            todayDep.value += el.amount;
          }
          if (isThisWeek(new Date(el.date))) {
            weekDep.value += el.amount;
            monDep.value += isMonday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            tueDep.value += isTuesday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            wedDep.value += isWednesday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            thuDep.value += isThursday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            friDep.value += isFriday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            satDep.value += isSaturday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
            sunDep.value += isSunday(new Date(el.date))
              ? parseInt(el.amount)
              : 0;
          }
          daySeries.value[1].data = [
            monDep.value,
            tueDep.value,
            wedDep.value,
            thuDep.value,
            friDep.value,
            satDep.value,
            sunDep.value,
          ];

          if (isThisMonth(new Date(el.date))) {
            monthDep.value.push(el);
            series.value.push(el.totalPrice);
          }
        });
        locations.value.forEach((el) => {
          el.chambre = chambres.value.filter(
            (chambre) => (chambre.id = el.room)
          )[0];
          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.chambre.type)
          )[0];
          el.client = clients.value.filter(
            (client) => client.id == el.guest
          )[0];
          if (isToday(new Date(el.checkIn))) {
            todayLoc.value.push(el);
            todayRev.value += el.totalPrice;
          }
          if (isThisWeek(new Date(el.checkIn))) {
            weekLoc.value += 1;
            weekRev.value += el.totalPrice;
            monRev.value += isMonday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            tueRev.value += isTuesday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            wedRev.value += isWednesday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            thuRev.value += isThursday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            friRev.value += isFriday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            satRev.value += isSaturday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
            sunRev.value += isSunday(new Date(el.checkIn))
              ? parseInt(el.totalPrice)
              : 0;
          }
          if (isThisMonth(new Date(el.checkIn))) {
            monthLoc.value.push(el);
            series.value.push(el.totalPrice);
          }
        });
        daySeries.value[0].data = [
          monRev.value,
          tueRev.value,
          wedRev.value,
          thuRev.value,
          friRev.value,
          satRev.value,
          sunRev.value,
        ];
        seriesClient.value[0].data = [
          monClient.value,
          tueClient.value,
          wedClient.value,
          thuClient.value,
          friClient.value,
          satClient.value,
          sunClient.value,
        ];
        dialog.hide();
      }
    )
  );
}
onMounted(() => {
  getAllData();
});
const roomChartOptions = {
  series: [
    {
      name: "Dépense",
      data: [44000, 55000, 57000, 56000, 61000, 58000, 63000],
      color: "#f67",
    },
    {
      name: "Revenue",
      data: [76000, 85000, 101000, 98000, 87000, 105000, 91000],
      color: "#30BFBF",
    },
  ],
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  yaxis: {},
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " FCFA";
      },
    },
    color: "#000",
  },
};

const chartOptions = {
  series: [
    {
      name: "Dépense",
      data: [44000, 55000, 57000, 56000, 61000, 58000, 63000],
      color: "#f67",
    },
    {
      name: "Revenue",
      data: [76000, 85000, 101000, 98000, 87000, 105000, 91000],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  yaxis: {},
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " FCFA";
      },
    },
  },
};

watchEffect(() => {});

var colorPalette = ["#00D8B6", "#008FFB", "#FEB019", "#FF4560", "#775DD0"];
var optionsBar = {
  dataLabels: {
    enabled: false,
  },
  chart: {
    type: "bar",
    height: 380,
    width: 500,
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
    },
  },
  colors: colorPalette,
  series: [
    {
      name: "Clothing",
      data: [42, 52, 16, 55, 59, 51],
    },
    {
      name: "Food Products",
      data: [6, 12, 4, 7, 5, 3],
    },
  ],
  labels: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  xaxis: {
    labels: {
      show: true,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#78909c",
      },
    },
  },

  responsive: [
    {
      breakpoint: 980,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          show: true,
        },
      },
    },
  ],
};
var lineOptions = {
  chart: {
    type: "area",
    height: 350,
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },

  title: {
    text: "Fundamental Analysis of Stocks",
    align: "left",
  },
  subtitle: {
    text: "Price Movements",
    align: "left",
  },
  labels: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],

  xaxis: {},
  yaxis: {
    opposite: true,
  },
  legend: {
    horizontalAlign: "left",
  },
};
</script>
