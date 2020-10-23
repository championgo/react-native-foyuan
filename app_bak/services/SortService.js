import { default as request } from '../utils/request';
import dataApi from '../config/api';

/**
 * 获取分类列表
 * @param {*} payload 提交参数
 */
export const category_list = async (payload) => {
    const fetchApi = dataApi.sort.category_list;
    try {
        const res = await request(fetchApi, { ...payload }, 'GET', false);
        return res;
    } catch (error) {
        return { error: 1, errmsg: 'request failed' };
    }
};

/**
 * ??
 * @param {*} payload 提交参数
 */
export const getRecommend = async (payload) => {
    const fetchApi = dataApi.sort.getRecommend;
    try {
        const res = await request(fetchApi, { ...payload }, 'GET', false);
        return res;
    } catch (error) {
        return { error: 1, errmsg: 'request failed' };
    }
};











