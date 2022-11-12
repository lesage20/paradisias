<template>
  <form-generator :fields="fields" :loading="loading" @save="getFormContent" @close="cancel" />
</template>

<script setup>
import { inject, ref, computed, onMounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const props = defineProps({
  client: {
    type: Boolean,
    default: true,
  },
});
const token = inject("token");
const api = inject("api");
const groups = ref([]);
let options = [];
const fields = computed(() => [
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
]);

onMounted(() => {
  axios
    .get(api + "accounts/groups/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      groups.value = res.data;
      groups.value.forEach((el) => {
        options.push(el.name);
      });
      if (!props.client) {
        fields.value.push({
          type: "select",
          label: "Le role de l'employé",
          model: "groups",
          options: options,
        });
      }
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
});
const emits = defineEmits(["close", "saved"]);
function cancel() {
  emits("close");
}
const $q = useQuasar();
const loading = ref(false);

function getFormContent(data) {
  loading.value = true;
  console.log(options);
  if (props.client) {
    data.groups = "client";
  }
  axios
    .post(api + "auth/registration/", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      emits("saved");
      console.log(res);
      loading.value = false;
      $q.notify("Compte crée avec succès");
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
