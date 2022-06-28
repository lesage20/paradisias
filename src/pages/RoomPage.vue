<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddRoom @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          :items="items"
          title="Chambres"
          @add="add = true"
          @delete="deleteRoom"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de chambres </q-toolbar-title>
          <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
        </q-toolbar>
        <q-list separator>
          <q-item v-for="item in items" :key="item.number">
            <q-item-section>
              <q-item-label>
                {{ item.number }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                etage: {{ item.etage.number }} &bullet; prix:
                {{ item.type_chambre.price }} FCFA
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge size="xs">{{ item.type_chambre.name }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddRoom from "src/components/AddRoom.vue";
import ListTable from "src/components/ListTable.vue";
import { ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
const types_chambre = ref([]);
const etages = ref([]);
const endpoints = [
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "hotel/etages/",
];
function getData() {
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
      axios.spread((chambres, types, floors) => {
        types_chambre.value = types.data;
        etages.value = floors.data;
        items.value = chambres.data;
        items.value.forEach((el) => {
          el.etage = etages.value.filter((etage) => (etage.id = el.floor))[0];
          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.type)
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
            html: true,
          });
        }
      }
    });
}
onMounted(getData);
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
    name: "number",
    align: "center",
    label: "Numéro",
    field: "number",
    sortable: true,
  },
  {
    name: "type",
    align: "center",
    label: "Type de Chambre",
    field: (row) => row.type_chambre.name,
    sortable: true,
  },
  {
    name: "floor",
    align: "center",
    label: "Etage",
    field: (row) => row.etage.number,
    sortable: true,
  },
  {
    name: "price",
    align: "center",
    label: "Prix",
    field: (row) => row.type_chambre.price,
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
const roomToDelete = ref("");
function deleteRoom(room) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> la chambre de numéro ${room.number} </b> de la liste de chambre ? <br/>  <strong class="text-negative"> Toutes les locations liées a cette chambre seront supprimées. </strong> <br/>
    Veuillez entrer chambre suivi du numero de la chambre pour supprimer la chambre`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
    prompt: {
      placeholder: "supprimer chambre " + room.number,
      hint:
        "copier " +
        "'chambre " +
        room.number +
        "' dans ce champs pour supprimer",
      model: roomToDelete,
      outlined: true,
      dense: false,
    },
  }).onOk(() => {
    if (roomToDelete.value !== "chambre " + room.number) {
      $q.notify(
        "Vous ne pouvez pas supprimer cette chambre tant que vous n'avez pas entrer la phrase correcte"
      );
    } else {
      del(room.id);
    }
  });
}
function del(id) {
  axios
    .delete(api + "hotel/chambres/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      $q.notify("Chambre supprimé avec suuccès");
      getData();
    });
}
</script>
