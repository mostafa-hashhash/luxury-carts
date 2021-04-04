import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Contact from "../views/Contact.vue";
import Identity from "../views/Identity.vue";
import PasswordReset from "../views/PasswordReset.vue";
import Confirmation from "../views/Confirmation.vue";
import BookingList from "../views/BookingList.vue";
import Error from "../views/Error.vue";
import termsConditions from "../views/termsConditions.vue";
import privacyPolicy from "../views/privacyPolicy.vue";
import aboutUs from "../views/aboutUs.vue";
import deliveryNote from "../views/DeliveryNote.vue";

import i18n from "../i18n";
import NProgress from "nprogress";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: `/${i18n.locale}`
    },
    {
      path: "/:lang",
      component: {
        render(c) {
          return c("router-view");
        }
      },
      children: [
        {
          path: "/",
          name: "Home",
          component: Home
        },
        {
          path: "contact",
          name: "Contact",
          component: Contact
        },
        {
          path: "identity",
          name: "Identity",
          component: Identity
        },
        {
          path: "deliveryNote",
          name: "DeliveryNote",
          component: deliveryNote,
          props: true,
          meta: {
            title: `Delivery Note`
          }
        },
        {
          path: "identity/reset-password",
          name: "Password Reset",
          component: PasswordReset
        },
        {
          path: "confirmation",
          name: "Confirmation",
          component: Confirmation
        },
        {
          path: "booking-list",
          name: "Booking List",
          component: BookingList
        },
        {
          path: "privacy-policy",
          name: "Privacy Policy",
          component: privacyPolicy
        },
        {
          path: "terms-and-conditions",
          name: "TermsConditions",
          component: termsConditions
        },
        {
          path: "about",
          name: "AboutUs",
          component: aboutUs
        },
        {
          path: "*",
          name: "Error",
          component: Error
        }
      ]
    }
  ]
});

NProgress.configure({ easing: "ease", speed: 500 });
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
