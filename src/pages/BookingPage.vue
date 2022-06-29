<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile" persistent>
          <AddBooking @saved="created" @close="add = false" />
          {{ $q.platform.is.desktop }}
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          :items="items"
          title="Reservations"
          @add="add = true"
          @delete="deleteLocation"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de locations </q-toolbar-title>
          <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
        </q-toolbar>
        <q-list separator>
          <q-item v-for="item in items" :key="item.reference">
            <q-item-section>
              <q-item-label>
                {{ item.chambre.number }} loué par
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
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
const AddBooking = defineAsyncComponent(() =>
  import("src/components/AddBooking.vue")
);
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const token = inject("token");
const api = inject("api");

const $q = useQuasar();
const items = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const clients = ref([]);
const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "accounts/clients/",
];
function getDatas() {
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
      axios.spread((locations, chambresData, types, clientsData) => {
        types_chambre.value = types.data;
        chambres.value = chambresData.data;
        items.value = locations.data;
        clients.value = clientsData.data;
        items.value.forEach((el) => {
          el.chambre = chambres.value.filter(
            (chambre) => chambre.id == el.room
          )[0];

          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.chambre.type)
          )[0];
          el.client = clients.value.filter(
            (client) => client.id == el.guest
          )[0];
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
}
onMounted(getDatas);

const add = ref(false);
const columns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "reference",
    align: "center",
    label: "Reference",
    field: "reference",
    format: (val) => `${val.toUpperCase()}`,
    sortable: true,
  },
  {
    name: "client",
    align: "center",
    label: "Client",
    field: (row) => row.client,
    format: (val) => `${val.name.toUpperCase()} ${val.firstname}`,
    sortable: true,
  },
  {
    name: "roomType",
    align: "center",
    label: "Type Chambre",
    field: (row) => row.type_chambre.name,
    format: (val) => `${val.toUpperCase()}`,
    sortable: true,
  },
  {
    name: "room",
    align: "center",
    label: "Chambre",
    field: (row) => row.chambre.number,
    sortable: true,
  },
  {
    name: "checkIn",
    align: "center",
    label: "Date Ent",
    field: (row) => new Date(row.checkIn).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "checkOut",
    align: "center",
    label: "Date Sort",
    field: (row) => new Date(row.checkOut).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "Prix",
    align: "center",
    label: "Prix",
    field: (row) => row.totalPrice,
    format: (val) => `${val}F`,
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
function created() {
  getDatas();
  add.value = false;
}
function deleteLocation(location) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer la location de la  <b> chambre ${
      location.chambre.number + " qui a couté " + location.totalPrice
    }FCFA </b> de la liste de locations?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  }).onOk(() => {
    del(location.id);
  });
}
function del(id) {
  axios
    .delete(api + "hotel/locations/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      getDatas();
      $q.notify("Location supprimée avec suuccès");
    });
}
</script>
