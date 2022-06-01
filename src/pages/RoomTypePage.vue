<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add">
          <AddRoomType @close="add = false"></AddRoomType>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ListTable
          :columns="columns"
          title="Type de Chambre"
          :items="items"
          @add="add = true"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AddRoomType from "src/components/AddRoomType.vue";
import ListTable from "src/components/ListTable.vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get("http://127.0.0.1:8000/types_chambre/")
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
</script>
