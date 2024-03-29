<template>
  <q-page padding>
    <div v-if="add" class="row">
      <div class="col">
        <div>
          <q-stepper ref="stepper" v-model="step" alternative-labels color="primary" animated>
            <!-- <q-step :name="1" title="Ajouté un nouvel utilisateur" icon="fa fa-user-plus" :done="step > 1"
              caption="Optionnel">
              <AddUser @close="add = false" @saved="$refs.stepper.next()" />
            </q-step> -->

            <q-step :name="1" title="Ajouter un nouveau client" caption="Obligatoire" icon="fa fa-user-plus">
              <AddProfil title="client" @close="add = false" @saved="guestCreated" />
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-12 desktop-only">
        <ListTable :items="items" :columns="columns" title="Clients" @add="startAdd" @delete="deleteGuest" />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de clients </q-toolbar-title>
        </q-toolbar>
        <q-list>
          <q-item v-for="item in items" :key="item.name + item.firstname">
            <q-item-section side avatar>
              <q-avatar size="xl" color="teal-1">
                <q-icon size="lg" color="teal" name="person"> </q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ item.name + " " + item.firstname }}
                </q-item-label>
                <q-item-label caption class="text-grey">
                  Tel: {{ item.phone }} <br />
                  id: {{ item.idNumber }}
                </q-item-label>
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge class="bg-teal-1 text-teal">{{ item.gender }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
        <q-page-sticky :offset="[18, 18]">
          <q-btn size="md" round icon="add" color="teal-8" @click="startAdd" />
        </q-page-sticky>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, onMounted, inject, defineAsyncComponent } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter()
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const AddProfil = defineAsyncComponent(() =>
  import("src/components/forms/AddProfil.vue")
);
const AddUser = defineAsyncComponent(() =>
  import("src/components/forms/AddUser.vue")
);

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const add = ref(false);
const step = ref(0);
const items = ref([]);

function startAdd() {
  add.value = true;
  step.value = 1
  // $q.dialog({
  //   title: "Question",
  //   message:
  //     "Pour Ajouter un client il faut d'abord ajouter son compte utilisateur. Le client a t'il un compte enregistré?",
  //   cancel: "non",
  //   ok: "oui",
  //   persistent: true,
  // })
  //   .onOk(() => {
  //     step.value = 2;
  //   })
  //   .onCancel(() => {
  //     step.value = 1;
  //   });
}
function getClients() {
  axios
    .get(api + "accounts/clients/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      items.value = [...res.data];
    })
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
function guestCreated() {
  getClients();
  add.value = false;
}
function deleteGuest(guest) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> ${guest.name + " " + guest.firstname
      } </b> de la liste de clients?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  }).onOk(() => {
    del(guest.id);
  });
}
function del(id) {
  axios
    .delete(api + "accounts/clients/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      $q.notify("Client supprimé avec suuccès");
    });
}
function updateGuest(guest) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> ${guest.name + " " + guest.firstname
      } </b> de la liste de clients?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  });
}

onMounted(getClients);

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
    name: "name",
    align: "center",
    label: "nom",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "firstname",
    align: "center",
    label: "prénom",
    field: (row) => row.firstname,
    sortable: true,
  },
  {
    name: "idNumber",
    align: "center",
    label: "N° piece",
    field: "idNumber",
    sortable: true,
  },
  {
    name: "phone",
    align: "center",
    label: "Telephone",
    field: "phone",
    sortable: true,
  },
  {
    name: "gender",
    align: "center",
    label: "Genre",
    field: "gender",
    sortable: true,
  },

  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];
</script>
