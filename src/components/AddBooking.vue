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
import { ref, onMounted, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useLoginStore } from "src/stores/login";
import { isBefore, isAfter } from "date-fns";

const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const loading = ref(false);
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const endpoints = [
  api + "hotel/types_chambre/",
  api + "accounts/clients/",
  api + "hotel/chambres/",
  api + "hotel/locations/",
];
const typeOptions = ref([]);
const clientOptions = ref([]);
const roomOptions = ref([]);
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
      axios.spread((types, clients, rooms, locationList) => {
        locations.value = locationList.data;
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
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        dialog
          .update({
            title: "Erreur de réseau",
            message:
              "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
            ok: "actualiser",
            progress: false,
            persistent: true,
          })
          .onOk(() => {
            window.location.reload();
          });
      } else {
        if (err.response.status == "401") {
          dialog
            .update({
              title: "Erreur",
              message:
                "Votre delai de connexion est passé veuillez vous reconnecter",
              ok: "se connecter",
              progress: false,
            })
            .onOk(() => {
              store().logout();
              router.push({ name: "Login" });
            });
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
    type: "datetime",
    model: "checkIn",
    required: true,
    label: "Date d'entrée",
  },
  {
    name: "checkOut",
    type: "datetime",
    model: "checkOut",
    required: true,
    label: "Date de sorti",
    timeOption: (hr, min, sec) => hr <= 12,
  },
  {
    type: "select",
    label: "status de la commande",
    model: "status",
    hint: "Le status de la commande",
    options: ["en attente", "payée", "archivée"],
  },
]);
function validLocation(data, list) {
  let validation = { isValid: true, message: "" };
  if (Object.keys(data).length < 6) {
    validation = {
      isValid: false,
      message: "Tous les champs sont obligatoire",
    };
    return validation;
  } else if (
    isBefore(new Date(data.checkIn), new Date()) ||
    isBefore(new Date(data.checkOut), new Date())
  ) {
    validation = {
      isValid: false,
      message:
        "La date d'entrée ou de sortie ne peut pas être avant maintenant",
    };
    return validation;
  } else if (isBefore(new Date(data.checkOut), new Date(data.checkIn))) {
    validation = {
      isValid: false,
      message: "La date d'entrée ne peut pas être après la date de sortie",
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
  console.log(validLocation(data, locations.value));
  if (!validation.isValid) {
    $q.notify(validation.message);
    return;
  }
  axios
    .post(api + "hotel/locations/", data, {
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
