<template>
  <footer
    id="footer"
    class="pt-4"
    :class="classList"
    :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="container">
      <div class="row pb-3">
        <div class="col-md-4 col-sm-12 text-center">
          <SocialLinks />
        </div>

        <div class="col-md-4 col-sm-12 text-center">
          <p class="text-light m-0">{{ $t("foo.copy") }} &copy;</p>
        </div>
        <div class="col-md-4 col-sm-12 d-flex">
          <router-link class="text-white mx-2" :to="{ name: 'Contact' }">
            {{ $t("nav.contact") }}
          </router-link>

          <router-link
            class="text-white mx-2"
            :to="{ name: 'TermsConditions' }"
          >
            {{ $t("foo.terms") }}
          </router-link>

          <router-link class="text-white mx-2" :to="{ name: 'Privacy Policy' }">
            {{ $t("foo.policy") }}
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import SocialLinks from "@/components/home/SocialLinks";

export default {
  name: "Footer",
  props: ["isDark", "classList"],
  components: {
    SocialLinks
  },

  mounted: function() {
    if (this.$i18n.locale == "ar") {
      document.querySelector("#footer").style.direction = "rtl";
    }
  }
};
</script>
