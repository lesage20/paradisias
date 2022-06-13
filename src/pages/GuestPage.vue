<template>
  <q-page padding>
    <div v-if="add" class="row">
      <div class="col">
        <div>
          <q-stepper
            ref="stepper"
            v-model="step"
            alternative-labels
            color="primary"
            animated
          >
            <q-step
              :name="1"
              title="Ajouté un nouvel utilisateur"
              icon="fa fa-user-plus"
              :done="step > 1"
              caption="Optionnel"
            >
              <AddUser @close="add = false" @saved="$refs.stepper.next()" />
            </q-step>

            <q-step
              :name="2"
              title="Ajouter un nouveau client"
              caption="Obligatoire"
              icon="fa fa-user-plus"
            >
              <AddProfil
                title="client"
                @close="$refs.stepper.previous()"
                @saved="guestCreated"
              />
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-12 desktop-only">
        <ListTable
          :items="items"
          :columns="columns"
          title="Clients"
          @add="startAdd"
        />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de clients </q-toolbar-title>
          <q-btn label="ajouter" outline @click="startAdd" color="teal-8" />
        </q-toolbar>
        <q-list>
          <q-item v-for="item in items" :key="item.name + item.firstname">
            <q-item-section side>
              <q-avatar size="55px" color="teal-7">
                <q-icon color="white" name="fa fa-user"> </q-icon>
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
              <q-badge>{{ item.gender }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddProfil from "src/components/AddProfil.vue";
import ListTable from "src/components/ListTable.vue";
import AddUser from "src/components/AddUser.vue";
import { useQuasar } from "quasar";
import { ref, onMounted, inject } from "vue";
import axios from "axios";

const api = inject("api");
const $q = useQuasar();
const add = ref(false);
const step = ref(0);
const items = ref([]);

function startAdd() {
  add.value = true;
  $q.dialog({
    title: "Question",
    message:
      "Pour Ajouter un client il faut d'abord ajouter son compte utilisateur. Le client a t'il un compte enregistré?",
    cancel: "non",
    ok: "oui",
    persistent: true,
  })
    .onOk(() => {
      step.value = 2;
    })
    .onCancel(() => {
      step.value = 1;
    });
}
function getClients() {
  axios
    .get(api + "accounts/clients/")
    .then((res) => {
      items.value = [...res.data];
    })
    .catch((err) => {
      console.dir(err);
      $q.notify("Une erreur s'est produite durant la recuperation des données");
    });
}
function guestCreated() {
  getClients();
  add.value = false;
}
function employeeCreated() {
  //
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
