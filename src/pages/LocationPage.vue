<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile" persistent>
          <AddLocation @saved="created" @close="add = false" />
        </q-dialog>
      </div>
      <div class="col">
        <q-dialog v-model="addFacture" :maximized="$q.platform.is.mobile" persistent>
          <AddFacture :booking="locId" @saved="created($event); locId = null" @close="addFacture = false" />
        </q-dialog>
      </div>
      <div class="col">
        <q-dialog v-model="addingTime">
          <AddTime v-if="selected.length" :location="selected[0]" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div v-if="$q.platform.is.desktop" class="col-12 desktop-only">
        <ListTable :facturable="true" :columns="columns" :items="items" title="Reservations" :dense="true" :tools="true"
          :location-tools="true" @add="add = true" @delete="deleteLocation" @selected="showSelected"
          @add-time="addingTime = true" @add-facture="locId = $event.id; addFacture = true" @archive="archive"
          @paid="paid" @pending="pending" />
      </div>
      <div v-if="$q.platform.is.mobile" class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de locations </q-toolbar-title>
        </q-toolbar>

        <q-toolbar v-if="selected.length" class="bg-grey-4 text-grey-9">
          <q-btn size="md" outlined round flat icon="arrow_back" @click="selected = []">
            {{ selected.length }}
          </q-btn>

          <q-space></q-space>

          <q-btn size="md" outlined round flat icon="done_all" @click="multipleSelect">
          </q-btn>

          <q-btn v-if="selected.length == 1" size="md" outlined round flat icon="more_time" @click="addingTime = true">
          </q-btn>

          <q-btn v-if="selected.length" size="md" outlined round flat icon="verified" @click="paid">
            <q-tooltip class="text-body2">
              Marquée la/les selections payées
            </q-tooltip>
          </q-btn>

          <q-btn v-if="selected.length" size="md" outlined round flat icon="archive" @click="archive">
          </q-btn>
        </q-toolbar>
        <q-list>
          <q-item v-for="item in items" :key="item.reference" class="q-py-md" @contextmenu="toggleSelection(item)">
            <q-item-section v-if="selected.length" side>
              <q-icon v-if="selected.indexOf(item) != -1" color="primary" name="check_box" @click="toggleSelection(item)">
              </q-icon>
              <q-icon v-else name="check_box_outline_blank" @click="toggleSelection(item)">
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-uppercase">
                {{ item.chambre.number }}
                {{ item.client.name + " " + item.client.firstname }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                {{ new Date(item.checkIn).toLocaleDateString() }} -
                {{ new Date(item.checkOut).toLocaleDateString() }}
              </q-item-section>
            </q-item-section>

            <q-item-section side>
              <q-chip :class="{
                'bg-teal-1 text-teal': item.status == 'payée',
                'bg-pink-1 text-pink': item.status == 'en attente',
                'bg-grey-3 text-grey-8': item.status == 'archivée',
              }">
                {{ item.totalPrice }}F
                <q-icon v-if="item.status == 'payée'" size="15px" right name="verified">
                </q-icon>
                <q-icon v-if="item.status == 'en attente'" size="15px" right name="schedule">
                </q-icon>
                <q-icon v-if="item.status == 'archivée'" size="15px" right name="archive">
                </q-icon>
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-page-sticky v-if="$q.platform.is.mobile" :offset="[18, 18]">
      <q-btn class="shadow-20" round size="md" icon="add" color="teal-8" @click="add = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, inject, provide } from "vue";
import { useQuasar } from "quasar";
// import { useLoginStore as store } from "src/stores/login";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter()
const locId = ref(null)
// const role = store()?.user?.groups?.[0].name

const AddLocation = defineAsyncComponent(() =>
  import("src/components/forms/AddLocation.vue")
);
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const AddTime = defineAsyncComponent(() =>
  import("src/components/forms/AddTime.vue")
);
const AddFacture = defineAsyncComponent(() =>
  import("src/components/forms/AddFacture.vue")
);

const token = inject("token");
const api = inject("api");

const $q = useQuasar();
const items = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const clients = ref([]);
const endpoints = [
  api + "hotel/locations/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "accounts/clients/",
];
const addFacture = ref(false)
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
      axios.spread((locations, chambresData, types, clientsData) => {
        types_chambre.value = types.data;
        chambres.value = chambresData.data;
        items.value = locations.data;
        clients.value = clientsData.data;
        items.value.forEach((el) => {
          el.chambre = chambres.value.find(
            (chambre) => chambre.id == el.room
          );

          el.type_chambre = types_chambre.value.find(
            (type) => (type.id == el.chambre.type)
          );
          el.client = clients.value.find(
            (client) => client.id == el.guest
          );
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
    label: "Reference",
    field: "reference",
    format: (val) => `${val.toUpperCase()}`,
    sortable: true,
  },
  {
    name: "client",
    align: "center",
    label: "Client",
    field: (row) => row.client,
    format: (val) => `${val.name.toUpperCase()} ${val.firstname}`,
    sortable: true,
  },
  {
    name: "roomType",
    align: "center",
    label: "Type Chambre",
    field: (row) => row.type_chambre.name,
    format: (val) => `${val.toUpperCase()}`,
    sortable: true,
  },
  {
    name: "room",
    align: "center",
    label: "Chambre",
    field: (row) => row.chambre.number,
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
    name: "Prix",
    align: "center",
    label: "Prix",
    field: (row) => row.totalPrice,
    format: (val) => `${val}F`,
    sortable: true,
  },
  {
    name: "payment",
    align: "center",
    label: "Payement",
    field: (row) => row.payment,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: (row) => row.status,
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
function created() {
  getDatas();
  add.value = false;
}
function deleteLocation(location) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer la location de la  <b> chambre ${location.chambre.number + " qui a couté " + location.totalPrice
      }FCFA </b> de la liste de locations?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  }).onOk(() => {
    del(location.id);
  });
}
function del(id) {
  axios
    .delete(api + "hotel/locations/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      getDatas();
      $q.notify("Location supprimée avec suuccès");
    })
    .catch(err => {
      console.log(err.response.status)
      if (err.response.status == 403) $q.notify("Vous ne pouvez pas supprimer cet enregistrement.")
    })
}
const selected = ref([]);
provide("selected", selected);
function toggleSelection(item) {
  if (selected.value.indexOf(item) < 0) {
    selected.value.push(item);
  } else {
    selected.value = selected.value.filter((it) => it.id != item.id);
  }
}
function showSelected() {
  console.log("emited");
}
const addingTime = ref(false);

function archive() {
  if (selected.value.length) {
    selected.value.forEach((el) => {
      el.status = "archivée";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          $q.notify("location archivée avec succès");
        })
        .catch((err) => {
          console.dir(err);
        });
    });
  }
}
function paid() {
  if (selected.value.length) {
    selected.value.forEach((el) => {
      el.status = "payée";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          $q.notify("location marquée comme payée avec succès");
        })
        .catch((err) => {
          $q.notify("Une erreur est survenue");
        });
    });
  }
}
function pending() {
  if (selected.value.length) {
    selected.value.forEach((el) => {
      el.status = "en attente";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          $q.notify("Location  mise en attente avec succès");
        })
        .catch((err) => {
          $q.notify("Une erreur est survenue");
        });
    });
  }
}
</script>
