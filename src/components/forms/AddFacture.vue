<template>
  <form-generator style="min-width:450px" :fields="fields" title="Ajouter un paiement" :dense="false"
    @save="getFormContent" @close="cancel" />
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useLoginStore } from "src/stores/login";
import { isBefore, isAfter } from "date-fns";

const props = defineProps({
  booking: {
    type: Number,
    default: null
  }
})
const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const loading = ref(false);
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const endpoints = [api + "hotel/locations/"]
const locations = ref([]);
function getDatas() {
  axios
    .all(
      endpoints.map((endpoint) =>
        axios.get(endpoint, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      )
    )
    .then(
      axios.spread((locationList) => {
        locations.value = locationList.data;
      })
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        //
      } else {
        if (err.response.status == "401") {
          router.push({ name: "Login" });//
        } else {
          dialog.update({
            title: "Erreur",
            message: `Une erreur s'est produite. <br/> code d'erreur: <b> ${err.response.status} </b> <br/> message: ${err.response.message}`,
            persistent: false,
            ok: true,
            progress: false,
          });
        }
      }
    });
}
onMounted(getDatas);

const fields = ref([
  {
    type: "number",
    name: "amount",
    model: "amount",
    required: true,
    label: "Montant"
  },
  {
    type: "select",
    label: "status de la commande",
    model: "status",
    hint: "Le status de la commande",
    options: [
      // 'dt',
      'dj',
      'pj',
      'dp',
      'archivée',
    ],
  },
]);
function validLocation(data, list) {
  let validation = { isValid: true, message: "" };
  if (Object.keys(data).length < 2) {
    validation = {
      isValid: false,
      message: "Tous les champs sont obligatoire",
    };
    return validation;
  } else if (data.amount <= 1000) {
    validation = {
      isValid: false,
      message:
        "Le montant ne peut etre inferieur a 1 000 FCFA",
    };
    return validation;
  }
  for (let el of list) {
    if (
      el.room == data.room &&
      isAfter(new Date(data.checkIn), new Date(el.checkIn)) &&
      isBefore(new Date(data.checkIn), new Date(el.checkOut))
    ) {
      validation = {
        isValid: false,
        message: "La chambre selectionnée est occupée",
      };
      break;
    }
  }
  return validation;
}
function getFormContent(data) {
  loading.value = true;
  const validation = validLocation(data, locations.value);
  data.recorded_by = useLoginStore().user.profil;
  if (props.booking != null) data.booking = props.booking
  if (!validation.isValid) {
    $q.notify(validation.message);
    return;
  }
  axios
    .post(api + "hotel/factures/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      loading.value = false;
      emits("saved");
      $q.notify("Location crée avec succès");
    })
    .catch((err) => {
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
