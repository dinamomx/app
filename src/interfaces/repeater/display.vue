<template>
  <ul v-if="itemCount" class="replicator-display">
    <li v-for="(v, key) in itemCount" :key="key">
      <b>{{ key }}</b>
      with {{ v }} elements
    </li>
  </ul>
  <div v-else>
    No items
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  name: "ReplicatorDisplay",
  mixins: [mixin],
  computed: {
    itemCount() {
      if (!Array.isArray(this.value)) {
        return null;
      }
      return this.value.reduce((prev, value) => {
        if (!prev[value.field]) {
          prev[value.field] = 0;
        }
        prev[value.field] += 1;
        return prev;
      }, {});
    }
  }
};
</script>

<style lang="scss" scoped>
.replicator-display {
  list-style: none;
  margin: 0;
  padding: 0;
  font-weight: normal;
  b {
    font-weight: bold;
  }
  li {
    display: inline-block;
    font-size: 0.8rem;
    white-space: nowrap;
    background: var(--accent);
    padding: 0.25rem;
    margin-right: 0.25rem;
    color: var(--white);
    border-radius: 3px;

    // &:not(:last-child) {
    //   &::after {
    //     content: "|";
    //     display: inline-block;
    //     margin: 0 0.5rem;
    //   }
    // }
  }
}
</style>
