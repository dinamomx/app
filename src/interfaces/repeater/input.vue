<template>
  <div class="interface-repeater-container">
    <!-- <pre v-text="currentItems"></pre> -->
    <div class="repeater-group-container" dropzone="true">
      <template v-for="(group, i) in currentItems">
        <repeater-field
          v-model="value[i].value"
          v-if="group.type === 'field'"
          :key="i"
          :schema="group"
        />
        <repeater-group
          v-else-if="group.type === 'object'"
          :key="i"
          :schema="group"
          v-model="value[i].value"
        />
      </template>
    </div>
    <controls :schema="schema" @add-field="addNewField"></controls>
    <pre v-text="value"></pre>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import Controls from "./controls.vue";
import RepeaterField from "./field.vue";
import RepeaterGroup from "./group.vue";

/**
 * @typedef {Object} ReplicatorConfig
 * @property {'object'|'field'|'array'} type The type of field to use
 * @property {string} title The label for the field
 * @property {string} [interface] The field type to use
 * @property {string} [interfaceOptions] The options passed down to the field
 * @property {string} [properties] The options passed down to the field
 * @property {ReplicatorConfig[]} [children] Nested fields
 */

export default {
  name: "RepeaterInput",
  mixins: [mixin],
  components: { Controls, RepeaterField, RepeaterGroup },
  data() {
    return {
      currentItems: []
    };
  },
  computed: {
    /** @returns {ReplicatorConfig[]} */
    schema() {
      const s = Array.isArray(this.options.schema) ? this.options.schema : [this.options.schema];
      return s;
    }
  },
  created() {
    if (!Array.isArray(this.value)) {
      this.$emit("input", []);
    } else {
      this.value.forEach(item => {
        const schemaI = this.schema.find(({ $key }) => $key === item.$key);
        this.currentItems.push(schemaI);
      });
    }
  },
  methods: {
    /**
     * @param {number}i The index of the item
     */
    addNewField({ field }) {
      this.currentItems.push(field);

      this.value.push({ field: field.title, value: "", $key: field.$key });
    },
    /**
     * Sets the value for the top level items
     */
    updateValue({ value, key, index, field }) {
      this.value.splice(index, 1, { field, value, $key: key });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  width: 100%;
  max-width: var(--width-medium);
}

.group {
  border-bottom: 1px solid var(--gray);
  margin-bottom: 1rem;
}
</style>
