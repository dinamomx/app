export default {
  methods: {
    /**
     * Sets the value for the top level items
     */
    updateObjectValue({ value, key }) {
      if (Array.isArray(this.value)) {
        const element = this.value[key];
        const newEl = element.$key ? Object.assign({}, element, { value }) : value;
        if (key === 0) {
          this.$emit("input", [newEl, ...this.value.slice(1)]);
        } else {
          this.$emit("input", [...this.value.slice(0, key), newEl, ...this.value.slice(key + 1)]);
        }
      } else {
        this.$emit("input", Object.assign({}, this.value, { [key]: value }));
      }
    },

    addNewField({ field }) {
      this.currentItems.push(field);
      const $key = field.$key;
      const payload = { value: "", $key: $key, $id: this.$helpers.shortid.generate() };
      if (Array.isArray(this.value)) {
        this.$emit("input", [...this.value, payload]);
      } else {
        this.$emit("input", [payload]);
      }
    },
    deleteField(index) {
      this.currentItems.splice(index, 1);
      if (index === 0) {
        this.$emit("input", [...this.value.slice(1)]);
      } else {
        this.$emit("input", [...this.value.slice(0, index), ...this.value.slice(index + 1)]);
      }
    }
  }
};
