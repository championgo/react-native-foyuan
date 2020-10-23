import { default as Storage } from "./storage";
import pathInterceptor from "./pathInterceptor";
import { DeviceEventEmitter } from 'react-native';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default request = async (
  url = "",
  data = {},
  method = "POST",
  needToken = true,
  type = false
) => {
  const headers = { "Content-Type": "application/json" };
  let options;
  if (needToken == true) {
    const token = await Storage.get("user_token");
    headers["Authorization"] = `Bearer ${token["token"]}`;
  }

  url = /http:\\/.test(url) ? url : pathInterceptor.request(url, type);
  try {
    // Default options are marked with *
    options = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      headers: headers
    };
    if (method == "GET") {
      if (data) {
        let paramsArray = [];
        Object.keys(data).forEach(key =>
          paramsArray.push(key + "=" + data[key])
        );
        if (url.search(/\?/) === -1) {
          url += "?" + paramsArray.join("&");
        } else {
          url += "&" + paramsArray.join("&");
        }
      }
    } else {
      options["body"] = JSON.stringify(data); // body data type must match "Content-Type" header
    }
    const response = await fetch(url, options);
    // console.warn(url)
    //console.warn('request test')
    if (response['status'] == 401) {
      await Storage.clear()
      DeviceEventEmitter.emit('action', 'logout');
      return { error: 2, errmsg: 'You have long time not to use this app,Please relogin this app' }
    }
    return await response.json();
  } catch (err) {
    // console.error(err);
    return { error: 1, errmsg: "Internet connect failed" };
  }
  //return await JSON.parse('{"error":0}'); // parses JSON response into native JavaScript objects
};
