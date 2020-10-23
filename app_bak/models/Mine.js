import * as Mine from "../services/Mine";
import { Toast } from "native-base";

export default {
  namespace: "Mine",
  state: {
    login: false,
    loading: true,
    fetching: false,
    searchs: [],
    prices: '',
    giftLists: [],
    lists: [],
    orderLists: []
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    //礼品卡
    *giftcard({ payload, callback }, { call, put }) {
      const response = yield call(Mine.giftcard, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //礼品卡余额
    *getExchange({ payload, callback }, { call, put }) {
      const response = yield call(Mine.getExchange, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 兑换礼品卡
    *getGiftCard({ payload, callback }, { call, put }) {
      const response = yield call(Mine.getGiftCard, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 交易记录
    *getTransaction({ payload, callback }, { call, put }) {
      const response = yield call(Mine.getTransaction, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 已开发票
    *invoice({ payload, callback }, { call, put }) {
      console.log('index');
      const response = yield call(Mine.invoice, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 已开发票详情
    *invoice_detail({ payload, callback }, { call, put }) {
      const response = yield call(Mine.invoice_detail, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 可开票订单
    *getProjectOrder({ payload, callback }, { call, put }) {
      const response = yield call(Mine.getProjectOrder, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    // 提交发票
    *addInvoiceList({ payload, callback }, { call, put }) {
      const response = yield call(Mine.addInvoiceList, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    /**
     * 订单列表
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderList({ payload, callback }, { call }) {
      const response = yield call(Mine.orderList, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || []);
    },

    // 订单详情
    *orderdetails({ payload, callback }, { call, put }) {
      const response = yield call(Mine.orderdetails, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    /**
     * 提醒发货
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderRemind({ payload, callback }, { call }) {
      const response = yield call(Mine.orderRemind, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },
    /**
     * 再次购买
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderBuyAgain({ payload, callback }, { call }) {
      const response = yield call(Mine.orderBuyAgain, payload);
      if (response.error == 1) {
        // Toast.show({
        //   text: response.errmsg,
        //   position: 'center',
        //   type: 'warning',
        //   duration: 3000
        // });
        // return;
        console.log(response.errmsg)
      };
      callback && callback(response.data || '');
    },
    /**
     * 确认收货
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderConfirm({ payload, callback }, { call }) {
      const response = yield call(Mine.orderConfirm, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },
    /**
     * 自动取消订单
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderCancle({ payload, callback }, { call }) {
      const response = yield call(Mine.orderCancle, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 删除取消订单
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *nopaydelete({ payload, callback }, { call }) {
      const response = yield call(Mine.nopaydelete, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 手动取消订单
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *cancelManual({ payload, callback }, { call }) {
      const response = yield call(Mine.cancelManual, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },


    /**
     * 退换售后
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *after({ payload, callback }, { call }) {
      const response = yield call(Mine.after, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 删除上传图片
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *deteteupload({ payload, callback }, { call }) {
      const response = yield call(Mine.deteteupload, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },


    /**
     * 待发货退换售后提交
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *aftersubmission({ payload, callback }, { call }) {
      const response = yield call(Mine.aftersubmission, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 待发货退换售后提交
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *postReturn({ payload, callback }, { call }) {
      const response = yield call(Mine.postReturn, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },


    /**
     * 商品评价
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *getReview({ payload, callback }, { call }) {
      const response = yield call(Mine.getReview, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 商品评价提交
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *postreview({ payload, callback }, { call }) {
      const response = yield call(Mine.postreview, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 售后进度
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *getTraces({ payload, callback }, { call }) {
      const response = yield call(Mine.getTraces, payload);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },
    /**
     * 追踪物流
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *getShippingPacke({ payload, callback }, { call }) {
      const response = yield call(Mine.getShippingPacke, payload);
      if (response.error == 1) {
        Toast.show({
          text: "response.errmsg",
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },
    /**
     * 优惠券去使用跳转
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *couponsproductslist({ payload, callback }, { call }) {
      const response = yield call(Mine.couponsproductslist, payload);
      if (response.error == 1) {
        Toast.show({
          text: "response.errmsg",
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },

    /**
     * 支付
     * @param {*} payload 提交参数
     * @param {*} callback 回调函数
     */
    *orderPay({ payload, callback }, { call }) {
      console.log(payload);
      const response = yield call(Mine.orderPay, payload);
      console.log(response);
      if (response.error == 1) {
        Toast.show({
          text: response.errmsg,
          position: 'center',
          type: 'warning',
          duration: 3000
        });
        return;
      };
      callback && callback(response.data || '');
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
};

