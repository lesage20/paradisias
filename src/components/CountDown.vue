<template>
  <p class="text-h4 text-red q-ma-none" v-bind="$attrs">
    <span v-if="daysToShow"> {{ daysToShow }}jrs </span>
    <span v-if="hoursToShow"> {{ hoursToShow }}hrs </span>
    <span v-if="minutesToShow"> {{ minutesToShow }}min </span>
    <span> {{ secondsToShow }}s </span>
  </p>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  date: { type: String, default: "2022-05-31" },
});
const daysToShow = ref(0);
const hoursToShow = ref(0);
const minutesToShow = ref(0);
const secondsToShow = ref(0);

var dateToNow = setInterval(function () {
  let now = new Date().getTime();
  let timeleft = new Date(props.date).getTime() - now;
  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
  daysToShow.value = days;
  hoursToShow.value = hours;
  minutesToShow.value = minutes;
  secondsToShow.value = seconds;

  if (timeleft < 0) {
    clearInterval(dateToNow);
  }
}, 1000);
</script>
