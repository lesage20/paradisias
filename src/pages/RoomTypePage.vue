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

const api = inject("api");
const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/types_chambre/")
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
