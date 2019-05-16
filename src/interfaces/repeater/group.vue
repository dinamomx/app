<template>
  <div class="repeater-group">
    <div class="repeater-group__header">
      <div>
        <v-icon name="drag_handle" class="drag_handle" size="18"></v-icon>
      </div>
      <label>{{ schema.title }}</label>
      <button @click="collapsed = !collapsed">
        <v-icon :name="collapsedIcon" :class="collapsedIcon" size="18"></v-icon>
      </button>
      <button v-if="!confirmDelete" @click="confirmDelete = true" key="delete0">
        <v-icon name="delete" class="delete" size="18"></v-icon>
      </button>
      <button v-else class="confirm-delete" @click="$emit('delete')" key="delete1">
        <v-icon name="delete" class="delete" size="18"></v-icon>
        ¿Are you shure?
      </button>
    </div>
    <div v-show="collapsed" class="repeater-group__body">
      <div v-if="schema.type === 'object'">
        <template v-for="(field, key) in schema.properties">
          <repeater-field
            v-if="field.type === 'field'"
            :key="(value[key] || {}).$id || key"
            :value="value[key]"
            @input="updateObjectValue({ value: $event, key })"
            :schema="field"
            @delete="deleteField(key)"
          />
          <repeater-group
            v-else-if="typeof value[key] !== 'undefined'"
            :key="`${(value[key] || {}).$id}-${key}`"
            :value="value[key]"
            :schema="field"
            @input="updateObjectValue({ value: $event, key })"
            @delete="deleteField(key)"
          />
        </template>
      </div>
      <div v-else-if="schema.type === 'array'">
        <template v-for="(group, key) in currentItems">
          <repeater-field
            v-if="group.type === 'field'"
            :key="(value[key] || {}).$id || key"
            :value="value[key] ? value[key].value : ''"
            :schema="group"
            @input="updateObjectValue({ value: $event, key })"
            @delete="deleteField(key)"
          />

          <repeater-group
            v-else-if="group.type === 'object'"
            :key="`${(value[key] || {}).$id}-${key}`"
            :value="value[key] ? value[key].value : ''"
            :schema="group"
            @input="updateObjectValue({ value: $event, key })"
            @delete="deleteField(key)"
          />
        </template>
        <repeater-controls :schema="schema.children" @add-field="addNewField" />
      </div>
    </div>
  </div>
</template>

<script>
import methods from "./repeater-mixin";
import RepeaterField from "./field.vue";
import RepeaterControls from "./controls.vue";

export default {
  name: "RepeaterGroup",
  mixins: [methods],
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
      currentItems: [],
      confirmDelete: false
    };
  },
  computed: {
    collapsedIcon() {
      return this.collapsed ? "unfold_less" : "unfold_more";
    },
    localValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  created() {
    if (!this.localValue) {
      if (this.schema.type === "object") {
        const localValue = {};
        Object.keys(this.schema.properties).forEach(key => {
          const prop = this.schema.properties[key];
          localValue[key] = prop.type === "array" ? [] : "";
        });
        // this.value.value = value;
        this.$emit("input", localValue);
      } else if (this.schema.type === "array") {
        this.$emit("input", []);
      }
    } else {
      if (this.schema.type === "array") {
        this.localValue.forEach(item => {
          const schemaI = this.schema.children.find(({ $key }) => $key === item.$key);
          this.currentItems.push(schemaI);
        });
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
button {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.confirm-delete {
  background: var(--danger);
  color: #fff;
  margin: -0.5rem -0.5rem -0.5rem 0;
  padding: 0.5rem;
}

.repeater-group {
  display: block;
  border: 1px solid var(--blue-grey);
  margin-bottom: 1rem;
}

.repeater-group__header {
  padding: 0.5rem;
  justify-content: space-between;
  display: flex;
  border-bottom: 1px solid var(--blue-grey);
}
.repeater-group label {
  padding: 0 1rem;
  flex: 1 0 auto;
}
.repeater-group__body {
  padding: 1rem;
}
</style>
