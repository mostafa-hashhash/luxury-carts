<template>
  <div class="arrow h6" :class="classList" v-html="title"></div>
</template>

<script>
export default {
  name: "ArrowHeader",
  props: ["title", "classList"]
};
</script>

<style lang="scss" scoped>
.arrow {
  padding: 15px;
  background-color: #fff;
  clip-path: polygon(93% 0, 100% 51%, 93% 100%, 0% 100%, 5% 50%, 0% 0%);
}
</style>
