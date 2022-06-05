<template>
  <q-page padding>
    <!-- <q-date class="full-width" calendar></q-date> -->
    <q-card bordered flat>
      <RoomValidity :events="events"></RoomValidity>
    </q-card>
    <div class="q-py-md"></div>
  </q-page>
</template>
<script setup>
import {
  parsed,
  parseDate,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import axios from "axios";
import RoomValidity from "src/components/RoomValidity.vue";
import { inject, onMounted, ref } from "vue";

const api = inject("api");
const rooms = ref([]);
const bookings = ref([]);
const endpoints = [api + "hotel/chambres", api + "hotel/locations/"];
const bgcolors = ["orange", "teal", "purple", "blue", "red"];
onMounted(() => {
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((roomsData, bookingsData) => {
      rooms.value = roomsData.data;
      bookings.value = bookingsData.data;
      bookings.value.forEach((el) => {
        const evt = {};
        evt.id = el.id;
        evt.title = rooms.value.filter((room) => room.id == el.room)[0].number;
        evt.start = el.checkIn.split("T")[0];
        evt.time = el.checkIn.split("T")[1].replace("Z", "");
        evt.end = el.checkOut.split("T")[0];
        evt.bgcolor = bgcolors[getRandomInt(bgcolors.length - 1)];
        evt.details = `${evt.title} sera occupé du ${new Date(
          evt.start
        ).toLocaleDateString()} à ${evt.time} jusqu'au ${new Date(
          evt.end
        ).toLocaleDateString()}`;
        events.value.push(evt);
      });
    })
  );
});
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const events = ref([]);
// {
//   id: 1,
//   title: "1st of the Month",
//   details: "Everything is funny as long as it is happening to someone else",
//   start: getCurrentDay(1),
//   end: getCurrentDay(1),
//   bgcolor: "orange",
// },
// {
//   id: 2,
//   title: "Sisters Birthday",
//   details: "Buy a nice present",
//   start: getCurrentDay(4),
//   end: getCurrentDay(4),
//   bgcolor: "green",
//   icon: "fas fa-birthday-cake",
// },
// {
//   id: 3,
//   title: "Meeting",
//   details: "Time to pitch my idea to the company",
//   start: getCurrentDay(10),
//   end: getCurrentDay(10),
//   time: "10:00",
//   duration: 120,
//   bgcolor: "red",
//   icon: "fas fa-handshake",
// },
// {
//   id: 4,
//   title: "Lunch",
//   details: "Company is paying!",
//   start: getCurrentDay(10),
//   end: getCurrentDay(10),
//   time: "11:30",
//   duration: 90,
//   bgcolor: "teal",
//   icon: "fas fa-hamburger",
// },
// {
//   id: 5,
//   title: "Visit mom",
//   details: "Always a nice chat with mom",
//   start: getCurrentDay(20),
//   end: getCurrentDay(20),
//   time: "17:00",
//   duration: 90,
//   bgcolor: "grey",
//   icon: "fas fa-car",
// },
// {
//   id: 6,
//   title: "Conference",
//   details: "Teaching Javascript 101",
//   start: getCurrentDay(22),
//   end: getCurrentDay(22),
//   time: "08:00",
//   duration: 540,
//   bgcolor: "blue",
//   icon: "fas fa-chalkboard-teacher",
// },
// {
//   id: 7,
//   title: "Girlfriend",
//   details: "Meet GF for dinner at Swanky Restaurant",
//   start: getCurrentDay(22),
//   end: getCurrentDay(22),
//   time: "19:00",
//   duration: 180,
//   bgcolor: "teal",
//   icon: "fas fa-utensils",
// },
// {
//   id: 8,
//   title: "Rowing",
//   details: "Stay in shape!",
//   start: getCurrentDay(27),
//   end: getCurrentDay(28),
//   bgcolor: "purple",
//   icon: "rowing",
// },
// {
//   id: 9,
//   title: "Fishing",
//   details: "Time for some weekend R&R",
//   start: getCurrentDay(22),
//   end: getCurrentDay(29),
//   bgcolor: "purple",
//   icon: "fas fa-fish",
// },
// {
//   id: 10,
//   title: "Vacation",
//   details:
//     "Trails and hikes, going camping! Don't forget to bring bear spray!",
//   start: getCurrentDay(22),
//   end: getCurrentDay(29),
//   bgcolor: "teal",
//   icon: "fas fa-plane",
// },
// ]);
</script>
