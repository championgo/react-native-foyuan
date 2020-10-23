import * as SortService from "../services/SortService";
import { Toast } from "native-base";

export default {
    namespace: "SortModel",
    state: {},
    effects: {
        /**
         * 获取分类列表
         * @param {*} payload 提交参数
         * @param {*} callback 回调函数
         */
        *category_list({ payload, callback }, { call }) {
            const response = yield call(SortService.category_list, payload);

            if (response.error == 1) {
                Toast.show({
                    text: response.errmsg,
                    position: 'center',
                    type: 'warning',
                    duration: 3000
                });
                return;
            }

            callback && callback(response.data || []);
        }
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    }
};