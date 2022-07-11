<script setup>
import { ref } from "vue";
import axios from "src/boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const role = ref("");
function addRole() {
  $q.dialog({
    title: "Ajouter un role",
    prompt: {
      label: "Entrez le nom du nouveau role",
      model: role,
    },
  })
    .onOk((data) => {
      console.log(">>>> OK, received", data);
    })
    .onCancel(() => {
      console.log(">>>> Cancel");
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}
</script>
