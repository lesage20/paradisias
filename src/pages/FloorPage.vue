<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddFloor @close="add = false"></AddFloor>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable :columns="columns" :items="items" title="Etage" @add="add = true" @delete="deleteFloor" />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste d'étages </q-toolbar-title>
        </q-toolbar>
        <q-list>
          <q-item v-for="item in items" :key="item.name">
            <q-item-section side avatar>
              <q-avatar color="teal-1">
                <q-icon color="teal" name="apartment"> </q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.name }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                {{ item.description }}
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge size="sm">{{ item.number }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-page-sticky v-if="$q.platform.is.mobile" :offset="[18, 18]">
      <q-btn class="shadow-20" round size="md" icon="add" color="teal-8" @click="add = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const AddFloor = defineAsyncComponent(() =>
  import("src/components/forms/AddFloor.vue")
);
const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
function getData() {
  axios
    .get(api + "hotel/etages/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => (items.value = [...res.data]))
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
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
    name: "description",
    label: "Description",
    field: "description",
    align: "center",
    sortable: true,
  },
  {
    name: "number",
    label: "Numéro",
    field: "number",
    sortable: true,
    align: "center",
  },
  {
    align: "center",
    name: "status",
    label: "Statut",
    field: "status",
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
const floorToDelete = ref("");
function deleteFloor(floor) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> ${floor.name} </b> de la liste d'étage?
    <br/>  <strong class="text-negative"> Toutes les chambres et  locations liées aux chambres de cet étage seront supprimées. </strong> <br/>
    Veuillez entrer étage suivi du numero d'étage  pour supprimer l'étage`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
    prompt: {
      placeholder: "supprimer étage " + floor.number,
      hint:
        "copier " +
        "'étage " +
        floor.number +
        "' dans ce champs pour supprimer",
      model: floorToDelete,
      outlined: true,
      dense: false,
    },
  }).onOk(() => {
    if (floorToDelete.value !== "étage " + floor.number) {
      $q.notify(
        "Vous ne pouvez pas supprimer cet étage tant que vous n'avez pas entrer la phrase correcte"
      );
    } else {
      del(floor.id);
    }
  });
}
function del(id) {
  axios
    .delete(api + "hotel/etages/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      $q.notify("Etage supprimé avec suuccès");
      getData();
    });
}
</script>
