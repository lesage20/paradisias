<template>
  <q-page>
    <div class="row">
      <q-toolbar dark class="bg-teal">
        <q-tabs v-model="tab" class="text-white full-width">
          <q-tab name="role" label="Role" />
          <q-tab name="employe" label="Employés" />
        </q-tabs>
      </q-toolbar>
      <q-card
        :flat="$q.platform.is.mobile"
        :class="$q.platform.is.mobile ? 'full-width bg-grey-2' : 'full-width'"
      >
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="jump-down"
          transition-next="jump-up"
        >
          <q-tab-panel name="role">
            <div class="text-h4 q-mb-md">role</div>
            <div class="col">
              <q-list>
                <q-expansion-item
                  v-for="group in groups"
                  :key="group.name"
                  expand-separator
                  icon="perm_identity"
                  :label="group.name"
                >
                  <q-list>
                    <q-item>
                      <span class="text-subtitle1 text-teal">
                        Liste des permissions
                      </span>
                    </q-item>
                  </q-list>

                  <q-item v-for="perm in group.permissions" :key="perm.name">
                    <q-item-section>
                      <q-item-label>
                        {{ perm.codename }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ perm.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-list>
            </div>
          </q-tab-panel>

          <q-tab-panel
            :class="{ 'q-pa-none q-pt-lg': $q.platform.is.mobile }"
            name="employe"
          >
            <div
              v-if="add"
              class="col"
              :class="{ 'q-pa-none': $q.platform.is.mobile }"
            >
              <div>
                <q-stepper
                  flat
                  ref="stepper"
                  v-model="step"
                  alternative-labels
                  color="primary"
                  animated
                >
                  <q-step
                    class="q-pa-none"
                    :name="1"
                    title="Ajouté un nouvel utilisateur"
                    icon="create_account"
                    :done="step > 1"
                  >
                    <AddUser @close="add = false" />
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
            <div v-else class="col-12">
              <ListTable
                class="desktop-only"
                :items="employes"
                :columns="columns"
                title="Employés"
                @add="startAdd"
              />
              <div class="col-12 mobile-only">
                <q-toolbar>
                  <q-toolbar-title> Liste des employés </q-toolbar-title>
                  <q-btn
                    label="ajouter"
                    outline
                    @click="startAdd"
                    color="teal-8"
                  />
                </q-toolbar>
                <q-list>
                  <q-item
                    v-for="item in employes"
                    :key="item.name + item.firstname"
                  >
                    <q-item-section side>
                      <q-avatar size="xl" color="teal-7">
                        <q-icon color="white" name="fa fa-user"> </q-icon>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ item.name + " " + item.firstname }}
                      </q-item-label>
                      <q-item-label caption class="text-grey">
                        Tel: {{ item.phone }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge>{{ item.group.name }}</q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
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

const tabs = ["role", "employe"];
const tab = ref(tabs[0]);

const add = ref(false);
const groups = ref([]);

const step = ref(1);
const role = ref("");
const employes = ref([]);
const endpoints = [api + "accounts/groups", api + "accounts/employes/"];
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
  $q.notify(
    "Pour Ajouter un employé il faut d'abord ajouter son compte utilisateur. L'employé a t'il un compte enregistré?"
  );
}

onMounted(() => {
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((groupList, employeList) => {
      groups.value = groupList.data;
      employes.value = employeList.data;
      employes.value.forEach((el) => {
        el.group = groups.value.filter((group) => group.id == el.role)[0];
      });
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
    field: (row) => row.group.name,
    sortable: true,
  },

  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];

function createRole() {
  axios
    .post(api + "accounts/groups/", {
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
}
</script>
