import _ from 'lodash';
import { default as request } from '../utils/request'
import dataApi from '../config/api';

/**
 * 首页商品列表更多里面的商品列表
 * @param {*} payload 参数
 */
export const homemore = async (payload) => {
    const fetchApi = dataApi.homemore.index;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 商品详情
 * @param {*} payload 参数
 */
export const commoditydetail = async (payload) => {
    const fetchApi = dataApi.homemore.commoditydetail;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}
/**
 * 商品详情展示评论
 * @param {*} payload 参数
 */
export const productshowreview = async (payload) => {
    const fetchApi = dataApi.homemore.productshowreview;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}
/**
 * 商品详情全部评论
 * @param {*} payload 参数
 */
export const getComments = async (payload) => {
    const fetchApi = dataApi.homemore.getComments;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}
/**
 * 商品详情收藏
 * @param {*} payload 参数
 */
export const collect = async (payload) => {
    const fetchApi = dataApi.homemore.collect;
    try {
        const res = await request(fetchApi, { ...payload });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 商品详情规格选择
 * @param {*} payload 参数
 */
export const productselection = async (payload) => {
    const fetchApi = dataApi.homemore.productselection;
    const { product_id, ...arg } = payload;
    try {
        const res = await request(fetchApi + product_id, { ...arg });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 商品详情商品购买
 * @param {*} payload 参数
 */
export const orderinfo = async (payload) => {
    const fetchApi = dataApi.homemore.orderinfo;
    try {
        const res = await request(fetchApi, { ...payload });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 商品详情加入购物车
 * @param {*} payload 参数
 */
export const joinshopping = async (payload) => {
    const fetchApi = dataApi.homemore.joinshopping;
    try {
        const res = await request(fetchApi, { ...payload });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 商品详情组合套餐
 * @param {*} payload 参数
 */
export const getGroup = async (payload) => {
    const fetchApi = dataApi.homemore.getGroup;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}


/**
 * 商品详情组合套餐
 * @param {*} payload 参数
 */
export const getGroupList = async (payload) => {
    const fetchApi = dataApi.homemore.getGroupList;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}



/**
 * 商品详情组合套餐数量加减
 * @param {*} payload 参数
 */
export const chooseGroup = async (payload) => {
    const fetchApi = dataApi.homemore.chooseGroup;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 秒杀详情信息
 * @param {*} payload 参数
 */
export const showProduct = async (payload) => {
    const fetchApi = dataApi.homemore.showProduct;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}


/**
 * 秒杀详情商品规格选择
 * @param {*} payload 参数
 */
export const getProperty = async (payload) => {
    const fetchApi = dataApi.homemore.getProperty;
    try {
        const res = await request(fetchApi, { ...payload });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 我的优惠券
 * @param {*} payload 参数
 */
export const couponslist = async (payload) => {
    const fetchApi = dataApi.homemore.couponslist;
    try {
        const res = await request(fetchApi, { ...payload }, "GET");
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 我的优惠券兑换
 * @param {*} payload 参数
 */
export const receiveCoupon = async (payload) => {
    const fetchApi = dataApi.homemore.receiveCoupon;
    try {
        const res = await request(fetchApi, { ...payload });
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

















/**
 * 购物车里面的为你推荐商品
 * @param {*} payload 参数
 */
export const record = async (payload) => {
    const fetchApi = dataApi.recommend.record;
    try {
        const res = await request(fetchApi, { ...payload }, "POST");
        return res
    } catch (error) {
        // console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}
/**
 * 我的购物车列表
 * @param {*} payload 参数
 */
export const shoppinglist = async (payload) => {
    const fetchApi = dataApi.recommend.shoppinglist;
    try {
        const res = await request(fetchApi, { ...payload }, "GET", true, true);
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}


/**
 * 我的购物车列表商品的数量
 * @param {*} payload 参数
 */
export const numberchange = async (payload) => {
    const fetchApi = dataApi.recommend.numberchange;
    try {
        const res = await request(fetchApi, { ...payload }, "POST", true, true);
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 我的购物车列表商品的数量
 * @param {*} payload 参数
 */
export const batch = async (payload) => {
    const fetchApi = dataApi.recommend.batch;
    try {
        const res = await request(fetchApi, { ...payload }, "POST", true, true);
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}


/**
 * 我的购物车列表商品清空下架商品
 * @param {*} payload 参数
 */
export const empty_cart = async (payload) => {
    const fetchApi = dataApi.recommend.empty_cart;
    try {
        const res = await request(fetchApi, { ...payload }, "POST", true, true);
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}

/**
 * 我的购物车列表商品删除
 * @param {*} payload 参数
 */
export const deleteing = async (payload) => {
    const fetchApi = dataApi.recommend.deleteing;
    try {
        const res = await request(fetchApi, { ...payload }, "POST", true, true);
        return res
    } catch (error) {
        console.error(error);
        return { error: 1, 'errmsg': 'request failed' }
    }
}





