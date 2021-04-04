<template>
  <div>
    <div id="notFound">
      <h1 class="display-1">404</h1>
      <h1 class="display-4">{{ $t("notFound.title") }}</h1>
      <h2 class="display-4">{{ $t("notFound.msg") }}</h2>
    </div>

    <Footer classList="bg-dark" />
  </div>
</template>

<script>
import Footer from "@/components/global/Footer.vue";

export default {
  name: "NotFound",

  components: {
    Footer
  }
};
</script>

<style lang="scss">
#notFound {
  margin: 10% auto;
  text-align: center;
}
</style>
