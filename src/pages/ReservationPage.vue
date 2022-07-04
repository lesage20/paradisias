<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile" persistent>
          <AddLocation @saved="created" @close="add = false" />
          {{ $q.platform.is.desktop }}
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
        <ListTable
          :columns="columns"
          :items="items"
          title="Reservations"
          :dense="true"
          :tools="true"
          :reservation-tools="true"
          @add="add = true"
          @delete="deleteLocation"
          @selected="showSelected"
          @archive="archive"
          @pending="pending"
          @verified="confirm"
          @canceled="cancel"
        >
          <template #status="status">
            <q-td class="text-center" :attr="attr">
              <q-icon
                v-if="status.status == 'confirmée'"
                size="sm"
                color="primary"
                name="check"
              >
                <q-tooltip class="text-body2"> {{ status.status }} </q-tooltip>
              </q-icon>
              <q-icon
                v-if="status.status == 'annulée'"
                size="sm"
                color="red-7"
                name="close"
              >
                <q-tooltip class="text-body2"> {{ status.status }} </q-tooltip>
              </q-icon>
              <q-icon
                v-if="status.status == 'en attente'"
                size="sm"
                color="orange-8"
                name="schedule"
              >
                <q-tooltip class="text-body2"> {{ status.status }} </q-tooltip>
              </q-icon>
            </q-td>
          </template>
        </ListTable>
      </div>
      <div v-if="$q.platform.is.mobile" class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de reservations </q-toolbar-title>
        </q-toolbar>

        <q-toolbar v-if="selected.length" class="bg-grey-4 text-grey-9">
          <q-btn
            size="md"
            outlined
            round
            flat
            icon="arrow_back"
            @click="selected = []"
          >
            {{ selected.length }}
          </q-btn>

          <q-space></q-space>

          <q-btn
            size="md"
            outlined
            round
            flat
            icon="done_all"
            @click="multipleSelect"
          >
          </q-btn>

          <q-btn
            v-if="selected.length == 1"
            size="md"
            outlined
            round
            flat
            icon="close"
            @click="cancel"
          >
            <q-tooltip class="text-body2"> Annuler la réservation </q-tooltip>
          </q-btn>

          <q-btn
            v-if="selected.length"
            size="md"
            outlined
            round
            flat
            icon="verified"
            @click="confirm"
          >
            <q-tooltip class="text-body2"> Confirmée la réservation </q-tooltip>
          </q-btn>
          <q-btn
            v-if="selected.length"
            size="md"
            outlined
            round
            flat
            icon="archive"
            @click="archive"
          >
          </q-btn>
          <q-btn
            v-if="selected.length"
            size="md"
            outlined
            round
            flat
            icon="schedule"
            @click="pending"
          >
            <q-tooltip class="text-body2">
              Mettre la selection en attente
            </q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-list separator>
          <q-item
            v-for="item in items"
            :key="item.reference"
            class="q-py-md"
            @contextmenu="toggleSelection(item)"
          >
            <q-item-section v-if="selected.length" side>
              <q-icon
                v-if="selected.indexOf(item) != -1"
                color="primary"
                name="check_box"
                @click="toggleSelection(item)"
              >
              </q-icon>
              <q-icon
                v-else
                name="check_box_outline_blank"
                @click="toggleSelection(item)"
              >
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.chambre.number }} par
                {{ item.client.name + " " + item.client.firstname }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                du {{ new Date(item.checkIn).toLocaleDateString() }} au
                {{ new Date(item.checkOut).toLocaleDateString() }}
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge v-if="item.status == 'annulée'" color="red">
                <q-icon left name="close"></q-icon>
                {{ item.status }}
              </q-badge>
              <q-badge v-else-if="item.status == 'en attente'" color="orange">
                <q-icon left name="schedule"></q-icon>

                {{ item.status }}
              </q-badge>
              <q-badge v-else-if="item.status == 'confirmée'">
                <q-icon left name="check"></q-icon>
                {{ item.status }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-page-sticky v-if="$q.platform.is.mobile" :offset="[18, 18]">
      <q-btn fab icon="add" color="teal-8" @click="add = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, inject, provide } from "vue";
import { useQuasar } from "quasar";
import { useLoginStore as store } from "src/stores/login";
import axios from "axios";
const AddLocation = defineAsyncComponent(() =>
  import("src/components/AddLocation.vue")
);
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const AddTime = defineAsyncComponent(() =>
  import("src/components/AddTime.vue")
);
const token = inject("token");
const api = inject("api");

const $q = useQuasar();
const items = ref([]);
const chambres = ref([]);
const types_chambre = ref([]);
const clients = ref([]);
const endpoints = [
  api + "hotel/reservations/",
  api + "hotel/chambres/",
  api + "hotel/types_chambre/",
  api + "accounts/clients/",
];
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
      axios.spread((reservations, chambresData, types, clientsData) => {
        types_chambre.value = types.data;
        chambres.value = chambresData.data;
        items.value = reservations.data;
        clients.value = clientsData.data;
        items.value.forEach((el) => {
          el.chambre = chambres.value.filter(
            (chambre) => chambre.id == el.room
          )[0];

          el.type_chambre = types_chambre.value.filter(
            (type) => (type.id = el.chambre.type)
          )[0];
          el.client = clients.value.filter(
            (client) => client.id == el.guest
          )[0];
        });
        console.log(items.value);
        console.log(clients.value);
      })
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        dialog
          .update({
            title: "Erreur de réseau",
            message:
              "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
            ok: "actualiser",
            progress: false,
            persistent: true,
          })
          .onOk(() => {
            window.location.reload();
          });
      } else {
        if (err.response.status == "401") {
          dialog
            .update({
              title: "Erreur",
              message:
                "Votre delai de connexion est passé veuillez vous reconnecter",
              ok: "se connecter",
              progress: false,
            })
            .onOk(() => {
              store().logout();
              router.push({ name: "Login" });
            });
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
    name: "status",
    align: "center",
    label: "status",
    field: (row) => row.status,
    format: (val) => {
      if (val == "confirmée") return "paid";
      return val;
    },
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
    message: `Voulez vous vraiment supprimer la location de la
    <b> chambre ${location.chambre.number} </b> de la liste de reservations?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  }).onOk(() => {
    del(location.id);
  });
}
function del(id) {
  axios
    .delete(api + "hotel/reservations/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      getDatas();
      $q.notify("Réservation supprimée avec suuccès");
    });
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

function archive() {
  if (selected.value.length) {
    let archived = 0;
    selected.value.forEach((el) => {
      el.status = "archivée";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          archived += 1;
          $q.notify("Réservation archivée avec succès");
        })
        .catch((err) => {
          console.dir(err);
        });
    });
  }
}
function confirm() {
  if (selected.value.length) {
    selected.value.forEach((el) => {
      el.status = "confirmée";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          $q.notify("Réservation confirmée avec succès");
        })
        .catch((err) => {
          console.dir(err);
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
          $q.notify("Réservation  mise en attente avec succès");
        })
        .catch((err) => {
          $q.notify("Une erreur est survenue");
          console.dir(err);
        });
    });
  }
}
function cancel() {
  if (selected.value.length) {
    selected.value.forEach((el) => {
      el.status = "annulée";
      axios
        .put(el.url, el, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then(() => {
          $q.notify("Réservation  annulée avec succès");
        })
        .catch((err) => {
          $q.notify("Une erreur est survenue");
          console.dir(err);
        });
    });
  }
}
</script>
