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
              Cette chambre est/sera occupée par
              <span class="text-green">
                {{ item.client.name }} {{ item.client.firstname }}
              </span>

              du
              <span class="text-">
                {{ new Date(item.checkIn).toLocaleDateString() }}
                au {{ new Date(item.checkOut).toLocaleDateString() }} à
                {{ new Date(item.checkOut).toLocaleTimeString() }}
              </span>
            </div>
            <div
              v-if="isAfter(new Date(), new Date(item.checkIn))"
              class="q-pt-md text-center"
            >
              Cette chambre sera libre dans: <br />
              <CountDown :date="item.checkOut" />
            </div>
            <div v-else class="q-pt-md text-center">
              Cette location n'a pas encore débutée <br />
              <p class="text-h4 text-red q-pa-none q-ma-none">Réservation</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { isWithinInterval, isAfter } from "date-fns";

const CountDown = defineAsyncComponent(() =>
  import("src/components/CountDown.vue")
);
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
      axios.spread((getBookings, getRooms, getClients) => {
        console.log(getBookings);
        getBookings.data.forEach((el) => {
          if (isAfter(new Date(el.checkOut), new Date())) {
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
      let dialog = $q.dialog({});
      if (!Boolean(err.response) && err.message == "Network error") {
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
</script>
