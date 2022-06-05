<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add">
          <AddRoom @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ListTable
          :columns="columns"
          :items="items"
          title="Chambres"
          @add="add = true"
        />
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

const api = inject("api");
const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/chambres/")
    .then((res) => (items.value = [...res.data]))
    .catch((err) => {
      console.dir(err);
      $q.notify("Une erreur s'est produite durant la recuperation des données");
    });
});
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
    field: "type",
    sortable: true,
  },
  {
    name: "floor",
    align: "center",
    label: "Etage",
    field: "floor",
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
</script>
