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
        <ListTable title="Dépenses" :columns="columns" :items="items" @add="add = true" />
      </div>
      <div class="col-12">
        <div class="col-12 mobile-only">
          <q-toolbar>
            <q-toolbar-title>Liste de dépenses </q-toolbar-title>
          </q-toolbar>
          <q-list>
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
                <q-badge class="bg-teal-1 text-teal">{{ item.amount }} F</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <q-page-sticky v-if="$q.platform.is.mobile" :offset="[18, 18]">
      <q-btn class="shadow-20 bg-teal-2 text-teal-8" round size="md" icon="add" @click="add = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import axios from "axios";
import { inject, onMounted, ref, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const AddDepense = defineAsyncComponent(() =>
  import("src/components/forms/AddDepense.vue")
);
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
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
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        // dialog
        //   .update({
        //     title: "Erreur de réseau",
        //     message:
        //       "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
        //     ok: "actualiser",
        //     progress: false,
        //     persistent: true,
        //   })
        //   .onOk(() => {
        //     window.location.reload();
        //   });
      } else {
        if (err.response.status == "401") {
          router.push({ name: "Login" });//
        } else {
          dialog.update({
            title: "Erreur",
            message: `Une erreur s'est produite. <br/> code d'erreur: <b> ${err.response.status} </b> <br/> message: ${err.response.message}`,
            persistent: false,
            ok: true,
            progress: false,
          });
        }
      }
    });
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
