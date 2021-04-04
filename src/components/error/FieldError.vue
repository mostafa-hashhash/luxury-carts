<template>
  <div>
    <span
      v-for="error in errorList"
      :key="error.id"
      class="d-block w-100 px-2"
      :class="{
        'text-right': $i18n.locale == 'ar',
        'text-left': $i18n.locale == 'en'
      }"
    >
      <span :class="error.className">
        {{ error.msg }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "FieldError",
  props: ["errorList"]
};
</script>
