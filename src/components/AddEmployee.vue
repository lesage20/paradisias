<template>
  <form-generator
    :fields="fields"
    title="Ajouter un employé"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref } from "vue";

const emits = defineEmits(["close", "save"]);
function cancel() {
  emits("close");
}
const fields = ref([
  {
    type: "text",
    name: "name",
    required: true,
    model: "name",
    label: "Nom de l'employé",
  },
  {
    autogrow: true,
    required: true,
    name: "firstname",
    model: "firstname",
    label: "Prenom de l'employé",
    type: "text",
  },
  {
    name: "phone",
    type: "phone",
    model: "phone",
    required: true,
    label: "Numéro de téléphone de l'employé",
  },
  {
    name: "email",
    type: "email",
    model: "email",
    required: true,
    label: "Email du client",
  },
  {
    type: "text",
    name: "address",
    required: true,
    model: "address",
    label: "Adresse de l'employé",
  },
  {
    autogrow: true,
    required: true,
    name: "DOB",
    model: "DOB",
    label: "Date de naissance de l'employé",
    type: "date",
  },
  {
    name: "idType",
    type: "select",
    model: "idType",
    required: true,
    label: "Type de pièce de l'employé",
  },
  {
    name: "idNumber",
    type: "text",
    model: "idNumber",
    required: true,
    label: "Numéro de la  pièce d'identité de l'employé",
  },
  {
    type: "select",
    label: "Le genre de l'employé",
    model: "genre",
    options: ["Homme", "Femme"],
  },
  {
    type: "select",
    label: "Le role de l'employé",
    model: "role",
    options: ["sécretaire", "caissier", "gerant"],
  },
]);

function getFormContent(data) {
  console.log(data);
  axios;
  return data;
}
</script>
