<template>
  <div class="container" id="failure">
    <div class="row mb-5">
      <div class="col"></div>
      <div class="col-md-5 mb-5">
        <div class="border border-primary shadow bg-white mx-auto p-5">
          <img src="@/assets/error.svg" alt="Image not found" />
          <h2 class="mt-5 text-primary">{{ $t("failure.message") }}</h2>
          <Alert
            v-if="message"
            class="alert-danger success-alert w-100 mt-4"
            :dimissable="false"
            :message="message"
          />
          <router-link :to="{ name: 'Home' }" class="btn btn-primary w-100">
            {{ $t("globals.Home") }}
          </router-link>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/global/Alert";

export default {
  name: "Failure",
  components: { Alert },
  props: ["message"],
  mounted() {
    Alert.methods.show("success-alert");
  }
};
</script>
