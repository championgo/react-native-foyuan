import _ from 'lodash';
import { default as request } from '../utils/request'
import dataApi from '../config/api';

/**
 * 首页导航列表
 * @param {*} payload 提交参数
 */
export const meauList = async (payload) => {
    const fetchApi = dataApi.home.meauList;
    try {
        const res = await request(fetchApi, payload, "GET", false, true);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 主页banner
 * @param {*} payload 提交参数
 */
export const getBanner = async (payload) => {
    const fetchApi = dataApi.home.getBanner;
    try {
        const res = await request(fetchApi, payload, "GET", false);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 首页优惠券列表
 * @param {*} payload 提交参数
 */
export const couponList = async (payload) => {
    const fetchApi = dataApi.home.couponList;
    try {
        const res = await request(fetchApi, payload, "GET", false);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 领取优惠卷
 * @param {*} payload 提交参数
 */
export const getCoupon = async (payload) => {
    const fetchApi = dataApi.home.getCoupon;
    try {
        const res = await request(fetchApi, payload);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 首页秒杀列表
 * @param {*} payload 提交参数
 */
export const seckillList = async (payload) => {
    const fetchApi = dataApi.home.seckillList;
    try {
        const res = await request(fetchApi, payload, "GET", false);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 首页导航列表详情
 * @param {*} payload 提交参数
 */
export const listPlate = async (payload) => {
    const fetchApi = dataApi.home.listPlate;
    try {
        const res = await request(fetchApi, payload, "GET", false, true);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 首页模块状态列表
 * @param {*} payload 提交参数
 */
export const listPlateHome = async (payload) => {
    const fetchApi = dataApi.home.listPlateHome;
    try {
        const res = await request(fetchApi, payload, "GET", false);
        return res;
    } catch (error) {
        return { error: 1, 'errmsg': 'request failed' }
    }
}


