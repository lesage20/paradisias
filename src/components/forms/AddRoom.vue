<template>
  <form-generator :fields="fields" title="Ajouter un étage" :loading="loading" @save="getFormContent" @close="cancel" />
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
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
const endpoints = [api + "hotel/types_chambre/", api + "hotel/etages/"];
let typeOptions = ref([]);
let floorOptions = ref([]);
onMounted(() => {
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
      axios.spread((types, floors) => {
        console.log(types, floors);
        types.data.forEach((el) => {
          let opt = {
            label: el.name,
            value: el.id,
          };
          typeOptions.value.push(opt);
        });
        floors.data.forEach((el) => {
          let opt = {
            label: el.name,
            value: el.id,
          };
          floorOptions.value.push(opt);
        });
      })
    )
    .catch((err) => {
      let dialog = $q.dialog({});
      if (!Boolean(err.response)) {
        // dialog
        //   .update({
        //     title: "Erreur de réseau",
        //     message:
        //       "Impossible de se connecter au server. Veuillez vous connecter à internet et actualiser",
        //     ok: "actualiser",
        //     progress: false,
        //     persistent: true,
        //   })
        //   .onOk(() => {
        //     window.location.reload();
        //   });
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
});

const fields = ref([
  {
    type: "text",
    name: "number",
    required: true,
    model: "number",
    label: "Numéro de la chambre",
  },
  {
    autogrow: true,
    required: true,
    name: "type",
    model: "type",
    label: "Type de chambre",
    type: "select",
    options: typeOptions,
  },
  {
    name: "floor",
    type: "select",
    model: "floor",
    options: floorOptions,
    required: true,
    label: "le niveau d'étage de la chambre",
  },
]);
function getFormContent(data) {
  loading.value = true;
  console.log(data);
  axios
    .post(api + "hotel/chambres/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res);
      loading.value = false;
      $q.notify("Chambre crée avec succès");
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
