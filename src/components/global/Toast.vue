<template>
  <div>
    <div
      id="toast"
      :class="toastClassList"
      class="toast mx-3 my-3"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :data-delay="delay"
    >
      <div v-if="title" class="toast-header" :class="titleClassList">
        <strong class="mr-auto"> {{ title }}</strong>
      </div>
      <div class="toast-body" :class="bodyClassList">
        <div v-show="connectionStatus == 'offline'">
          <i class="fas fa-times d-inline" style="color: red"></i>
          {{ message }}
        </div>
        <div v-show="connectionStatus == 'online'">
          <i class="fas fa-wifi d-inline" style="color: green"></i>
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: [
    "title",
    "message",
    "bodyClassList",
    "delay",
    "titleClassList",
    "toastClassList",
    "connectionStatus"
  ]
};
</script>

<style lang="scss" scoped>
.toast {
  min-width: 250px;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 99;
}
</style>
