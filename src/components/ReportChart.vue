<template>
  <q-card class="q-px-xl">
    <q-toolbar>
      <h6 class="q-px-none text-subtitle1 q-py-sm q-ma-none">
        {{ title }}
      </h6>
    </q-toolbar>
    <q-card-section horizontal>
      <div class="row">
        <div class="col-xs-6">
          <q-card-section>
            <q-list separator>
              <q-item
                class="q-pa-sm q-ma-none"
                v-for="(cat, i) in options.xaxis.categories"
                :key="cat"
              >
                <q-item-section>
                  <q-item-label caption> {{ cat }} </q-item-label>
                </q-item-section>
                <q-item-section side> {{ series[0].data[i] }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </div>
        <div class="col-xs-6 q-pt-lg">
          <apexchart
            width="550"
            type="bar"
            :options="options"
            :series="series"
          ></apexchart>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  options: Object,
  series: Array,
  title: String,
});
const options = ref({
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ],
  },
});
const series = ref([
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70],
  },
]);
</script>
