import Toast from 'react-native-tiny-toast';
import * as HomeService from "../services/HomeService";

export default {
    namespace: "HomeModel",
    state: {
        meauListLoading: false,
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 首页导航列表
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *getHomeMeauList({ payload, callback }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: {
                    meauListLoading: true
                }
            })

            const response = yield call(HomeService.meauList, payload);

            yield put({
                type: 'updateState',
                payload: {
                    meauListLoading: false
                }
            })

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        },
        /**
         * 首页导航列表详情
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *getHomeListPlate({ payload, callback }, { call, put }) {
            const response = yield call(HomeService.listPlate, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        },
        /**
         * 主页banner
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *getBanner({ payload, callback }, { call }) {
            const response = yield call(HomeService.getBanner, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        },
        /**
         * 首页优惠券列表
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *couponList({ payload, callback }, { call }) {
            const response = yield call(HomeService.couponList, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        },
        /**
         * 领取优惠卷
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *getCoupon({ payload, callback }, { call }) {
            const response = yield call(HomeService.getCoupon, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            } else {
                Toast.showSuccess('领取成功', {
                    position: 0,
                    duration: 3000
                });
            }

            callback && callback(response.data || []);
        },
        /**
         * 首页秒杀列表
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *seckillList({ payload, callback }, { call }) {
            const response = yield call(HomeService.seckillList, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || {});
        },
        /**
         * 首页模块状态列表
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *listPlateHome({ payload, callback }, { call }) {
            const response = yield call(HomeService.listPlateHome, payload);

            if (response && response.error == 1) {
                Toast.show(response.errmsg, {
                    position: 0,
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        },
    },
};
