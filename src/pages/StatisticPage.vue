<template>
  <q-page :padding="true">
    <h2
      :class="{
        'q-px-sm text-subtitle1': true,
        'text-center': $q.platform.is.mobile,
      }"
    >
      Aujourd'hui
    </h2>
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
          color="orange-9"
          icon="fa fa-dollar-sign fa-bounce"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="blue-8"
          title="Chambres louées"
          :number="3"
          icon="fa fa-bed"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="teal"
          title="Clients"
          :number="3"
          icon="fa fa-users"
        />
      </div>
    </div>

    <q-card bordered flat class="q-py-md mobile-only">
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
          'col-xs-12 col-sm-6 col-md-6': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': false,
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
              <q-item-section side>450000F</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Dépense </q-item-label>
              </q-item-section>
              <q-item-section side>5000F</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Locations </q-item-label>
              </q-item-section>
              <q-item-section side>50</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Chambres louées </q-item-label>
              </q-item-section>
              <q-item-section side>50</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> clients </q-item-label>
              </q-item-section>
              <q-item-section side>50</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label> Coupons utilisés </q-item-label>
              </q-item-section>
              <q-item-section side>5</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6 q-pb-sm': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': $q.platform.is.mobile,
        }"
      >
        <q-card id="chart" bordered flat>
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
            :series="chartOptions.series"
          ></apexchart>
        </q-card>
      </div>

      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6 q-py-sm': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': true,
        }"
      >
        <q-card id="chart" bordered flat>
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
          'col-xs-12 col-sm-6 col-md-6 q-py-sm': true,
          'q-px-sm': $q.platform.is.desktop,
          'q-py-sm': true,
        }"
      >
        <q-card id="chart" bordered flat>
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
            type="line"
            width="100%"
            :options="optionsBar"
            :series="optionsBar.series"
          ></apexchart>
        </q-card>
      </div>
    </div>
    <q-footer class="bg-grey-2 text-teal" v-if="$q.platform.is.mobile">
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
import { useQuasar } from "quasar";
import axios from "axios";
import { isThisWeek, isThisMonth, isToday } from "date-fns";

const api = inject("api");

const $q = useQuasar();
const series = ref([]);
const locations = ref([]);
const todayLoc = ref([]);
const weekLoc = ref([]);
const monthLoc = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const clients = ref([]);

const depenses = ref([]);
const todayDep = ref([]);
const weekDep = ref([]);
const monthDep = ref([]);

const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "accounts/clients/",
];
function getAllData() {
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((locationList, chambresList, types, clientsList) => {
      types_chambre.value = types.data;
      chambres.value = chambresList.data;
      locations.value = locationList.data;
      clients.value = clientsList.data;
      locations.value.forEach((el) => {
        el.chambre = chambres.value.filter(
          (chambre) => (chambre.id = el.room)
        )[0];
        el.type_chambre = types_chambre.value.filter(
          (type) => (type.id = el.chambre.type)
        )[0];
        el.client = clients.value.filter((client) => client.id == el.guest)[0];
        if (isToday(new Date(el.checkIn))) {
          todayLoc.value.push(el);
        }
        if (isThisWeek(new Date(el.checkIn))) {
          weekLoc.value.push(el);
        }
        if (isThisMonth(new Date(el.checkIn))) {
          monthLoc.value.push(el);
          series.value.push(el.totalPrice);
        }
      });
    })
  );
}
onMounted(() => {
  getAllData();
});

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
</script>
