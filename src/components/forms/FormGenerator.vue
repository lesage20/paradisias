<template>
  <q-card :flat="flat">
    <q-toolbar v-if="title" :class="barClass">
      <q-btn
        v-if="$q.platform.is.mobile"
        round
        icon="fa fa-arrow-left"
        flat
        color="white"
        class="q-mx-none"
        @click="cancel"
      ></q-btn>

      <q-toolbar-title> {{ title }} </q-toolbar-title>
      <q-space v-if="$q.platform.is.desktop" />
      <q-btn
        v-if="$q.platform.is.desktop"
        round
        icon="close"
        flat
        color="white"
        @click="cancel"
      ></q-btn>
    </q-toolbar>
    <q-form>
      <div class="row">
        <div
          v-for="(field, i) in fields"
          :key="field.name"
          class="col-xs-12 col-sm-12 col-md-6 q-pa-sm"
        >
          <q-input
            v-if="
              field.type != 'select' &&
              field.type != 'date' &&
              field.type != 'datetime'
            "
            v-model="formContent[field.model]"
            :type="field.type ? field.type : ''"
            :label="field.label"
            :hint="field.hint ? field.hint : ''"
            :required="field.required ? true : false"
            :prefix="field.prefix ? field.prefix : ''"
            :suffix="field.suffix ? field.suffix : ''"
            :dense="dense"
            :autogrow="field.autogrow"
            :min="field.min"
          />
          <template v-else-if="field.type == 'date'">
            <q-input
              v-if="dateFocus[i] === undefined || dateFocus[i] === false"
              v-model="formContent[field.model]"
              :type="'text'"
              :label="field.label"
              :hint="field.hint ? field.hint : ''"
              :required="field.required ? true : false"
              :prefix="field.prefix ? field.prefix : ''"
              :suffix="field.suffix ? field.suffix : ''"
              :dense="dense"
              @click="textToDate(i)"
            />
            <div v-else>
              <q-dialog
                v-model="dateFocus[i]"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="formContent[field.model]"
                  :options="field.dateOptions"
                  :title="field.label"
                  years-in-month-view
                  today-btn
                  mask="YYYY-MM-DD"
                ></q-date>
              </q-dialog>
            </div>
          </template>
          <template v-else-if="field.type == 'datetime'">
            <q-input
              v-if="dateFocus[i] === undefined || dateFocus[i] === false"
              v-model="formContent[field.model]"
              :type="'text'"
              :label="field.label"
              :hint="field.hint ? field.hint : ''"
              :required="field.required ? true : false"
              :prefix="field.prefix ? field.prefix : ''"
              :suffix="field.suffix ? field.suffix : ''"
              :dense="dense"
              @click="textToDate(i)"
            />
            <div v-else>
              <q-dialog
                v-model="dateFocus[i]"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="formContent[field.model]"
                  :options="field.dateOptions"
                  :title="field.label"
                  years-in-month-view
                  today-btn
                  mask="YYYY-MM-DD HH:mm"
                ></q-date>
                <q-time
                  v-model="formContent[field.model]"
                  now-btn
                  :options="field.timeOption"
                  class="q-mx-md"
                  mask="YYYY-MM-DD HH:mm"
                />
              </q-dialog>
            </div>
          </template>
          <q-select
            v-else
            v-model="formContent[field.model]"
            :label="field.label"
            :options="field.options"
            emit-value
            :hint="field.hint"
            :dense="dense"
          >
            <span> {{ field["option-value"] }}</span>
          </q-select>
        </div>
      </div>
      <div class="row q-pa-sm justify-end item-end">
        <q-btn no-caps :color="btnColor" flat @click="cancel"> Annuler </q-btn>

        <q-btn no-caps :loading="loading" :color="btnColor" flat @click="save">
          Enregistrer
        </q-btn>
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  fields: { type: Array, required: true },
  barClass: {
    type: String,
    default: "bg-primary text-white",
  },
  btnColor: {
    type: String,
    default: "primary",
  },
  title: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: true,
  },
  flat: {
    type: Boolean,
    default: true,
  },
});

const formContent = reactive({});

const dateFocus = reactive({ 0: false });
const emits = defineEmits(["close", "save"]);
function cancel() {
  emits("close");
}
function save() {
  emits("save", formContent);
}
function textToDate(number) {
  console.log(Object.keys(dateFocus).length);
  dateFocus[number] = true;
}
</script>
