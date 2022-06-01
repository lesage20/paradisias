<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add">
          <AddCoupon @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ListTable
          :columns="columns"
          :items="items"
          title="Coupons"
          @add="add = true"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddCoupon from "src/components/AddCoupon.vue";
import ListTable from "src/components/ListTable.vue";
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get("http://127.0.0.1:8000/coupons/")
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
    name: "title",
    align: "center",
    label: "Titre",
    field: "title",
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
    name: "discount",
    label: "Réduction (%)",
    field: "discount",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
  },
];
</script>
