<template>
  <q-card class="q-px-xl">
    <q-toolbar>
      <h6 class="q-px-none text-subtitle1 q-py-sm q-ma-none">
        {{ title }}
      </h6>
    </q-toolbar>
    <q-card-section horizontal>
      <div class="row">
        <div class="col-xs-12 q-pt-lg">
          <apexchart
            width="100%"
            height="100%"
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
