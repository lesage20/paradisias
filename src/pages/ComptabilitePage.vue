<template>
  <q-page>
    <q-toolbar>
      <q-toolbar-title> Depenses </q-toolbar-title>
    </q-toolbar>
    <ListTable title="Dépenses" :columns="columns" :items="items" />
  </q-page>
</template>

<script setup>
import ListTable from "../components/ListTable.vue";
import axios from "axios";
import { inject, onMounted, ref } from "vue";

const api = inject("api");
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/depenses/")
    .then((res) => {
      items.value = res.data;
    })
    .catch((err) => {
      console.dir(err);
    });
});

const columns = ref([
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
    required: true,
    label: "Titre",
    align: "center",
    field: (row) => row.title,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "amount",
    required: true,
    label: "Montant",
    align: "center",
    field: (row) => row.amount,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "spent_by",
    required: true,
    label: "Auteur",
    align: "center",
    field: (row) => row.spent_by,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "Date",
    align: "center",
    field: (row) => new Date(row.date).toLocaleDateString(),
    format: (val) => `${val}`,
    sortable: true,
  },
]);
</script>
