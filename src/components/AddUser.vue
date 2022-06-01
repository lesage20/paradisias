<template>
  <form-generator
    :fields="fields"
    :loading="loading"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
</script>
<script setup>
const groups = await axios
  .get("http://127.0.0.1:8000/auth/accounts/groups/")
  .then((res) => res.data);
let options = [];
if (Array.isArray(groups)) {
  groups.forEach((el) => {
    options.push(el.name);
  });
}
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const $q = useQuasar();
const loading = ref(false);
const fields = ref([
  {
    type: "text",
    name: "username",
    required: true,
    model: "username",
    label: "Nom d'utilisateur",
    hint: "Ce nom sera utilisé pour se connecter. Il ne doit pas contenir de symbole ou d'espace",
  },
  {
    name: "email",
    type: "email",
    model: "email",
    required: true,
    label: "Email de l'utilisateur",
  },
  {
    type: "password",
    name: "password1",
    required: true,
    model: "password1",
    label: "Mot de passe",
  },
  {
    type: "password",
    name: "password2",
    required: true,
    model: "password2",
    label: "Confirmer mot de passe",
  },
  {
    type: "select",
    label: "Le role de l'employé",
    model: "groups",
    options: options,
  },
]);

function getFormContent(data) {
  loading.value = true;
  console.log(data);
  axios
    .post("http://127.0.0.1:8000/auth/profil/registration/", data)
    .then((res) => {
      console.log(res);
      loading.value = false;
      $q.notify("Compte crée avec succès");
      emits("saved");
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
            if (data[msg] === "Ce champs est obligatoire.") {
              $q.notify(
                "Tous les champs sont obligatoires, veuillez les remplir svp"
              );
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
