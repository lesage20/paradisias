<template>
  <q-page>
    <div class="row q-py-sm">
      <div class="col">
        <ListTable
          title="Role"
          :grid="true"
          :items="groups"
          @add="createRole"
        ></ListTable>
      </div>
    </div>
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
              icon="create_account"
              :done="step > 1"
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
              title="Ajouter un nouvel employé"
              caption="Optional"
              icon="fa fa-user-plus"
            >
              <AddProfil
                title="employé"
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
          :items="employes"
          :columns="columns"
          title="Employés"
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
const groups = ref([]);
const role = ref("");
const employes = ref([]);
const endpoints = [
  "http://127.0.0.1:8000/auth/accounts/groups",
  "http://127.0.0.1:8000/auth/accounts/clients/",
];
function startAdd() {
  add.value = true;
  $q.dialog({
    title: "Question",
    message:
      "Pour Ajouter un employé il faut d'abord ajouter son compte utilisateur. L'employé a t'il un compte enregistré?",
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

onMounted(() => {
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((groupList, employeList) => {
      groups.value = groupList.data;
      employes.value = employeList.data;
    })
  );
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
    name: "role",
    align: "center",
    label: "role",
    field: "role",
    sortable: true,
  },

  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];

function createRole() {
  $q.dialog({
    title: "Ajouter un role",
    prompt: {
      label: "Entrez le nom du nouveau role",
      model: role,
    },
  })
    .onOk((data) => {
      if (!Boolean(role.value)) {
        $q.notify({
          message: "Aucun nom saisi. veuillez saisir le nom du role",
          icon: "fa fa-exclamation-triangle",
          textColor: "red-8",
          color: "red-2",
        });
      }
      axios
        .post("http://127.0.0.1:8000/auth/accounts/groups/", {
          name: role.value,
        })
        .then((res) => {
          $q.notify({
            icon: "fa fa-check-circle",
            message: "Role crée avec succès",
            textColor: "green",
            color: "green-2",
          });
        })
        .catch((err) => {
          console.dir(err);

          $q.notify({
            message: "Le nouveau role n'a pas pu être ajouté",
            icon: "fa fa-exclamation-triangle",
            textColor: "red-8",
            color: "red-2",
          });
        });
    })
    .onCancel(() => {
      console.log(">>>> Cancel");
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}
</script>
