import {
    createAction,
    NavigationActions,
    Storage,
    StackActions
  } from "../utils";
  import * as testService from "../services/testService";
  
  export default {
    namespace: "SearchModel",
    state: {
      login: false,
      loading: true,
      fetching: false,
      searchs:[],
    },
    reducers: {
      updateState(state, { payload }) {
        return { ...state, ...payload };
      }
    },
    effects: {
     
  
         //热门搜索
         *hotKeyWord({payload, callback}, {call, put}) {
          const response = yield call(testService.hotKeyWord,payload);
          if (callback && typeof callback == 'function') {
            callback(response);
          }
        },
        // 搜索返回数据
        *search_index({payload, callback}, {call, put}) {
          const response = yield call(testService.search,payload);
          if (callback && typeof callback == 'function') {
            callback(response);
          }
        },
        // 店铺基本信息
        *get_shop({payload, callback}, {call, put}) {
          const response = yield call(testService.get_shop,payload);
          if (callback && typeof callback == 'function') {
            callback(response);
          }
        },
         // 店铺商品列表
         *get_list({payload, callback}, {call, put}) {
          const response = yield call(testService.get_list,payload);
          if (callback && typeof callback == 'function') {
            callback(response);
          }
        },
        // 商品分类列表的筛选的标签
        *labelList({payload, callback}, {call, put}) {
          const response = yield call(testService.labelList,payload);
          if (callback && typeof callback == 'function') {
            callback(response);
          }
        },
   

        
      
      
    },
    subscriptions: {
      setup({ dispatch }) {
        dispatch({ type: "loadStorage" });
      }
    }
  };