<template>
  <q-page :padding="$q.platform.is.desktop">
    <!-- <q-date class="full-width" calendar></q-date> -->
    <q-card class="bg-transparent q-py-sm" flat>
      <RoomValidity class="bg-transparent" :events="events"></RoomValidity>
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
import { useQuasar } from "quasar";
import { inject, onMounted, ref, defineAsyncComponent } from "vue";
const RoomValidity = defineAsyncComponent(() =>
  import("src/components/RoomValidity.vue")
);
const $q = useQuasar();
const token = inject("token");
const api = inject("api");
const rooms = ref([]);
const bookings = ref([]);
const endpoints = [api + "hotel/chambres", api + "hotel/locations/"];
const bgcolors = ["orange", "teal", "purple", "blue", "red"];
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
      axios.spread((roomsData, bookingsData) => {
        rooms.value = roomsData.data;
        bookings.value = bookingsData.data;
        bookings.value.forEach((el) => {
          const evt = {};
          evt.id = el.id;
          evt.title = rooms.value.filter(
            (room) => room.id == el.room
          )[0].number;
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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const events = ref([]);
</script>
