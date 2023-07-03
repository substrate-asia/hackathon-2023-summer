import qs from "qs";
import _ from "lodash";

// const baseUrl = process.env.REACT_APP_BASE_API + "";
import webconfig from "../webconfig";
import { formdataify } from "../utils";
const baseUrl = webconfig.apiUrl;

const request = {
  /**
   * @param url
   * @param options
   * @returns {Promise<unknown>}
   */
  request: function (url, options = {}) {
    url = baseUrl + url;
    if (!options.method) options.method = "get";
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          // resolve({ code: 503, msg: '网络错误！' });
          reject(error);
        });
    });
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  get: async function (
    url,
    options = {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    }
  ) {
    options = _.assign(
      {
        method: "get",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      },
      options
    );
    // url = url + '?' + qs.stringify(options.data, { encodeValuesOnly: true }) + '&' + new Date().getTime()
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  post: async function (url, options = { method: "post" }) {
    options.method = "post";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = options.data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  put: async function (url, options = { method: "put" }) {
    options.method = "put";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = formdataify(options.data);
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
};

export default request;
