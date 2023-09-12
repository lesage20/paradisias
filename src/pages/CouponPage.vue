<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-dialog v-model="add" :maximized="$q.platform.is.mobile">
          <AddCoupon @close="add = false" />
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12 desktop-only">
        <ListTable :columns="columns" :items="items" title="Coupons" @add="add = true" @delete="deleteCoupon" />
      </div>
      <div class="col-12 mobile-only">
        <q-toolbar>
          <q-toolbar-title> Liste de coupons </q-toolbar-title>
        </q-toolbar>
        <q-list>
          <q-item v-for="item in items" :key="item.name">
            <q-item-section side avatar>
              <q-avatar color="teal-1">
                <q-icon color="teal" name="local_offer"> </q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.title }}
              </q-item-label>
              <q-item-section caption class="text-grey">
                {{ item.description }}
              </q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-badge class="bg-teal-1 text-teal" size="xs">
                {{ item.discount }}%
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-page-sticky v-if="$q.platform.is.mobile" :offset="[18, 18]">
      <q-btn class="shadow-20" round size="md" icon="add" color="teal-8" @click="add = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
const ListTable = defineAsyncComponent(() =>
  import("src/components/ListTable.vue")
);
const AddCoupon = defineAsyncComponent(() =>
  import("src/components/forms/AddCoupon.vue")
);
const token = inject("token");
const api = inject("api");
const $q = useQuasar();
const items = ref([]);
function getData() {
  axios
    .get(api + "hotel/coupons/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => (items.value = [...res.data]))
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
}
onMounted(getData);
const add = ref(false);
const columns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "center",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "title",
    align: "center",
    label: "Titre",
    field: "title",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "center",
    sortable: true,
  },
  {
    name: "discount",
    label: "Réduction (%)",
    field: "discount",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
  },
];
function deleteCoupon(coupon) {
  $q.dialog({
    title: "Suppression d'élément",
    message: `Voulez vous vraiment supprimer <b> ${coupon.title} </b> de la liste de coupons?`,
    ok: { label: "supprimer", color: "red", flat: true },
    cancel: "annuler",
    html: true,
  }).onOk(() => {
    del(coupon.id);
  });
}
function del(id) {
  axios
    .delete(api + "hotel/coupons/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(() => {
      $q.notify("Coupon supprimé avec suuccès");
      getData();
    });
}
</script>
