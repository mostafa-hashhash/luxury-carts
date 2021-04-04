import axios from "axios";
import NProgress from "nprogress";

var instance = null;
const endpoints = {
  defAxios(base_url = null, headers = null) {
    instance = axios.create({
      baseURL: base_url || process.env.VUE_APP_API_URL,
      headers: headers
        ? headers
        : {
            "Accept-Language": localStorage.getItem("locale") || "ar",
            "X-Functions-Key": process.env.VUE_APP_FUNCTIONS_KEY,
            "X-Organization-Code": process.env.VUE_APP_ORG_CODE,
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("user_token")
            )}`
          }
    });
  },
  Login(data, callBack = null, onError = null) {
    delete instance.defaults.headers.common["Authorization"];
    return instance
      .post("/api/identity/login", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  Register(data, callBack = null, onError = null) {
    return instance
      .post("/api/identity/register", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },
  MetaData(callBack = null, onError = null) {
    const token = localStorage.getItem("user_token");
    if (token) {
      instance.defaults.headers["Authorization"] = `Bearer ${JSON.parse(
        token
      )}`;
    } else {
      localStorage.removeItem("user_token");
      window.location = "/identity";
    }

    return instance
      .get("/api/settings/meta-data")
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },
  Settings(callBack, onError) {
    return instance
      .get("/api/settings/app-settings?ApiVersion=2")
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },
  PricingDetails(data, callBack = null, onError = null) {
    return instance
      .get(`/api/crm/payments/pricing-details?`, { params: data })
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  CreateSession(data, callBack = null, onError = null) {
    return instance
      .post("/api/payments/sessions", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  ConfirmBooking(data, callBack = null, onError = null) {
    return instance
      .post("/api/crm/confirm-booking", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  bookingSummary(data, callBack = null, onError = null) {
    return instance
      .get("/api/crm/reports/booking_vehicle_details", {
        params: data,
        responseType: "blob"
      })
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },
  DeliveryNotePdf(data, callBack = null, onError = null) {
    instance({
      url: `/api/crm/reports/delivery_notes?filters[agreement_id]=${data}`,
      method: "GET",
      responseType: "blob"
    })
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },
  SubmitPayment(data, callBack = null, onError = null) {
    return instance
      .post("api/crm/payments", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  BookingList(callBack = null, onError = null) {
    return instance
      .get("/api/crm/get-booking-list")
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  ResetPassword(data, callBack = null, onError = null) {
    delete instance.defaults.headers.common["Authorization"];
    instance
      .post("/api/identity/resetPassword", data)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(err => {
        if (onError) onError(err);
      });
  },

  ContactUs(data, callBack = null, onError = null) {
    return instance
      .post("/api/crm/contactUs", data)
      .then(r => {
        callBack(r);
      })
      .catch(err => {
        onError(err);
      });
  },

  CancelData(data, callBack, onError) {
    return instance
      .post("/api/crm/confirm-booking-cancellation", data)
      .then(r => callBack(r))
      .catch(err => onError(err));
  },

  CancelBooking(data, callBack, onError) {
    return instance
      .post("/api/crm/cancel-booking", data)
      .then(r => callBack(r))
      .catch(err => onError(err));
  },

  getCheckUpPdfList(data, callBack, onError) {
    return instance
      .get("/api/crm/stream-file", {
        params: data,
        responseType: "blob"
      })
      .then(r => callBack(r))
      .catch(err => onError(err));
  },

  fileStream() {
    // TODO: integrate with hub to fetch images without login required.
    return null;
  },
  attachFile(file, callBack = null, onError = null) {
    var form = new FormData();
    form.append("file", file, file.name);
    form.append("fileName", file.name);
    form.append("attachmentType", "");
    form.append("documentName", "");
    form.append("documentType", "");
    form.append("isPrivate", "");
    form.append("attachmentField", "");

    const url = process.env.VUE_APP_API_URL + "/api/crm/attach-file";
    return instance
      .post(url, form)
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(e => {
        if (onError) onError(e);
      });
  },
  checkPaymentStatus(queryId, callBack, onError) {
    return instance
      .get(process.env.VUE_APP_API_URL + "/api/payments/orders/" + queryId)
      .then(callBack)
      .catch(onError);
  },
  getBasicReport(data, callBack = null, onError = null) {
    return instance
      .get(process.env.VUE_APP_API_URL + "/api/crm/reports/basic?", {
        params: data,
        responseType: "blob"
      })
      .then(r => {
        if (callBack) callBack(r);
      })
      .catch(e => {
        if (onError) onError(e);
      });
  }
};

endpoints.defAxios();
instance.interceptors.request.use(config => {
  document.querySelectorAll("button").forEach(btn => {
    btn.setAttribute("disabled", true);
  });
  NProgress.start();
  return config;
});

instance.interceptors.response.use(response => {
  document.querySelectorAll("button").forEach(btn => {
    btn.removeAttribute("disabled");
  });
  NProgress.done();
  return response;
});
export default endpoints;
