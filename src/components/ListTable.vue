<template>
  <q-card>
    <q-toolbar class="row justify-between no-wrap">
      <div class="col-auto q-py-md">
        <div class="doc-card-title text-subtitle1">{{ title }}</div>
      </div>
      <div class="col-auto">
        <div class="row">
          <div class="col">
            <q-input
              v-model="search"
              clearable
              clear-icon="fa fa-close"
              placeholder="Recherche..."
              dense
              borderless
            >
              <template #append>
                <q-icon name="fa fa-search" color="grey-5" size="xs"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-5 q-pl-md q-pr-xs q-py-sm">
            <q-btn
              size="sm"
              icon="fa fa-plus"
              color="teal"
              unelevated
              label="Ajouter"
              @click="addItem"
            >
            </q-btn>
          </div>
        </div>
      </div>
    </q-toolbar>
    <q-toolbar v-if="tools" class="text-grey-9">
      <q-btn size="md" round flat icon="done" @click="singleSelect">
        <q-tooltip class="text-body2">
          {{ selectable == "single" ? "Désactiver" : "Activer" }} la selection
          unique
        </q-tooltip>
      </q-btn>
      <q-btn
        size="md"
        outlined
        round
        flat
        icon="done_all"
        @click="multipleSelect"
      >
        <q-tooltip class="text-body2">
          {{ selectable == "multiple" ? "Désactiver" : "Activer" }} la selection
          multiple
        </q-tooltip>
      </q-btn>
      <template v-if="locationTools">
        <q-btn
          v-if="selected.length == 1"
          size="md"
          outlined
          round
          flat
          icon="more_time"
          @click="emits('addTime')"
        >
          <q-tooltip class="text-body2">
            Ajouter temps supplémentaire
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="selected.length"
          size="md"
          outlined
          round
          flat
          icon="paid"
          @click="emits('paid')"
        >
          <q-tooltip class="text-body2">
            Marquée la/les selections payées
          </q-tooltip>
        </q-btn>
      </template>
      <template v-if="reservationTools">
        <q-btn
          v-if="selected.length == 1"
          size="md"
          outlined
          round
          flat
          icon="close"
          @click="emits('canceled')"
        >
          <q-tooltip class="text-body2"> Annuler la réservation </q-tooltip>
        </q-btn>

        <q-btn
          v-if="selected.length"
          size="md"
          outlined
          round
          flat
          icon="verified"
          @click="emits('verified')"
        >
          <q-tooltip class="text-body2"> Confirmée la réservation </q-tooltip>
        </q-btn>
      </template>

      <q-btn
        v-if="selected.length"
        size="md"
        outlined
        round
        flat
        icon="archive"
        @click="emits('archive')"
      >
        <q-tooltip class="text-body2"> Archivée la selection </q-tooltip>
      </q-btn>
      <q-btn
        v-if="selected.length"
        size="md"
        outlined
        round
        flat
        icon="schedule"
        @click="emits('pending')"
      >
        <q-tooltip class="text-body2">
          Mettre la selection en attente
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-table
      v-model:selected="selected"
      separator="cell"
      bordered
      :filter="search"
      flat
      :selection="selectable"
      :grid="grid"
      :columns="columns"
      :rows="items"
      :dense="dense"
    >
      <template #body-cell-status="attr">
        <slot name="status" :status="attr.row.status">
          <q-td class="text-center" :attr="attr">
            <q-icon
              v-if="attr.row.status == 'payée'"
              size="sm"
              color="primary"
              name="paid"
            >
              <q-tooltip class="text-body2"> Payée </q-tooltip>
            </q-icon>
            <q-icon
              v-if="attr.row.status == 'archivée'"
              size="sm"
              color="blue-7"
              name="archive"
            >
              <q-tooltip class="text-body2"> Archivée </q-tooltip>
            </q-icon>
            <q-icon
              v-if="attr.row.status == 'en attente'"
              size="sm"
              color="orange-8"
              name="schedule"
            >
              <q-tooltip class="text-body2"> En attente </q-tooltip>
            </q-icon>
          </q-td>
        </slot>
      </template>
      <template #body-cell-actions="attr">
        <q-td class="text-center" :attr="attr">
          <q-btn
            flat
            round
            class="q-mx-sm"
            color="red-9"
            size="sm"
            icon="fa-solid fa-trash"
            @click="deleteItem(attr.row)"
          >
            <q-tooltip class="text-body2">Supprimer</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            size="sm"
            class="q-mx-sm"
            color="blue-5"
            icon="fa fa-edit"
          >
            <q-tooltip class="text-body2">Modifier</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>
<script setup>
import { ref, inject, watch } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  grid: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  tools: {
    type: Boolean,
    default: false,
  },
  locationTools: { type: Boolean, default: false },
  reservationTools: { type: Boolean, default: false },
});

const search = ref("");
const selected = ref(inject("selected"));

const emits = defineEmits([
  "add",
  "delete",
  "update",
  "selected",
  "addTime",
  "archive",
  "paid",
  "canceled",
  "verified",
]);
watch(selected, () => {
  emits("selected");
});
function addItem() {
  emits("add");
}
function updateItem(item) {
  emits("update", item);
}
function deleteItem(item) {
  emits("delete", item);
}
const selectable = ref("none");

function singleSelect() {
  selected.value = [];
  if (selectable.value == "single") {
    selectable.value = "none";
  } else {
    selectable.value = "single";
  }
}
function multipleSelect() {
  if (selectable.value == "multiple") {
    selected.value = [];
    selectable.value = "none";
  } else {
    selectable.value = "multiple";
  }
}
</script>

<style>
.doc-card-title {
  margin-left: -24px;
  padding: 2px 10px 2px 24px;
  background: #e0e0e0;
  color: #616161;
  position: relative;
  border-radius: 3px 5px 5px 0;
}
.doc-card-title:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-top-color: #bebebe;
  border-width: 9px 0 0 11px;
}
</style>
