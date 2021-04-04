<template>
  <div>
    <embed id="pdfViewer" src="" width="100%" type="application/pdf" />
    <Footer class="bg-dark" style="margin-top: -6px" />
  </div>
</template>

<script>
import API from "@/apis";
import Footer from "@/components/global/Footer";
import $ from "jquery";

export default {
  name: "DeliveryNote",
  props: ["rentalAgreementId"],
  components: { Footer },

  mounted() {
    document.title = this.$t("deliveryNote");
    this.reCalculateHeight();
    window.addEventListener("resize", this.reCalculateHeight);

    API.DeliveryNotePdf(
      this.rentalAgreementId,
      r => {
        var fileURL = URL.createObjectURL(
          new Blob([r.data], {
            type: "application/pdf"
          })
        );
        document.getElementById("pdfViewer").src = fileURL;
      },
      err => {
        console.log(err);
      }
    );
  },

  methods: {
    reCalculateHeight() {
      $("#pdfViewer").css(
        "min-height",
        window.innerHeight - ($("nav").height() + $("footer").height())
      );
    }
  },

  beforeUpdate: function() {
    document.title = this.$t("deliveryNote");
  }
};
</script>
