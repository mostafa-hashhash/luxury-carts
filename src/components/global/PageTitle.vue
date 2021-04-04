<template>
  <div id="PageTitle" class="py-3" :class="classList" style="z-index: 5">
    <h1 class="m-0">{{ title }}</h1>
    <p>{{ describtion }}</p>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["title", "describtion", "classList"]
};
</script>

<style lang="scss">
#PageTitle {
  z-index: 9 !important;
}
</style>
