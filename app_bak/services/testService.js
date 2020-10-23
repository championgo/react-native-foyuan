import _ from 'lodash';
import {default as request} from '../utils/request';
import dataApi from '../config/api';



// //热门搜索
export const hotKeyWord = async (payload) => {
  const fetchApi = dataApi.search.hotKeyWord;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
// 搜索返回数据
export const search = async (payload) => {
    const fetchApi = dataApi.search.search;
    try {
      const res = await request(fetchApi, {...payload}, 'GET', true);
      console.error(fetchApi);
  
      return res;
    } catch (error) {
      return {error: 1, errmsg: 'request failed'};
    }
    //return request.post(fetchApi, data, false);
  };
  // 店铺基本信息
export const get_shop = async (payload) => {
  const fetchApi = dataApi.shop.get_shop;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', false, true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};
export const get_list = async (payload) => {
  const fetchApi = dataApi.shop.get_list;
  try {
    const res = await request(fetchApi, {...payload}, 'POST', false, true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};

export const labelList = async (payload) => {
  const fetchApi = dataApi.shop.labelList;
  try {
    const res = await request(fetchApi, {...payload}, 'GET', false, true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return {error: 1, errmsg: 'request failed'};
  }
  //return request.post(fetchApi, data, false);
};


  







