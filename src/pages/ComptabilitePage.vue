<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile" persistent>
          <AddDepense @close="add = false" @saved="created" />
        </q-dialog>
      </div>
    </div>

    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable
          title="Dépenses"
          :columns="columns"
          :items="items"
          @add="add = true"
        />
      </div>
      <div class="col-12">
        <div class="col-12 mobile-only">
          <q-toolbar>
            <q-toolbar-title>Liste de dépenses </q-toolbar-title>
            <q-btn label="ajouter" outline color="teal-8" @click="add = true" />
          </q-toolbar>
          <q-list separator>
            <q-item v-for="item in items" :key="item.title">
              <q-item-section>
                <q-item-label>
                  {{ item.author.name }} {{ item.author.firstname }}
                </q-item-label>
                <q-item-section caption class="text-grey">
                  {{ item.title }} le
                  {{ new Date(item.date).toLocaleDateString() }}
                </q-item-section>
              </q-item-section>
              <q-item-section side>
                <q-badge>{{ item.amount }} FCFA</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ListTable from "../components/ListTable.vue";
import AddDepense from "../components/AddDepense.vue";
import axios from "axios";
import { inject, onMounted, ref } from "vue";

const token = inject("token");
const api = inject("api");
const add = ref(false);
const items = ref([]);
const profiles = ref([]);
const endpoints = [api + "hotel/depenses/", api + "accounts/profiles/"];
function getDatas() {
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
      axios.spread((depenses, profilesData) => {
        profiles.value = profilesData.data;
        items.value = depenses.data;
        items.value.forEach((el) => {
          el.author = profiles.value.filter(
            (profile) => (profile.id = el.spent_by)
          )[0];
        });
      })
    );
}
onMounted(getDatas);

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
    field: (row) => row.author.name + " " + row.author.firstname,
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
function created() {
  getDatas();
  add.value = false;
}
</script>
