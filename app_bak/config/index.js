export default {
  appInfo: {
    name: "无畏优选",
    descr: "",
    version: "1.0.0",
    copyright: "©2020 powered by wwyx"
  },
  authorInfo: {
    name: "Nhuang"
  },
  dev: 'production',//production
  test: {
    apiDomain: "https://wwyx.peifude.com/",
    appid: 'wx0c555f24ad141af3',
  },
  production: {
    apiDomain: "https://yx.esehoo.com/",
    appid: 'wx0c555f24ad141af3'
  },
  // 商品详情图片地址
  apicommodity: "https://wwyx.oss-cn-shanghai.aliyuncs.com/"
};

export const postCategory = {
  home: "home",
  rank: "rank",
  news: "news",
  blink: "blink",
  question: "question",
  favorite: "favorite",
  answer: "answer"
};

export const authData = {
};

export const pageSize = 10;

export const storageKey = {
  OFFLINE_POSTS: "OFFLINE_POSTS",
  USER_TOKEN: "USER_TOKEN",
  TAIL_CONTENT: "TAIL_CONTENT",
  TAIL_ENABLED: "TAIL_ENABLED"
};

