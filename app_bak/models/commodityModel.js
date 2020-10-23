import { Toast } from "native-base";
import {
  createAction,
  NavigationActions,
  Storage,
  StackActions
} from "../utils";
import * as commodityService from "../services/commodityService";

export default {
  namespace: "commodityModel",
  state: {
    login: false,
    loading: true,
    fetching: false
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    /**
     * 首页商品列表更多里面的商品列表
     * @param {*} param0 
     * @param {*} param1 
     */
    *homemore({ payload, callback }, { call }) {
      const response = yield call(commodityService.homemore, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情
     * @param {*} param0 
     * @param {*} param1 
     */
    *commoditydetail({ payload, callback }, { call }) {
      const response = yield call(commodityService.commoditydetail, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情展示评论
     * @param {*} param0 
     * @param {*} param1 
     */
    *productshowreview({ payload, callback }, { call }) {
      const response = yield call(commodityService.productshowreview, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },


    /**
     * 商品详情全部评论
     * @param {*} param0 
     * @param {*} param1 
     */
    *getComments({ payload, callback }, { call }) {
      const response = yield call(commodityService.getComments, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情收藏
     * @param {*} param0 
     * @param {*} param1 
     */
    *collect({ payload, callback }, { call }) {
      const response = yield call(commodityService.collect, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情规格选择
     * @param {*} param0 
     * @param {*} param1 
     */
    *productselection({ payload, callback }, { call }) {
      const response = yield call(commodityService.productselection, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情商品购买
     * @param {*} param0 
     * @param {*} param1 
     */
    *orderinfo({ payload, callback }, { call }) {
      const response = yield call(commodityService.orderinfo, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      callback && callback(response.data || {});
    },

    /**
     * 商品详情加入购物车
     * @param {*} param0 
     * @param {*} param1 
     */
    *joinshopping({ payload, callback }, { call }) {
      const response = yield call(commodityService.joinshopping, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },


    /**
     * 商品详情组合套餐
     * @param {*} param0 
     * @param {*} param1 
     */
    *getGroup({ payload, callback }, { call }) {
      const response = yield call(commodityService.getGroup, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },



    /**
     * 商品详情组合套餐列表
     * @param {*} param0 
     * @param {*} param1 
     */
    *getGroupList({ payload, callback }, { call }) {
      const response = yield call(commodityService.getGroupList, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 商品详情组合套餐列表数量加减
     * @param {*} param0 
     * @param {*} param1 
     */
    *chooseGroup({ payload, callback }, { call }) {
      const response = yield call(commodityService.chooseGroup, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },


    /**
     * //秒杀详情信息
     * @param {*} param0 
     * @param {*} param1 
     */
    *showProduct({ payload, callback }, { call }) {
      const response = yield call(commodityService.showProduct, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
    * //秒杀详情规格选择
    * @param {*} param0 
    * @param {*} param1 
    */
    *getProperty({ payload, callback }, { call }) {
      const response = yield call(commodityService.getProperty, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * //我的优惠券
     * @param {*} param0 
     * @param {*} param1 
     */
    *couponslist({ payload, callback }, { call }) {
      const response = yield call(commodityService.couponslist, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * //我的优惠券兑换
     * @param {*} param0 
     * @param {*} param1 
     */
    *receiveCoupon({ payload, callback }, { call }) {
      const response = yield call(commodityService.receiveCoupon, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 购物车里面的为你推荐商品
     * @param {*} param0 
     * @param {*} param1 
     */
    *record({ payload, callback }, { call }) {
      const response = yield call(commodityService.record, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 我的购物车列表
     * @param {*} param0 
     * @param {*} param1 
     */
    *shoppinglist({ payload, callback }, { call }) {
      const response = yield call(commodityService.shoppinglist, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },

    /**
     * 我的购物车列表商品的数量
     * @param {*} param0 
     * @param {*} param1 
     */
    *numberchange({ payload, callback }, { call }) {
      const response = yield call(commodityService.numberchange, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },


    /**
     * 我的购物车列表商品全选
     * @param {*} param0 
     * @param {*} param1 
     */
    *batch({ payload, callback }, { call }) {
      const response = yield call(commodityService.batch, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },



    /**
     * 我的购物车列表商品清空下架商品
     * @param {*} param0 
     * @param {*} param1 
     */
    *empty_cart({ payload, callback }, { call }) {
      const response = yield call(commodityService.empty_cart, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },


    /**
    * 我的购物车列表商品删除
    * @param {*} param0 
    * @param {*} param1 
    */
    *deleteing({ payload, callback }, { call }) {
      const response = yield call(commodityService.deleteing, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },




  }
};
