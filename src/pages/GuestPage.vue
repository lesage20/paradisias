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
              <Suspense>
                <AddUser @close="add = false" />
                <template #fallback>
                  <q-spinner name="gears"></q-spinner>
                  Loading...
                </template>
              </Suspense>
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
                @saved="emplCreated"
              />
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <ListTable
          :items="items"
          :columns="columns"
          title="Clients"
          @add="startAdd"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddProfil from "src/components/AddProfil.vue";
import ListTable from "src/components/ListTable.vue";
import AddUser from "src/components/AddUser.vue";
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import axios from "axios";

const $q = useQuasar();
const add = ref(false);
const step = ref(1);
const items = ref([]);

function startAdd() {
  add.value = true;
  $q.dialog({
    title: "Question",
    message:
      "Pour Ajouter un client il faut d'abord ajouter son compte utilisateur. L'employé a t'il un compte enregistré?",
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
function emplCreated() {
  $q.notify("Employé créé avec succès");
}
function employeeCreated() {
  //
}
onMounted(() => {
  axios
    .get("http://127.0.0.1:8000/auth/accounts/clients/")
    .then((res) => (items.value = [...res.data]))
    .catch((err) => {
      console.dir(err);
      $q.notify("Une erreur s'est produite durant la recuperation des données");
    });
});

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
