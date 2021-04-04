import $ from "jquery";

export default {
  showPageLoader() {
    document.querySelector("#page-loader").style.display = "flex";
  },
  hidePageLoader() {
    document.querySelector("#page-loader").style.display = "none";
  },
  toggleButtonLoading(target) {
    const $target = $(target);

    if ($target.prop("disabled") == true) {
      $target.prop("disabled", false);
      var txt = $target.data("text");
      $target.html(txt);
    } else {
      const spinnerHTML = `
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Loading...</span>
      `;
      $target.prop("disabled", true);
      $target.data("text", $target.text());
      $target.html(spinnerHTML);
    }
  },
  saveByteArray(reportName, bytes, type = "text/plain") {
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(bytes, { type: type }));
    link.download = reportName;
    // link.target = "_blank";
    link.click();
  }
};
