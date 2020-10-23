import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

export { NavigationActions, StackActions } from "react-navigation";
export { default as Storage } from "./storage";
export const delay = time => new Promise(resolve => setTimeout(resolve, time));
export const createAction = type => payload => ({ type, payload });

export { default as theme } from "./theme";
export { default as pxToDp } from "./pxToDp";
export { default as Toast } from "./toast";

const format = "YYYY-MM-DD HH:mm:ss";

/**
 * 获取路由参数
 * @param {*} url 链接
 * @param {*} name 获取参数名
 */
export const getQueryByName = (url, name) => {
  const reg = new RegExp(`[?&]${name}=([^&@#]+)`);
  // console.warn(url)
  const query = url.match(reg);
  return query ? query[1] : null;
};

/**
 * 判断字符串中是否包含链接
 * @param {*} str 字符串
 */
export const isHasUrl = str => {
  const reg = /((http|https):\/\/([\w.]+\/?)\S*)/ig;
  const query = str && str.match(reg);
  return !!query;
}

/**
 * 字符串转换成数组
 * @param {*} string 字符串
 * @param {*} flag 标记 默认空格
 */
export const stringToArrat = (string, flag = /[\s\n]/) => {
  return string.replace(/\n/g, '@ ').split(flag);
}

/**
 * 判断是否是youtube链接
 * @param {*} url 链接
 */
export const isYoutobe = url => {
  //const res = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?/;
  const res = /(?:https?:\/\/)?(?:www\.)?youtube(?:\.com)?/;
  return res.test(url);
}

/**
 * 判断是否是数字
 * @param {*} val 传入值
 */
export const isNum = val => {
  val = Number(val);
  if (!!isNaN(val)) return false;
  return true;
}

/**
 * 判断奇偶
 * @param {*} val 传入值
 */
export const isOddEven = val => {
  if (!!!isNum(val)) return false;
  return val % 2 == 0;
}

/**
 * 生成公差为tol的等差数组 并且判断是否在其中
 * @param {*} val 需要判断是否在其中的值
 * @param {*} firstVal 数组首 default 2
 * @param {*} tol 公差 default 3
 */
export const isMidNum = (val, firstVal = 2, tol = 3) => {
  const arr = new Array(100);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = firstVal + i * tol;
  }
  if (arr.indexOf(val) == -1) return false;
  return true;
}

/**
 * 格式化手机号码，中间部位****
 * @param {*} val 手机号
 */
export const phoneFormat = val => {
  if (!!val) {
    return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  return val;
}

/**
 * 判断秒杀状态
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 * return 1(活动未开始) 2(活动进行中) 3(活动已结束) 4(无状态)
 */
export const seckillStatus = (start, end) => {
  const currentTime = moment().format(format);

  if (!!start && !!end) {
    if (moment(currentTime).isBefore(moment(start).format(format))) {
      return 1;
    }

    if (moment(currentTime).isBetween(moment(start).format(format), moment(end).format(format))) {
      return 2;
    }

    if (moment(currentTime).isAfter(moment(end).format(format))) {
      return 3;
    }
  }

  return 4;
}