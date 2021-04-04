<template>
  <div id="contactUs">
    <Overlay />
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-md-8">
          <div class="text-center" id="aboutContent">
            <PageTitle :title="$t('about.title')" classList="text-light" />

            <p
              v-for="pg in $t('about.paragraph')"
              :key="pg"
              class="about-us-text"
            >
              {{ pg }}
            </p>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import PageTitle from "@/components/global/PageTitle.vue";
import Footer from "@/components/global/Footer.vue";
import Overlay from "@/components/global/Overlay.vue";
import $ from "jquery";

export default {
  name: "AboutUs",

  components: {
    PageTitle,
    Footer,
    Overlay
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("nav.about");

    if (this.$i18n.locale == "ar") {
      document.querySelectorAll(".about-us-text").forEach(x => {
        x.style.textAlign = "right";
      });
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("nav.about");
  },

  methods: {
    reCalculateHeight() {
      $("#aboutContent").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  }
};
</script>

<style lang="scss">
#contactUs {
  position: relative;
  background-image: url("~@/assets/home.png");
  background-attachment: fixed;
  background-size: cover;
  z-index: 0;
}

.about-us-text {
  color: white;
  text-align: left;
  font-size: 16px;
}
</style>
