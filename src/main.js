import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCountryCode from "vue-country-code";

Vue.use(VueCountryCode);
Vue.config.productionTip = false;

console.log(process.env.VUE_APP_ENVNAME);
console.log(process.env.VUE_APP_VERSION);

router.beforeEach((to, from, next) => {
  let language = to.params.lang;
  if (!language) language = "ar";
  i18n.locale = language;
  next();
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

function connectionStatusChanged(e) {
  if (e.type == "offline")
    window.vm.app.showMessage(i18n.t("otp.offline"), "offline");
  else window.vm.app.showMessage(i18n.t("otp.online"), "online");
}

window.addEventListener("online", connectionStatusChanged);
window.addEventListener("offline", connectionStatusChanged);
