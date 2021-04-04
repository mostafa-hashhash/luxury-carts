<template>
  <div id="contactUs">
    <Overlay />
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-md-8">
          <div class="text-center" id="privacyContent">
            <PageTitle :title="$t('privacy.title')" classList="text-light" />

            <div
              v-for="object in $t('privacy.content')"
              :key="object.title"
              class="privacy"
            >
              <h3>{{ object.title }}</h3>

              <p v-for="section in object.paragraph" :key="section.id">
                {{ section }}
              </p>

              <br />
            </div>
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
  name: "Privacy Policy",

  components: { PageTitle, Footer, Overlay },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("privacy.title");
    if (this.$i18n.locale == "ar") {
      document.querySelectorAll(".privacy").forEach(section => {
        section.style.textAlign = "right";
      });
    }
  },

  methods: {
    reCalculateHeight() {
      $("#privacyContent").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("privacy.title");
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
  color: white;
}

.privacy {
  text-align: left;
}
</style>
