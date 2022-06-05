<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" persistent>
          <AddBooking @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ListTable
          :columns="columns"
          :items="items"
          title="Reservations"
          @add="add = true"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddBooking from "src/components/AddBooking.vue";
import ListTable from "src/components/ListTable.vue";
import { ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const api = inject("api");

const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/locations/")
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
    name: "reference",
    align: "center",
    label: "Numéro",
    field: "reference",
    sortable: true,
  },
  {
    name: "roomType",
    align: "center",
    label: "Type de Chambre",
    field: "roomType",
    sortable: true,
  },
  {
    name: "room",
    align: "center",
    label: "Chambre",
    field: "room",
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
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
</script>
