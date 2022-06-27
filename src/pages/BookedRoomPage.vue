<template>
  <q-page padding>
    <p class="text-h5">Chambres Occupées</p>
    <div v-if="bookings.length" class="row">
      <div
        v-for="item in bookings"
        :key="item.reference"
        class="col-xs-12 col-md-4 q-pa-sm"
      >
        <q-card dark bordered class="bg-grey-9 my-card">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-center">{{ item.room_.number }}</div>
            <q-separator dark class="q-mb-md" />
          </q-card-section>
          <q-card-section>
            <div class="text-body2 text-center">
              Occupée par <br />
              <span class="text-green">
                {{ item.client.name }} {{ item.client.firstname }}
              </span>
            </div>
            <div class="q-pt-md text-center">
              Cette chambre sera libre dans: <br />
              <CountDown :date="item.checkOut" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { isWithinInterval, formatDistanceToNow } from "date-fns";
import CountDown from "../components/CountDown.vue";

const api = inject("api");
const token = inject("token");

const $q = useQuasar();
const bookings = ref([]);
const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "accounts/clients/",
];
onMounted(() => {
  axios
    .all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(
      axios.spread((getBookings, getRooms, getClients) => {
        console.log(getBookings);
        getBookings.data.forEach((el) => {
          if (
            isWithinInterval(new Date(), {
              start: new Date(el.checkIn),
              end: new Date(el.checkOut),
            })
          ) {
            bookings.value.push(el);
          }
        });
        bookings.value.forEach((el) => {
          el.room_ = getRooms.data.filter((room) => room.id === el.room)[0];
          el.client = getClients.data.filter(
            (client) => client.id === el.guest
          )[0];
        });
      })
    )
    .catch((err) => {
      console.dir(err);
    });
});
</script>
