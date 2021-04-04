<template>
  <div class="row">
    <div class="col"></div>
    <div class="col-md-6">
      <div class="border bg-white p-5 mb-3">
        <h1>
          <img src="@/assets/scooter.png" alt="Image not found" />
        </h1>
        <h3 class="mt-5">
          {{ $t("empty.label") }}
        </h3>
      </div>
      <router-link
        :to="{ name: 'Home' }"
        class="btn btn-primary btn-lg w-100 mb-5"
      >
        {{ $t("empty.button") }}
      </router-link>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "Empty"
};
</script>
