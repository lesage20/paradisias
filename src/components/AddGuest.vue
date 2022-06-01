<template>
  <form-generator
    :fields="fields"
    title="Ajouter un étage"
    @save="getFormContent"
    @close="cancel"
  />
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  activate: Boolean,
});
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
    label: "Nom de l'étage",
  },
  {
    autogrow: true,
    required: true,
    name: "firstname",
    model: "firstname",
    label: "Prenom du client",
    type: "text",
  },
  {
    name: "phone",
    type: "phone",
    model: "phone",
    required: true,
    label: "Numéro de téléphone du client",
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
    label: "Adress du client",
  },
  {
    autogrow: true,
    required: true,
    name: "DOB",
    model: "DOB",
    label: "Date de naissance du client",
    type: "date",
  },
  {
    name: "idType",
    type: "select",
    model: "idType",
    required: true,
    label: "Type de pièce du client",
  },
  {
    name: "idNumber",
    type: "text",
    model: "idNumber",
    required: true,
    label: "Numéro de la  pièce d'identité du client",
  },
  {
    type: "select",
    label: "Le genre du client",
    model: "genre",
    options: ["Homme", "Femme"],
  },
]);

function getFormContent(data) {
  console.log(data);
  return data;
}
</script>
