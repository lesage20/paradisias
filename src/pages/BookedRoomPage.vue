<template>
  <q-page padding>
    <p class="text-h5">Chambres Occupées</p>
    <div v-if="bookings.length" class="row">
      <div v-for="item in bookings" :key="item.reference" class="col-xs-12 col-md-4 q-pa-sm">
        <q-card bordered class="my-card q-py-md">
          <q-card-section class="q-pb-none">
            <q-item>
              <q-item-section avatar>
                <q-avatar icon="bed" class="bg-grey-3"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold text-h6">
                  {{ item.room_.number }}
                </q-item-label>
                <q-item-label caption>
                  Chambre
                </q-item-label>

              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-avatar icon="attach_money" class="bg-grey-3"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Prix
                </q-item-label>
                <q-item-label caption>
                  {{ item.totalPrice }} FCFA
                </q-item-label>


              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar icon="person" class="bg-grey-3"></q-avatar>

              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Client
                </q-item-label>
                <q-item-label caption>
                  <span>
                    {{ item.client.name }} {{ item.client.firstname }}
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar icon="alarm" class="bg-grey-3"></q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  Période
                </q-item-label>
                <q-item-label caption>
                  <span class="text-">
                    {{ new Date(item.checkIn).toLocaleDateString("fr") }} -
                    {{ new Date(item.checkOut).toLocaleDateString("fr") }}
                  </span>
                </q-item-label>


              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar icon="timer" class="bg-pink-1 text-red-8"></q-avatar>

              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <div v-if="isAfter(new Date(), new Date(item.checkIn))">
                    <CountDown class="text-body1" :date="item.checkOut" />
                  </div>
                  <div v-else>
                    Réservation
                  </div>
                </q-item-label>
                <q-item-label caption>
                  Temps restant
                </q-item-label>

              </q-item-section>
            </q-item>
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
import { useRouter } from "vue-router";

const router = useRouter()
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
      axios.spread((getLocations, getRooms, getClients) => {
        console.log(getLocations);
        getLocations.data.forEach((el) => {
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
        // dialog
        //   .update({
        //     title: "Erreur de réseau",
        //     message:
        //       "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
        //     ok: "actualiser",
        //     progress: false,
        //     persistent: true,
        //   })
        //   .onOk(() => {
        //     window.location.reload();
        //   });
      } else {
        if (err.response.status == "401") {
          router.push({ name: "Login" });//
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
