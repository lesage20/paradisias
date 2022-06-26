<template>
  <form-generator
    :fields="fields"
    title="Ajouter un coupon"
    :dense="false"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const token = inject("token");
const api = inject("api");
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
    label: "Titre du coupon",
  },
  {
    autogrow: true,
    required: true,
    name: "description",
    model: "description",
    label: "Description du coupon",
    type: "text",
  },
  {
    name: "discount",
    type: "number",
    model: "discount",
    required: true,
    label: "Le pourcentage de réduction",
    prefix: "-",
    suffix: "%",
  },
  {
    type: "text",
    label: "code",
    model: "code",
    name: "code",
    hint: "Ce code sera utilisé pour identifier le coupon",
  },
]);
function getFormContent(data) {
  loading.value = true;
  console.log(data);
  axios
    .post(api + "hotel/coupons/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res);
      loading.value = false;
      $q.notify("Coupon crée avec succès");
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
