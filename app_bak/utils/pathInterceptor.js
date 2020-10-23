import Config, { authData } from '../config';
const apiDomain = Config[Config.dev].apiDomain


export default {
  request: (url, type = false) => {
    //正则表达式含义： 排除后缀为.html | 排除前缀为http: https:
    if (!/.+(?=\.html$)/.test(url) && !/^(?=(http\:|https\:)).*/.test(url)) {
      // url = type ? apiDomain1 + url : apiDomain + url;
      url = apiDomain + url;
    }
    return url;
  }
};
