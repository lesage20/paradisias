<template>
  <form-generator
    :fields="fields"
    title="Ajouter une reservation"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useLoginStore } from "src/stores/login";
const $q = useQuasar();
const loading = ref(false);
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const endpoints = [
  "http://127.0.0.1:8000/types_chambre/",
  "http://127.0.0.1:8000/auth/accounts/clients/",
  "http://127.0.0.1:8000/chambres/",
];
let typeOptions = ref([]);
let clientOptions = ref([]);
let roomOptions = ref([]);
onMounted(() => {
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((types, clients, rooms) => {
      types.data.forEach((el) => {
        let opt = {
          label: el.name,
          value: el.id,
        };
        typeOptions.value.push(opt);
      });
      clients.data.forEach((el) => {
        let opt = {
          label: el.name,
          value: el.id,
        };
        clientOptions.value.push(opt);
      });
      rooms.data.forEach((el) => {
        let opt = {
          label: el.number,
          value: el.id,
        };
        roomOptions.value.push(opt);
      });
    })
  );
});

const fields = ref([
  {
    type: "select",
    label: "Client",
    model: "guest",
    hint: "Le client qui reserve la chambre",
    options: clientOptions,
  },
  {
    type: "select",
    name: "roomType",
    required: true,
    model: "roomType",
    label: "Type de chambre",
    options: typeOptions,
  },
  {
    required: true,
    name: "room",
    model: "room",
    label: "Numéro de chambre",
    type: "select",
    options: roomOptions,
  },
  {
    name: "checkIn",
    type: "date",
    model: "checkIn",
    required: true,
    label: "Date d'entrée",
  },
  {
    name: "checkOut",
    type: "date",
    model: "checkOut",
    required: true,
    label: "Date de sorti",
  },
  {
    type: "select",
    label: "status de la commande",
    model: "status",
    hint: "Le status de la commande",
    options: ["en attente", "payée", "archivée"],
  },
]);

function getFormContent(data) {
  loading.value = true;
  data.recorded_by = useLoginStore().user.profil;
  axios
    .post("http://127.0.0.1:8000/locations/", data)
    .then((res) => {
      console.log(res);
      loading.value = false;
      $q.notify("Client crée avec succès");
    })
    .catch((err) => {
      console.dir(err);
      loading.value = false;
      if (err.message && err.message == "Network Error") {
        $q.notify("Impossible de se connecter au server");
      } else if (err.response && err.response.status === 400) {
        data = err.response.data;
        if ("non_field_errors" in data) {
          for (let msg in data.non_field_errors) {
            $q.notify(data.non_field_errors[msg]);
          }
        } else {
          for (let msg in data) {
            console.log(data[msg] == "Ce champ est obligatoire.");
            if (data[msg] == "Ce champ est obligatoire.") {
              $q.notify(
                "Tous les champs avec « * »  sont obligatoires, veuillez les remplir svp"
              );
              break;
            } else {
              $q.notify(data[msg]);
            }
          }

          // $q.notify("vous n'avez pas bien renseigné le formulaire")
        }
      } else {
        $q.notify(err.message);
      }
    });

  return data;
}
</script>
