import axios from 'axios';
import store from 'store2';

try {
  axios.defaults.baseURL = process.env.HOST;
} catch (e) { }

try {
  axios.defaults.headers.common['X-Auth-Shop'] = store("shop");
} catch (e) { }

try {
  axios.defaults.headers.common['X-Auth-Password'] = process.env.API_PASSWORD;
} catch (e) { }

export function Axios(params, callback) {
  var config = {
    method: params.type || params.method,
    url: params.url
  };
  if (params.headers) {
    config["headers"] = params.headers;
  }
  if (params.data) {
    config["data"] = params.data;
  }
  axios(config).then(response => {
    if (typeof callback === "function") {
      return callback(null, response.data);
    }
  }).catch(error => {
    if (typeof callback === "function") {
      return callback({
        error: error
      });
    }
  });
};

export default axios;