<template>
  <q-card :class="'text-white bg-' + color">
    <q-card-section horizontal>
      <div class="row full-width">
        <div :class="'flex flex-center rounded-borders q-pa-md col-xs-4 bg-' + color">
          <q-icon
            size="lg"
            style="--fa-animation-iteration-count: 4"
            color="white"
            :name="icon"
          ></q-icon>
        </div>
        <div class="col-xs-8 q-pa-md text-center">
          <p class="col-xs-12">
            <b class="text-h4"> {{ number }}</b> <br />
            {{ title }} <br />
          </p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  color: String,
  icon: String,
  title: String,
  number: {
    type: Number,
    default: 0,
  },
});
</script>
