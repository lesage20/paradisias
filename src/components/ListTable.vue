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
    <q-table
      separator="cell"
      bordered
      :filter="search"
      flat
      :grid="grid"
      :columns="columns"
      :rows="items"
    >
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
            <q-tooltip>Supprimer</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            size="sm"
            class="q-mx-sm"
            color="blue-5"
            icon="fa fa-edit"
          >
            <q-tooltip>Modifier</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>
<script setup>
import { ref } from "vue";

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
});

const search = ref("");

const emits = defineEmits(["add", "delete", "update"]);
function addItem() {
  emits("add");
}
function updateItem(item) {
  emits("update", item);
}
function deleteItem(item) {
  emits("delete", item);
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
