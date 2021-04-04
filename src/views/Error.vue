<template>
  <div class="text-center pt-5" id="errorContent">
    <NotFound v-if="status == '404'" />
  </div>
</template>

<script>
import NotFound from "@/components/error/NotFound";
import $ from "jquery";

export default {
  name: "Error",
  data() {
    return {
      status: "404"
    };
  },
  components: { NotFound },

  beforeUpdate: function() {
    document.title = this.$t("notFound.title");
  },

  mounted: function() {
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    document.title = this.$t("notFound.title");
  },

  methods: {
    reCalculateHeight() {
      $("#errorContent").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  }
};
</script>
