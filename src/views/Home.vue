<template>
  <div id="home">
    <Overlay />
    <div id="homeView">
      <PageTitle
        :title="$t('details.title')"
        :describtion="$t('details.desc')"
        classList="text-light text-center pt-5"
      />
      <DetailsInput :key="detailsKey" />
    </div>
    <Footer />
  </div>
</template>

<script>
import DetailsInput from "@/components/home/DetailsInput.vue";
import Footer from "@/components/global/Footer.vue";
import PageTitle from "@/components/global/PageTitle.vue";
import Overlay from "@/components/global/Overlay.vue";
import $ from "jquery";
export default {
  name: "Home",
  data() {
    return {
      detailsKey: -1000
    };
  },
  methods: {
    reloadDetails() {
      this.detailsKey += 1;
    },

    reCalculateHeight() {
      $("#homeView").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },
  components: {
    DetailsInput,
    Footer,
    PageTitle,
    Overlay
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("nav.home");
    window.vm.home = this;
    if (!localStorage.getItem("user_token"))
      this.$router.push({ name: `Identity` });
  },

  beforeUpdate: function() {
    document.title = this.$t("nav.home");
  }
};
</script>

<style lang="scss">
#home {
  position: relative;
  background-image: url("~@/assets/home.png");
  background-attachment: fixed;
  background-size: cover;
  color: aliceblue;
  z-index: 0;
}
</style>
