<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add">
          <AddFloor @close="add = false"></AddFloor>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ListTable
          :columns="columns"
          :items="items"
          title="Etage"
          @add="add = true"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AddFloor from "src/components/AddFloor.vue";
import BreadCrumb from "src/components/BreadCrumb.vue";
import ListTable from "src/components/ListTable.vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get("http://127.0.0.1:8000/etages/")
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
  { name: "number", label: "Numéro", field: "number", sortable: true },
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
</script>
