<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddCoupon @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :columns="columns"
          :items="items"
          title="Coupons"
          @add="add = true"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de coupons </q-toolbar-title>
          <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
        </q-toolbar>
        <q-list separator>
          <q-item v-for="item in items" :key="item.name">
            <q-item-section>
              <q-item-label>
                {{ item.title }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                {{ item.description }}
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge size="xs">{{ item.discount }}%</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddCoupon from "src/components/AddCoupon.vue";
import ListTable from "src/components/ListTable.vue";
import { ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
onMounted(() => {
  axios
    .get(api + "hotel/coupons/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
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
