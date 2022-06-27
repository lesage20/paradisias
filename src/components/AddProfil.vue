<template>
  <form-generator
    :fields="fields"
    :loading="loading"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

let users = [];
let userOptions = ref([]);

onMounted(() => {
  axios
    .get(api + "accounts/users/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      users = res.data;
      console.log(users.value);
      users.forEach((el) => {
        let opt = {
          label: el.username,
          value: el.id,
        };
        userOptions.value.push(opt);
      });
      console.log(userOptions.value);
    })
    .catch((err) => {
      console.dir(err);
      $q.notify(
        "Erreur lors de la recuperation de la liste d'utilisateur. veuilllez actualiser"
      );
    });
});
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const loading = ref(false);

const fields = ref([
  {
    type: "select",
    options: userOptions,
    "emit-value": true,
    name: "user",
    required: true,
    model: "user",
    label: "Compte Utilisateur*",
  },
  {
    type: "text",
    name: "name",
    required: true,
    model: "name",
    label: "Nom de " + props.title + "*",
  },
  {
    autogrow: true,
    required: true,
    name: "firstname",
    model: "firstname",
    label: "Prenom de " + props.title + "*",
    type: "text",
  },
  {
    name: "phone",
    type: "phone",
    model: "phone",
    required: true,
    label: "Numéro de téléphone de " + props.title + "*",
  },
  {
    name: "email",
    type: "email",
    model: "email",
    required: true,
    label: "Email de " + props.title,
  },
  {
    type: "text",
    name: "address",
    required: true,
    model: "address",
    label: "Adresse de " + props.title,
  },
  {
    autogrow: true,
    required: true,
    name: "DOB",
    model: "dob",
    label: "Date de naissance de " + props.title + "*",
    type: "date",
  },
  {
    name: "idType",
    type: "select",
    model: "idType",
    required: true,
    label: "Type de pièce de " + props.title + "*",
    options: [
      { value: "cni", label: "Carte Nationale d'identité" },
      { value: "passeport", label: "Passeport" },
      { value: "attestation", label: "Attestation d'identité" },
    ],
  },
  {
    name: "idNumber",
    type: "text",
    model: "idNumber",
    required: true,
    label: "Numéro de la  pièce d'identité de " + props.title + "*",
  },
  {
    type: "select",
    label: "Le genre de " + props.title + "*",
    model: "gender",
    options: ["homme", "femme"],
  },
]);

function getFormContent(data) {
  loading.value = true;
  console.log(data);
  axios
    .post(api + "accounts/profiles/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res);
      loading.value = false;
      emits("saved");
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
