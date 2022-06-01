<template>
  <q-breadcrumbs class="text-grey q-pt-sm" active-color="purple">
    <template #separator>
      <q-icon size="1.2em" name="arrow_forward" color="purple" />
    </template>

    <transition-group
      appear
      enter-active-class="animated backInDown"
      leave-active-class="animated backOutDown"
    >
      <template v-for="item in props.items" :key="item">
        <q-breadcrumbs-el
          v-if="item.name !== 'Home'"
          :label="item.name"
          icon="arrow_forward"
          :to="item.path"
          active-class="text-teal"
          exact
        />
        <q-breadcrumbs-el v-else :label="item.name" :to="item.path" />
      </template>
    </transition-group>
  </q-breadcrumbs>
</template>
<script setup>
const props = defineProps({
  items: Array,
});
</script>
