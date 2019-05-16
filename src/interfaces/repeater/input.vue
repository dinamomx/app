<template>
  <div class="interface-repeater-container">
    <div class="repeater-group-container" dropzone="true">
      <template v-for="(group, i) in currentItems">
        <repeater-field
          v-if="group.type === 'field'"
          :key="(value[i] || {}).$id || i"
          :value="value[i] ? value[i].value : i"
          :schema="group"
          @input="updateObjectValue({ value: $event, key: i })"
          @delete="deleteField(i)"
        />
        <repeater-group
          v-else-if="group.type === 'object'"
          :key="(value[i] || {}).$id || i"
          :schema="group"
          :value="value[i] ? value[i].value : i"
          @input="updateObjectValue({ value: $event, key: i })"
          @delete="deleteField(i)"
        />
      </template>
      <controls :schema="schema" @add-field="addNewField"></controls>
    </div>
    value
    <pre class="pre" v-text="value"></pre>
    currentItems
    <pre class="pre" v-text="currentItems"></pre>
    <div v-if="!isValid">
      <v-notice color="warning">
        Error parsing the input, please replicate your data into the field interface.
        <br />
        <span class="style-3">
          DO NOT SAVE UNITL YOU HAVE FINISHED COMPLETING THE MIGRATION, OTHERWISE YOUR DATA WILL BE
          LOST
        </span>
      </v-notice>
      <div v-text="originalValue" class="pre"></div>
    </div>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import methods from "./repeater-mixin";
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
  mixins: [mixin, methods],
  components: { Controls, RepeaterField, RepeaterGroup },
  data() {
    return {
      currentItems: [],
      isValid: true,
      originalValue: ""
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
    // If null or ''
    if (this.value === null || this.value == "") {
      this.$emit("input", []);
    } else if (Array.isArray(this.value) && this.value.length > 0) {
      this.value.forEach(item => {
        const schemaI = this.schema.find(({ $key }) => $key === item.$key);
        if (schemaI) {
          this.currentItems.push(schemaI);
        } else {
          this.invalidData();
        }
      });
    } else {
      this.invalidData();
    }
  },
  methods: {
    invalidData() {
      this.isValid = false;
      this.originalValue = _.merge({}, [this.value]);
      this.$emit("input", []);
    }
  }
};
</script>

<style scoped>
.v-input {
  width: 100%;
  max-width: var(--width-medium);
}

.group {
  border-bottom: 1px solid var(--gray);
  margin-bottom: 1rem;
}
.pre {
  max-width: 100%;
  max-height: 300px;
  overflow: auto;
  white-space: pre;
  font-family: "Courier New", Courier, monospace;
  padding: 0.5rem;
  border: 1px solid var(--light-gray);
  margin-top: 1rem;
  background-color: var(--lightest-gray);
  border-radius: var(--border-radius);
}
</style>
