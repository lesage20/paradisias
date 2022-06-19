<template>
  <q-page :padding="true">
    <div class="row justify-between desktop-only">
      <div class="col-xs-12 col-sm-6 col-md-5 q-pa-xs">
        <ImportantCard
          title="Revenue"
          color="teal"
          icon="fa fa-dollar-sign fa-bounce"
          :number="revenue"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2 q-pa-xs">
        <ImportantCard
          color="orange-9"
          title="Chambres"
          icon="fa fa-bed"
          :number="chambres.length"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-2 q-pa-xs">
        <ImportantCard
          color="teal"
          title="Clients"
          icon="fa fa-users"
          :number="clients.length"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-xs">
        <ImportantCard
          color="orange-9"
          title="Locations"
          :number="locations.length"
          icon="fa fa-list"
        />
      </div>
    </div>

    <div class="row mobile-only">
      <q-card style="width: 100%" class="q-py-md gradient">
        <div class="row">
          <div class="col-xs-4 text-center">
            <div>
              <q-chip square class="text-h6 text-white" color="transparent">
                {{ locations.length }}
              </q-chip>
            </div>
            Locations
          </div>
          <div class="col-xs-4 text-center">
            <div>
              <q-chip square class="text-h6 text-white" color="transparent">
                600000F
              </q-chip>
            </div>
            Revenue
          </div>
          <div class="col-xs-4 text-center">
            <div>
              <q-chip square class="text-h6 text-white" color="transparent">
                {{ clients.length }}
              </q-chip>
            </div>
            Clients
          </div>
        </div>
      </q-card>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <q-card class="q-my-md">
          <q-item>
            <q-item-section>
              <q-item-label>
                <h2
                  :class="{
                    'q-mt-sm q-mb-none text-h6': true,
                    'text-center': $q.platform.is.mobile,
                  }"
                >
                  <span> Locations </span>
                </h2>
              </q-item-label>
              <q-item-label v-if="$q.platform.is.desktop" caption>
                Cette zone affiche les 5 dernières locations
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                :to="{ name: 'Reservations' }"
                no-caps
                flat
                color="primary"
                class="q-mt-sm"
              >
                Toutes les locations
                <q-icon right name="keyboard_arrow_right"></q-icon>
                <q-tooltip class="text-body1"
                  >Voir toutes les locations</q-tooltip
                >
              </q-btn>
            </q-item-section>
          </q-item>
          <q-list separator>
            <q-item
              v-for="item in locations.slice(0, 5)"
              :key="item.reference"
              class="mobile-only"
            >
              <q-item-section>
                <q-item-label>
                  {{ item.client.name + " " + item.client.firstname }}
                </q-item-label>
                <q-item-section caption class="text-grey">
                  du {{ new Date(item.checkIn).toLocaleDateString() }} au
                  {{ new Date(item.checkOut).toLocaleDateString() }}
                </q-item-section>
              </q-item-section>
              <q-item-section side>
                <q-badge>{{ item.totalPrice }}FCFA</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <q-table
            flat
            hide-bottom
            class="desktop-only"
            :columns="locationColumns"
            :rows="locations"
          >
          </q-table>
        </q-card>
      </div>
    </div>
    <div class="row content-end items-end">
      <div class="col-xs-12 col-sm-12 col-md-8 q-py-sm q-pr-sm">
        <q-card id="chart" class="">
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
                Revenues et dépenses de la semaine
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <apexchart
            type="bar"
            width="100%"
            height="130%"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </q-card>
      </div>
      <div
        class="col-xs-12 col-sm-4 q-py-sm"
        :class="{
          'q-pr-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Chambres </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Rooms' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Toutes les chambres
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les étages </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item
              v-for="chambre in chambres.slice(0, 5)"
              :key="chambre.number"
            >
              <q-item-section>
                <q-item-label>
                  {{ chambre.number }}
                </q-item-label>
                <q-item-label caption class="text-grey">
                  {{ chambre.type_chambre.price }} FCFA
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge size="xs">{{ chambre.type_chambre.name }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <div class="row items-end">
      <div
        class="col-xs-12 col-sm-6 col-md-6 q-py-sm"
        :class="{
          'q-pa-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Type de chambres </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  flat
                  :to="{ name: 'RoomTypes' }"
                  color="primary"
                  no-caps
                >
                  Tous les types
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les types </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-for="t in types_chambre.slice(0, 4)" :key="t.name">
              <q-item-section>
                <q-item-label>
                  {{ t.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ t.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge> {{ t.price }} F </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div
        class="col-xs-12 col-sm-6 col-md-6 q-py-sm"
        :class="{
          'q-pl-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Coupons </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  flat
                  :to="{ name: 'Coupon' }"
                  color="primary"
                  no-caps
                >
                  Tous les coupons
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les coupons </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-for="t in coupons.slice(0, 5)" :key="t.title">
              <q-item-section>
                <q-item-label>
                  {{ t.title }}
                </q-item-label>
                <q-item-label caption>
                  {{ t.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge> {{ t.discount }} % </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <div class="row items-end">
      <div
        :class="{
          'col-xs-12 col-sm-6 col-md-6 q-py-sm': true,
          'q-pr-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Etages </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Floors' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Tous les étages
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les étages </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-for="etage in etages.slice(0, 5)" :key="etage.name">
              <q-item-section>
                <q-item-label>
                  {{ etage.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ etage.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge> étage {{ etage.number }} </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div
        class="col-xs-12 col-sm-6 q-py-sm"
        :class="{
          'q-pl-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Dépenses </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Comptabilite' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Toutes les dépenses
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les dépenses </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-list separator>
              <q-item
                v-for="depense in depenses.slice(0, 5)"
                :key="depense.title"
              >
                <q-item-section>
                  <q-item-label>
                    {{ depense.author.name }} {{ depense.author.firstname }}
                  </q-item-label>
                  <q-item-section caption class="text-grey">
                    {{ depense.title }} le
                    {{ new Date(depense.date).toLocaleDateString() }}
                  </q-item-section>
                </q-item-section>
                <q-item-section side>
                  <q-badge>{{ depense.amount }} FCFA</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-card>
      </div>
    </div>
    <div class="row items-end">
      <div
        class="col-xs-12 col-sm-8 q-py-sm"
        :class="{
          'q-pr-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Employés </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Employees' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Tous les employés
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les employés </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-list separator>
              <q-item
                v-for="item in employes.slice(0, 5)"
                :key="item.name + item.firstname"
              >
                <q-item-section side>
                  <q-avatar size="md" color="teal-7">
                    <q-icon color="white" name="fa fa-user"> </q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ item.name + " " + item.firstname }}
                    </q-item-label>
                    <q-item-label caption class="text-grey">
                      Tel: {{ item.phone }} <br />
                    </q-item-label>
                  </q-item-section>
                </q-item-section>
                <q-item-section side>
                  <q-badge>{{ item.gender }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-card>
      </div>
      <div
        class="col-xs-12 col-sm-4 q-py-sm"
        :class="{
          'q-pl-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Roles </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Employees' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Tous les rôles
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les rôles </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-for="(role, index) in roles.slice(0, 5)" :key="role.name">
              {{ index + 1 }}. {{ role.name }}
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
    <div class="row items-end">
      <div
        class="col-xs-12 col-sm-4 q-py-sm"
        :class="{
          'q-pr-sm': $q.platform.is.desktop,
        }"
      >
        <q-card class="gradient">
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Rapport </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </q-list>
          <q-card-section>
            Vous n'avez pas encore téléchargé le rapport de la journée ? <br />
            Vous pouvez télécharger le rapport de la journée, de la semaine, du
            mois ... <br />
            <br />
            Vous pouvez aussi télécharger la liste des locations, et des
            depenses du jour, de la semaine, du mois ...
            <q-btn
              unelevated
              :to="{ name: 'Reports' }"
              color="primary"
              class="q-mx-lg q-mt-sm full-width"
            >
              <div class="fa-bounce">
                <q-icon size="sm" name="download" left> </q-icon>
                <span> Téléchargé Rapport </span>
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div
        class="col-xs-12 col-sm-8 q-py-sm"
        :class="{
          'q-pl-sm': $q.platform.is.desktop,
        }"
      >
        <q-card>
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label> Clients </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  :to="{ name: 'Guests' }"
                  flat
                  color="primary"
                  no-caps
                >
                  Tous les clients
                  <q-icon right name="keyboard_arrow_right"></q-icon>
                  <q-tooltip> Voir tous les clients </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-list separator>
              <q-item
                v-for="item in clients.slice(0, 5)"
                :key="item.name + item.firstname"
              >
                <q-item-section side>
                  <q-avatar size="lg" color="teal-7">
                    <q-icon color="white" name="fa fa-user"> </q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ item.name + " " + item.firstname }}
                    </q-item-label>
                    <q-item-label caption class="text-grey">
                      Tel: {{ item.phone }} <br />
                      id: {{ item.idNumber }}
                    </q-item-label>
                  </q-item-section>
                </q-item-section>
                <q-item-section side>
                  <q-badge>{{ item.gender }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watchEffect, inject } from "vue";
import ImportantCard from "src/components/ImportantCard.vue";
import ReportChart from "src/components/ReportChart.vue";
import { QSpinnerIos, useQuasar } from "quasar";
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
const series = ref([
  { name: "Revenues", data: [0, 0, 0, 0, 0, 0, 0], color: "#30BFBF" },
  { name: "Dépenses", data: [0, 0, 0, 0, 0, 0, 0], color: "#f67" },
]);

// variable dont la valeur se trouve dans la bd
const locations = ref([]);
const depenses = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const etages = ref([]);
const coupons = ref([]);
const clients = ref([]);
const profiles = ref([]);
const employes = ref([]);
const roles = ref([]);

// variable calculée des precedentes variables
const revenue = ref(0);
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

const endpoints = [
  api + "hotel/locations/",
  api + "hotel/depenses/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "hotel/etages/",
  api + "hotel/coupons/",
  api + "accounts/clients/",
  api + "accounts/profiles/",
  api + "accounts/groups/",
  api + "accounts/employes/",
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
      (
        locationList,
        depenseList,
        chambreList,
        types,
        etageList,
        couponList,
        clientsList,
        profileList,
        roleList,
        employeList
      ) => {
        types_chambre.value = types.data;
        chambres.value = chambreList.data;
        locations.value = locationList.data;
        clients.value = clientsList.data;
        etages.value = etageList.data;
        coupons.value = couponList.data;
        depenses.value = depenseList.data;
        roles.value = roleList.data;
        profiles.value = profileList.data;
        employes.value = employeList.data;
        depenses.value.forEach((el) => {
          if (isThisWeek(new Date(el.date))) {
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
          series.value[1].data = [
            monDep.value,
            tueDep.value,
            wedDep.value,
            thuDep.value,
            friDep.value,
            satDep.value,
            sunDep.value,
          ];
          el.author = profiles.value.filter(
            (profile) => (profile.id = el.spent_by)
          )[0];
        });

        chambres.value.forEach((el) => {
          el.etage = etages.value.filter((etage) => (etage.id = el.floor))[0];
          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.type)
          )[0];
        });
        locations.value.forEach((el) => {
          revenue.value += el.totalPrice;
          el.chambre = chambres.value.filter(
            (chambre) => (chambre.id = el.room)
          )[0];
          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.chambre.type)
          )[0];
          el.client = clients.value.filter(
            (client) => client.id == el.guest
          )[0];

          if (isThisWeek(new Date(el.checkIn))) {
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
        });
        series.value[0].data = [
          monRev.value,
          tueRev.value,
          wedRev.value,
          thuRev.value,
          friRev.value,
          satRev.value,
          sunRev.value,
        ];
        dialog.hide();
      }
    )
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

watchEffect(() => {});

var colorPalette = ["#00D8B6", "#008FFB", "#FEB019", "#FF4560", "#775DD0"];
var optionsBar = {
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: "dark",
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
        colors: "#fff",
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
const locationColumns = [
  {
    name: "reference",
    label: "Référence",
    field: "reference",
    format: (val) => val.toUpperCase(),
    sortable: true,
    align: "left",
  },
  {
    name: "client",
    label: "Client",
    field: (row) => row.client.name + " " + row.client.firstname,
    sortable: true,
    align: "left",
  },
  {
    name: "chambre",
    label: "Chambre",
    field: (row) => row.chambre.number,
    sortable: true,
    align: "left",
  },
  {
    name: "prix",
    label: "Prix Total",
    field: (row) => row.totalPrice,
    sortable: true,
    align: "left",
  },
  {
    name: "statut",
    label: "Statut",
    field: (row) => row.status,
    sortable: true,
    align: "left",
  },
];
</script>
<style>
.gradient {
  background: linear-gradient(to right, teal 25%, rgb(47, 163, 163));
  color: white;
}
.blue-gradient {
  background: #00b4db; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #0083b0,
    #00b4db
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #186db6,
    #00b4db
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;
}
</style>
