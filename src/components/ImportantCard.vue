<template>
  <q-card flat :class="'text-' + color + ' bg-' + color + '-2'">
    <q-card-section class="q-py-none q-my-none">
      <q-item>
        <q-item-section v-if="icon" side>
          <q-icon :name="icon"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-center">
            {{ title }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section class="text-center q-py-none q-my-none">
      <div class="row full-width">
        <div class="col-12">
          <b class="text-h4"> {{ number }} <span v-if="!icon">F</span></b>
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
