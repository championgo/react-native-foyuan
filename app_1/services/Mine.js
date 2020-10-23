import _ from 'lodash';
import { default as request } from '../utils/request';
import dataApi from '../config/api';



// 我的礼品卡
export const giftcard = async (payload) => {
  const fetchApi = dataApi.mine.giftcard;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
// 我的礼品卡
export const getExchange = async (payload) => {
  const fetchApi = dataApi.mine.getExchange;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
// 兑换礼品卡
export const getGiftCard = async (payload) => {
  const fetchApi = dataApi.mine.getGiftCard;
  try {
    const res = await request(fetchApi, { ...payload }, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
export const getTransaction = async (payload) => {
  const fetchApi = dataApi.mine.getTransaction;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
export const invoice = async (payload) => {
  const fetchApi = dataApi.mine.invoice;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
export const invoice_detail = async (payload) => {
  const fetchApi = dataApi.mine.invoice_detail;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
export const getProjectOrder = async (payload) => {
  const fetchApi = dataApi.mine.getProjectOrder;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};
export const addInvoiceList = async (payload) => {
  const fetchApi = dataApi.mine.addInvoiceList;
  try {
    const res = await request(fetchApi, { ...payload }, 'POST', true);
    console.error(fetchApi);

    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
  //return request.post(fetchApi, data, false);
};

/**
 * 订单列表
 * @param {*} payload 提交参数
 */
export const orderList = async (payload) => {
  const fetchApi = dataApi.mine.orderList;
  try {
    const res = await request(fetchApi, { ...payload }, 'GET');
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 订单详情
 * @param {*} payload 参数
 */
export const orderdetails = async (payload) => {
  const fetchApi = dataApi.mine.orderdetails;
  const { id } = payload;
  try {
    const res = await request(fetchApi + id, { ...payload }, "GET");
    return res
  } catch (error) {
    console.error(error);
    return { error: 1, 'errmsg': 'request failed' }
  }
}
/** 提醒发货
* @param {*} payload 提交参数
*/
export const orderRemind = async (payload) => {
  const fetchApi = dataApi.mine.orderRemind;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 再次购买
 * @param {*} payload 提交参数
 */
export const orderBuyAgain = async (payload) => {
  const fetchApi = dataApi.mine.orderBuyAgain;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 确认收货
 * @param {*} payload 提交参数
 */
export const orderConfirm = async (payload) => {
  const fetchApi = dataApi.mine.orderConfirm;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 自动取消订单
 * @param {*} payload 提交参数
 */
export const orderCancle = async (payload) => {
  const fetchApi = dataApi.mine.orderCancle;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 删除取消订单
 * @param {*} payload 提交参数
 */
export const nopaydelete = async (payload) => {
  const fetchApi = dataApi.mine.nopaydelete;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};


/**
 * 手动取消订单
 * @param {*} payload 提交参数
 */
export const cancelManual = async (payload) => {
  const fetchApi = dataApi.mine.cancelManual;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 退换售后
 * @param {*} payload 提交参数
 */
export const after = async (payload) => {
  const fetchApi = dataApi.mine.after;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload }, "GET");
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 删除上传图片
 * @param {*} payload 提交参数
 */
export const deteteupload = async (payload) => {
  const fetchApi = dataApi.mine.deteteupload;
  try {
    const res = await request(fetchApi, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 待发货退换售后提交
 * @param {*} payload 提交参数
 */
export const aftersubmission = async (payload) => {
  const fetchApi = dataApi.mine.aftersubmission;
  try {
    const res = await request(fetchApi, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};
/**
 * 待收货待评价退换售后提交
 * @param {*} payload 提交参数
 */
export const postReturn = async (payload) => {
  const fetchApi = dataApi.mine.postReturn;
  try {
    const res = await request(fetchApi, { ...payload });
    return res;
  } catch (error) {
    console.log(errmsg)
    return { error: 1, errmsg: 'request failed' };
  }
};


/**
 * 商品评价
 * @param {*} payload 提交参数
 */
export const getReview = async (payload) => {
  const fetchApi = dataApi.mine.getReview;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload }, "GET");
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};


/**
 * 评价提交
 * @param {*} payload 提交参数
 */
export const postreview = async (payload) => {
  const fetchApi = dataApi.mine.postreview;
  try {
    const res = await request(fetchApi, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 售后进度
 * @param {*} payload 提交参数
 */
export const getTraces = async (payload) => {
  const fetchApi = dataApi.mine.getTraces;
  const { id } = payload;
  try {
    const res = await request(fetchApi + '/' + id, { ...payload }, "GET");
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 追踪物流
 * @param {*} payload 提交参数
 */
export const getShippingPacke = async (payload) => {
  const fetchApi = dataApi.mine.getShippingPacke;
  try {
    const res = await request(fetchApi, { ...payload }, "GET");
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};
/**
 * 优惠券去使用跳转
 * @param {*} payload 提交参数
 */
export const couponsproductslist = async (payload) => {
  const fetchApi = dataApi.mine.couponsproductslist;
  try {
    const res = await request(fetchApi, { ...payload }, "GET");
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};

/**
 * 支付
 * @param {*} payload 提交参数
 */
export const orderPay = async (payload) => {
  const fetchApi = dataApi.mine.orderPay;
  try {
    const res = await request(fetchApi, { ...payload });
    return res;
  } catch (error) {
    return { error: 1, errmsg: 'request failed' };
  }
};















