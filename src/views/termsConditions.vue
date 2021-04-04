<template>
  <div id="contactUs">
    <Overlay />
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-md-8">
          <div class="text-center" id="termsContent">
            <PageTitle :title="$t('terms.title')" classList="text-light" />

            <div
              v-for="object in $t('terms.content')"
              :key="object.title"
              class="terms"
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
  name: "TermsConditions",

  components: { PageTitle, Footer, Overlay },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("terms.title");
    if (this.$i18n.locale == "ar") {
      document.querySelectorAll(".terms").forEach(section => {
        section.style.textAlign = "right";
      });
    }
  },

  methods: {
    reCalculateHeight() {
      $("#termsContent").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("terms.title");
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

.terms {
  text-align: left;
}
</style>
