<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog :maximized="$q.platform.is.mobile" v-model="add">
          <AddFloor @close="add = false"></AddFloor>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          :items="items"
          title="Etage"
          @add="add = true"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste d'étages </q-toolbar-title>
          <q-btn label="ajouter" outline @click="add = true" color="teal-8" />
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
              <q-badge size="sm">{{ item.number }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import AddFloor from "src/components/AddFloor.vue";
import BreadCrumb from "src/components/BreadCrumb.vue";
import ListTable from "src/components/ListTable.vue";
import { useQuasar } from "quasar";
import axios from "axios";

const api = inject("api");
const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/etages/")
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
