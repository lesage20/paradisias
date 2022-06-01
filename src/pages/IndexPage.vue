<template>
  <q-page>
    <div class="q-px-md q-py-sm row q-gutter-md">
      <div class="col-xs-6 col-sm-6 col-md-4">
        <ImportantCard
          color="teal"
          title="Commandes"
          :number="5"
          icon="fa fa-list"
        />
      </div>
      <div class="col">
        <ImportantCard
          title="Gain Aujourd'hui"
          color="orange-9"
          icon="fa fa-dollar-sign fa-bounce"
        />
      </div>
      <div class="col">
        <ImportantCard
          color="teal"
          title="Chambres Reservées"
          :number="3"
          icon="fa fa-bed"
        />
      </div>
    </div>
    <div class="q-px-md q-py-sm row q-gutter-md">
      <div class="col-xs-6 col-sm-6 col-md-3">
        <ImportantCard title="Coup Util Auj" color="teal" icon="fa fa-ticket" />
      </div>
      <div class="col">
        <ImportantCard
          title="Total Coupons"
          color="orange-9"
          icon="fa fa-ticket"
        />
      </div>
      <div class="col">
        <ImportantCard
          title="Total Chambres"
          icon="fa fa-bed"
          color="orange-9"
        />
      </div>
      <div class="col">
        <ImportantCard title="Total Invités" icon="fa fa-users" color="teal" />
      </div>
    </div>
    <div class="q-px-md q-py-sm row q-gutter-sm">
      <div class="col">
        <ReportChart title="Rapport de revnue hebdo" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import ImportantCard from "src/components/ImportantCard.vue";
import ReportChart from "src/components/ReportChart.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
</script>
