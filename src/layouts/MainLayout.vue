<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-2 text-teal-7">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Paradisias Hotel </q-toolbar-title>

        <q-btn-dropdown flat dropdown-icon="fa fa-bell">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-grey-8"> Notifications </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="onItemClick">
              <q-item-section avatar>
                <q-avatar icon="folder" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="onItemClick">
              <q-item-section avatar>
                <q-avatar
                  icon="assignment"
                  color="secondary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown flat color="teal-" dense rounded>
          <template #label>
            <div class="row items-center no-wrap">
              <q-avatar color="" size="50px" class="q-ma-none">
                <q-icon color="" size="sm" name="fa fa-user"></q-icon>
              </q-avatar>
            </div>
          </template>
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">Paramètre du compte</div>
              <q-toggle v-model="night" label="Mode Nuit" />
              <q-toggle v-model="bluetooth" label="Bluetooth" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar color="teal-1" size="70px" class="q-mb-sm">
                <q-icon color="teal-8" name="fa fa-user"></q-icon>
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ user.username }}
              </div>

              <q-btn
                v-close-popup
                flat
                color="negative"
                label="Deconnexion"
                size="md"
                no-caps
                @click="logout()"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="text-dark">
      <q-img class="absolute-top gradian" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <div class="row justify-center">
            <div>
              <q-avatar color="teal-3" size="70px" class="q-mb-sm">
                <q-icon color="teal-9" name="fa fa-user"></q-icon>
              </q-avatar>
            </div>
            <div class="text-weight-bold text-grey-2 col-xs-12 text-center">
              {{ user.username }}
            </div>
            <div class="text-white col-xs-12 text-center">
              {{ user.groups[0].name }} à paradisias
            </div>
          </div>
        </div>
      </q-img>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item-label class="text-tea" header> Menu </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <div class="row justify-center q-py-sm q-px-lg">
        <div class="col-xs-12 text-center">
          <BreadCrumb :items="items" />
        </div>
      </div>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, watch, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useLoginStore as store } from "src/stores/login";
import BreadCrumb from "src/components/BreadCrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const night = ref(true);
const linksList = [
  {
    title: "Tableau de bord",
    caption: "Tableau de bord",
    icon: "fas fa-tachometer-alt",
    link: { name: "Dashboard" },
    children: [],
  },
  {
    title: "Structure Hotel",
    caption: "etages,chambres,salles...",
    icon: "fa fa-cog",
    link: "/structure",
    children: [
      {
        link: { name: "Floors" },
        title: "Etages",
      },
      {
        link: { name: "RoomTypes" },
        title: "Type de Chambres",
      },
      {
        link: { name: "Rooms" },
        title: "Chambres",
      },
      {
        link: { name: "Coupon" },
        title: "Coupon de Reduction",
      },
      {
        link: { name: "Housekeep" },
        title: "Nettoyage",
      },
    ],
  },
  {
    title: "Reservations",
    caption: "Commandes ou enregistrement",
    icon: "fas fa-book",
    link: { name: "Reservations" },
  },
  {
    title: "Pièces reservées",
    caption: "chambres et salles reservées",
    icon: "fa fa-home",
    link: { name: "Reserved" },
  },
  {
    title: "Calendrier",
    caption: "disponibilité des pièces",
    icon: "fa fa-calendar",
    link: { name: "Calendar" },
  },
  {
    title: "Invités",
    caption: "gestion des invités",
    icon: "fa fa-user",
    link: { name: "Guests" },
  },
  {
    title: "Administration",
    caption: "gestion des employés",
    icon: "fa fa-users",
    link: "/hr-mgt",
    children: [
      {
        link: { name: "Employees" },
        title: "Employés",
      },
      {
        link: { name: "Comptabilite" },
        title: "Comptabilite",
      },
      {
        link: { name: "Statistics" },
        title: "Statistiques",
      },
    ],
  },
  {
    title: "Rapports",
    caption: "rapports quotidiens, hebdo...",
    icon: "fas fa-file",
    link: { name: "Reports" },
  },
];

let items = ref([]);
const route = useRoute();
const router = useRouter();

items.value = route.matched;
const user = store().user;
watch(route, () => {
  items.value = route.matched;
});
function logout() {
  store().logout();
  router.push({ name: "Login" });
}

const leftDrawerOpen = ref($q.platform.is.desktop);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<style>
:root {
  --animate-duration: 800ms;
  --animate-delay: 0.9s;
}
.gradian {
  background: linear-gradient(to top, teal 20%, rgb(47, 163, 163));
}
</style>
