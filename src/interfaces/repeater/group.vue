<template>
  <div class="repeater-group">
    <div class="repeater-group__header">
      <div>
        <v-icon name="drag_handle" class="drag_handle" size="18"></v-icon>
      </div>
      <label>{{ schema.title }}</label>
      <div @click="collapsed = !collapsed">
        <v-icon :name="collapsedIcon" :class="collapsedIcon" size="18"></v-icon>
      </div>
      <div>
        <v-icon name="delete" class="delete" size="18"></v-icon>
      </div>
    </div>
    <div v-show="collapsed" class="repeater-group__body">
      <div v-if="schema.type === 'object'">
        <template v-for="(field, key) in schema.properties">
          <RepeaterField
            v-if="field.type === 'field'"
            :key="key"
            v-model="value[key]"
            :schema="field"
          />
          <repeater-group
            v-else-if="typeof value[key] !== 'undefined'"
            v-model="value[key]"
            :schema="field"
            :key="key"
          />
        </template>
      </div>
      <div v-else-if="schema.type === 'array'">
        <template v-for="(group, i) in arrayFields">
          <repeater-field
            v-model="value[i].value"
            v-if="group.type === 'field'"
            :key="i"
            :schema="group"
          />

          <repeater-group
            v-model="value[i].value"
            v-else-if="group.type === 'object'"
            :key="i"
            :schema="group"
          />
        </template>
        <repeater-controls :schema="schema.children" @add-field="addNewField" />
      </div>
    </div>
  </div>
</template>

<script>
import RepeaterField from "./field.vue";
import RepeaterControls from "./controls.vue";

export default {
  name: "RepeaterGroup",
  components: {
    RepeaterField,
    RepeaterControls
  },
  props: {
    value: {
      type: [Object, Array, String],
      default: ""
    },
    schema: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      collapsed: false,
      arrayFields: []
    };
  },
  computed: {
    collapsedIcon() {
      return this.collapsed ? "unfold_less" : "unfold_more";
    }
  },
  created() {
    if (!this.value) {
      if (this.schema.type === "object") {
        const value = {};
        Object.keys(this.schema.properties).forEach(key => {
          const prop = this.schema.properties[key];
          value[key] = prop.type === "array" ? [] : "";
        });
        // this.value.value = value;
        this.$emit("input", value);
      } else if (this.schema.type === "array") {
        this.$emit("input", []);
      }
    } else {
      if (this.schema.type === "array") {
        this.value.forEach(item => {
          const schemaI = this.schema.children.find(({ $key }) => $key === item.$key);
          this.arrayFields.push(schemaI);
        });
      }
    }
  },
  methods: {
    addNewField({ field }) {
      this.arrayFields.push(field);
      if (Array.isArray(this.value)) {
        const payload = { field: field.title, value: "", $key: field.$key };
        // this.value.push(payload);
        console.log("Updating array", payload);
        this.$emit("input", [...this.value, payload]);
      } else {
        this.$emit("input", [{ field: field.title, value: "", $key: field.$key }]);
      }
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
.repeater-group {
  display: block;
  border: 1px solid var(--blue-grey);
  margin-bottom: 1rem;

  &__header {
    padding: 0.5rem;
    justify-content: space-between;
    display: flex;
    border-bottom: 1px solid var(--blue-grey);
    label {
      padding: 0 1rem;
      flex: 1 0 auto;
    }
  }
  &__body {
    padding: 1rem;
  }
}
</style>
