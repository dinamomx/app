<template>
  <div class="field">
    <label>{{ schema.title }}</label>
    {{ value }}
    <v-ext-input
      @input="$emit('input', $event)"
      :value="value"
      :id="schema.interface"
      :name="schema.title"
      :options="schema.interfaceOptions"
    />
  </div>
</template>

<script>
export default {
  name: "RepeaterField",
  props: {
    value: {
      type: [Object, Array, String, Number],
      default: ""
    },
    schema: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
label {
  margin-bottom: 10px;
  width: max-content;
}
.field {
  margin-bottom: 1rem;
}
</style>
