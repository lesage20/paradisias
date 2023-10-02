<template>
  <form-generator :fields="fields" :loading="loading" @save="getFormContent" @close="cancel" />
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter()
const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user"
  }
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
      users = res.data.filter(el => el.profil == null)

      users.forEach((el) => {
        let opt = {
          label: el.username,
          value: el.id,
        };
        userOptions.value.push(opt);
      });
    })
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
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const loading = ref(false);

const fields = ref([
  // {
  //   type: "select",
  //   options: userOptions,
  //   "emit-value": true,
  //   name: "user",
  //   required: true,
  //   model: "user",
  //   label: "Compte Utilisateur*",
  // },
  {
    type: "text",
    name: "name",
    required: true,
    model: "name",
    label: "Nom *",
  },
  {
    autogrow: true,
    required: true,
    name: "firstname",
    model: "firstname",
    label: "Prenom *",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "DOB",
    model: "dob",
    label: "Date de naissance *",
    type: "date",
  },
  {
    autogrow: true,
    required: true,
    name: "place_of_birth",
    model: "place_of_birth",
    label: "Lieu de naissance *",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "father",
    model: "father",
    label: "Nom et prenoms du père *",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "mother",
    model: "mother",
    label: "Nom et prenoms de la mère *",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "job",
    model: "job",
    label: "Profession *",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "domicile",
    model: "domicile",
    label: "Domicile actuelle *",
    type: "text",
  },

  {
    autogrow: true,
    required: true,
    name: "nationnalite",
    model: "nationnalite",
    label: "Nationnalité *",
    type: "text",
  },
  {
    name: "phone",
    type: "phone",
    model: "phone",
    required: true,
    label: "Numéro de téléphone *",
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
    label: "Adresse du " + props.title,
  },

  {
    name: "idType",
    type: "select",
    model: "idType",
    required: true,
    label: "Type de pièce *",
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
    label: "Numéro de la  pièce d'identité *",
  },
  {
    autogrow: true,
    required: true,
    name: "id_delivered_at",
    model: "id_delivered_at",
    label: "Pièce d'identité ou passeport délivré le ",
    type: "date",
  },
  {
    autogrow: true,
    required: true,
    name: "id_delivered_place",
    model: "id_delivered_place",
    label: "Pièce d'identité ou passeport délivré à ( lieu ) ",
    type: "text",
  },
  {
    autogrow: true,
    required: true,
    name: "id_delivered_by",
    model: "id_delivered_by",
    label: "Pièce d'identité ou passeport délivré par ",
    type: "text",
  },
  {
    type: "select",
    label: "Le genre *",
    model: "gender",
    options: ["homme", "femme"],
  },
]);

function getFormContent(data) {
  loading.value = true;
  axios
    .post(api + "accounts/profiles/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
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
