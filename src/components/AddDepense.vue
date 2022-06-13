<template>
  <form-generator
    :fields="fields"
    title="Ajouter une dépense"
    :dense="false"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useLoginStore as store } from "src/stores/login";

const api = inject("api");
console.dir(store().profile);
const $q = useQuasar();

const loading = ref(false);
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const fields = ref([
  {
    type: "text",
    name: "title",
    required: true,
    model: "title",
    label: "Titre de la depense",
  },
  {
    autogrow: true,
    required: true,
    name: "description",
    model: "description",
    label: "Description de  la dépense",
    type: "text",
  },
  {
    name: "amount",
    type: "number",
    model: "amount",
    required: true,
    label: "Le montant de la dépense",
    prefix: "FCFA",
  },
  {
    name: "date",
    type: "date",
    model: "date",
    required: true,
    label: "La date ",
    prefix: "FCFA",
  },
]);
function getFormContent(data) {
  loading.value = true;
  console.log(data);
  data.spent_by = store().user.profil;
  axios
    .post(api + "hotel/depenses/", data)
    .then((res) => {
      console.log(res);
      loading.value = false;
      $q.notify("Dépense crée avec succès");
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
}
</script>
