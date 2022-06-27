<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddRoom @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          :items="items"
          title="Chambres"
          @add="add = true"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de chambres </q-toolbar-title>
          <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
        </q-toolbar>
        <q-list separator>
          <q-item v-for="item in items" :key="item.number">
            <q-item-section>
              <q-item-label>
                {{ item.number }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                etage: {{ item.etage.number }} &bullet; prix:
                {{ item.type_chambre.price }} FCFA
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge size="xs">{{ item.type_chambre.name }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
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

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
const types_chambre = ref([]);
const etages = ref([]);
const endpoints = [
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "hotel/etages/",
];
onMounted(() => {
  axios
    .all(
      endpoints.map((endpoint) =>
        axios.get(endpoint, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      )
    )
    .then(
      axios.spread((chambres, types, floors) => {
        types_chambre.value = types.data;
        etages.value = floors.data;
        items.value = chambres.data;
        items.value.forEach((el) => {
          el.etage = etages.value.filter((etage) => (etage.id = el.floor))[0];
          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.type)
          )[0];
        });
      })
    );
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
    field: (row) => row.type_chambre.name,
    sortable: true,
  },
  {
    name: "floor",
    align: "center",
    label: "Etage",
    field: (row) => row.etage.number,
    sortable: true,
  },
  {
    name: "price",
    align: "center",
    label: "Prix",
    field: (row) => row.type_chambre.price,
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
</script>
