<template>
  <div id="overlay"></div>
</template>

<script>
export default {
  name: "Overlay"
};
</script>

<style lang="scss">
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: -1;
}
</style>
