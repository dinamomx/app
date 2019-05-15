<template>
  <div class="controls">
    <v-button v-for="(field, key) in schema" :key="key" @click="$emit('add-field', { field, key })">
      <v-icon class="add" name="add" size="18" />
      {{ $t("add") }} {{ field.title }}
    </v-button>
  </div>
</template>

<script>
export default {
  name: "RepeaterControls",
  props: {
    schema: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
.controls {
  display: flex;
}
.style-btn {
  margin-right: 0.5rem;
}
</style>
