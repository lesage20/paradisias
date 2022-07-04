<template>
  <form-generator
    :fields="fields"
    title="Ajouter une reservation"
    :dense="$q.platform.is.desktop"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref, inject } from "vue";
import axios from "axios";
import { isBefore, isAfter } from "date-fns";
import { useQuasar } from "quasar";
const api = inject("api");
const token = inject("token");
const $q = useQuasar();
const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});
const fields = ref([
  {
    type: "datetime",
    label: "Date de sortie",
    model: "checkOut",
    hint: "La nouvelle date à laquelle le client doit sortir",
    dateOptions: (date) =>
      isAfter(new Date(date), new Date(props.location.checkOut)),
  },
  {
    type: "number",
    name: "price",
    required: true,
    model: "price",
    label: "Le montant à ajouter",
    min: 5000,
  },
]);
function validLocation(data) {
  let validation = { isValid: true, message: "" };
  if (Object.keys(data).length < 2) {
    validation = {
      isValid: false,
      message: "Tous les champs sont obligatoire",
    };
  } else if (isBefore(new Date(data.checkOut), new Date())) {
    validation = {
      isValid: false,
      message: "La date  de sortie ne peut pas être avant maintenant",
    };
  } else if (
    isBefore(new Date(data.checkOut), new Date(props.location.checkIn))
  ) {
    validation = {
      isValid: false,
      message: "La date d'entrée ne peut pas être après la date de sortie",
    };
  } else if (
    isBefore(new Date(data.checkOut), new Date(props.location.checkOut))
  ) {
    validation = {
      isValid: false,
      message: "La date de sortie doit après l'ancienne date de sortie ",
    };
  } else if (data.price < 5000) {
    validation = {
      isValid: false,
      message: "La montant à ajouter doit être superieur ou égale a 5000F ",
    };
  }

  return validation;
}
function getFormContent(data) {
  const validation = validLocation(data, props.locations);
  const toUpload = Object.assign({}, props.location);
  toUpload.checkOut = data.checkOut;
  toUpload.totalPrice = props.location.totalPrice + data.price;
  console.log(toUpload);
  if (!validation.isValid) {
    $q.notify(validation.message);
    return;
  }
  axios
    .put(api + "hotel/locations/" + props.location.id + "/", toUpload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      $q.notify("Temps ajouté avec succès");
    })
    .catch((err) => {
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
