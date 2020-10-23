import _ from 'lodash';
import {default as request} from '../utils/request';
import dataApi from '../config/api';

export const login = async (payload) => {
  const fetchApi = dataApi.user.auth;
  try {
    const res = await request(fetchApi, payload, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

export const wxLogin = async (payload) => {
  const fetchApi = dataApi.user.weixin;
  try {
    const res = await request(fetchApi, payload, 'POST', false);
    return res;
  } catch (error) {
    console.log(error.message)
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

export const phoneLogin = async (payload) => {
  const fetchApi = dataApi.user.phoneLogin;
  try {
    const res = await request(fetchApi, payload, 'POST', false);
    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
};

export const checkEmail = async (payload) => {
  const fetchApi = dataApi.user.checkEmail;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
export const checkPhone = async (payload) => {
  const fetchApi = dataApi.mine.check_has_mobile;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
};
export const checkCode = async (payload) => {
  const fetchApi = dataApi.user.checkCode;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
};
export const checkMobile = async (payload) => {
  const fetchApi = dataApi.user.checkMobile;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
};
export const resetPassword = async (payload) => {
  const fetchApi = dataApi.user.resetPassword;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
};
export const signUp = async (payload) => {
  const fetchApi = dataApi.user.signUp;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

// 个人中心
export const getMineDetail = async (payload) => {
  const fetchApi = dataApi.mine.index;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', true);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

// 个人中心修改名字
export const changename = async (payload) => {
  const fetchApi = dataApi.mine.changename;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

// 个人中心修改图片
export const changeimg = async (payload) => {
  const fetchApi = dataApi.mine.changeimg;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
// 个人中心修改图片成功请求数据
export const update_avatar = async (payload) => {
  const fetchApi = dataApi.mine.update_avatar;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
// 个人中心验证手机号码发送短信
export const verify_code = async (payload) => {
  const fetchApi = dataApi.mine.verify_code;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//用户未登录时验证手机
export const sendCode = async (payload) => {
  const fetchApi = dataApi.mine.verify_code;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false);
    return res;
  } catch (error) {
    console.error(error);
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
// 个人中心验证手机号码下一步
export const check_mobile = async (payload) => {
  const fetchApi = dataApi.mine.check_mobile;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心修改手机号码发送短信(手机是否存在)
export const check_has_mobile = async (payload) => {
  const fetchApi = dataApi.mine.check_has_mobile;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心修改手机号码发送短信(发送短信)
export const check_phone = async (payload) => {
  const fetchApi = dataApi.mine.check_phone;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

//个人中心修改手机号码发送短信(确定)
export const bindPhone = async (payload) => {
  const fetchApi = dataApi.mine.bindPhone;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心地址
export const address = async (payload) => {
  const fetchApi = dataApi.mine.address;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心地址(保存)
export const address_store = async (payload) => {
  const fetchApi = dataApi.mine.address_store;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心地址(保存返回新数据)
export const address_index = async (payload) => {
  const fetchApi = dataApi.mine.address_index;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心地址(删除)
export const address_delete = async (payload) => {
  const fetchApi = dataApi.mine.address_delete;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心地址(删除)
export const address_update = async (payload) => {
  const fetchApi = dataApi.mine.address_update;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
//个人中心反馈提交
export const feedback = async (payload) => {
  const fetchApi = dataApi.mine.feedback;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
export const bindWeixin = async (payload) => {
  const fetchApi = dataApi.mine.bindWeixin;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
 







