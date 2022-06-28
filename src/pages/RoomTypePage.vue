<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddRoomType @close="add = false"></AddRoomType>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          title="Type de Chambre"
          :items="items"
          @add="add = true"
          @delete="deleteRomType"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Types de chambre </q-toolbar-title>
          <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
        </q-toolbar>
        <q-list separator>
          <q-item v-for="item in items" :key="item.name">
            <q-item-section>
              <q-item-label>
                {{ item.name }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                {{ item.description }}
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge size="xs">{{ item.price }}FCFA</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import AddRoomType from "src/components/AddRoomType.vue";
import ListTable from "src/components/ListTable.vue";
import { useQuasar } from "quasar";
import axios from "axios";

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
function getData() {
  axios
    .get(api + "hotel/types_chambre/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => (items.value = [...res.data]))
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
onMounted(getData);
const add = ref(false);
const columns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "center",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    align: "center",
    label: "Nom",
    field: "name",
    sortable: true,
  },
  {
    name: "numberAdult",
    label: "Nbre Adultes",
    field: "numberAdult",
    align: "center",
    sortable: true,
  },
  {
    name: "numberChildren",
    label: "Nbre enfants",
    field: "numberChildren",
    align: "center",
    sortable: true,
  },

  { name: "price", label: "Prix (FCFA)", field: "price", sortable: true },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
const typeToDelete = ref("");
function deleteRomType(type) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> ${type.name} </b> de la liste des types de chambre? <br/>  <strong class="text-negative"> Toutes les chambres et  locations liées aux chambres de ce type de  chambre seront supprimées. </strong> <br/>
    Veuillez entrer type suivi du type de chambre pour supprimer le type de chambre`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
    prompt: {
      placeholder: "supprimer type " + type.name,
      hint:
        "copier " + "'type " + type.name + "' dans ce champs pour supprimer",
      model: typeToDelete,
      outlined: true,
      dense: false,
    },
  }).onOk(() => {
    if (typeToDelete.value !== "type " + type.name) {
      $q.notify(
        "Vous ne pouvez pas supprimer cet type de chambre tant que vous n'avez pas entrer la phrase correcte"
      );
    } else {
      del(type.id);
    }
  });
}
function del(id) {
  axios
    .delete(api + "hotel/types_chambre/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      $q.notify("Type de chambre supprimé avec suuccès");
      getData();
    });
}
</script>
