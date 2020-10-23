import {
  createAction,
  NavigationActions,
  Storage,
  StackActions,
  Toast,
} from '../utils';
import * as userService from '../services/userService';

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: true,
    fetching: false,
    user: '',
  },
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
  },
  effects: {
    *loadStorage(action, {call, put}) {
      const login = yield call(Storage.get, 'login', false);
      const userInfo = yield call(Storage.get, 'user_info');
      yield put(
        createAction('updateState')({login, loading: false, user: userInfo}),
      );
    },
    *checkLogin({payload}, {call, put}) {
      const login = yield call(Storage.get, 'login', false);
      if (login) {
        const resetAction = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        yield put(resetAction);
      }
    },
    *login({payload}, {call, put}) {
      yield put(createAction('updateState')({fetching: true}));
      const res = yield call(userService.login, payload);
      let login = false,
        userInfo = '';
      if (res.error == 0) {
        userInfo = res.data.user;
        Storage.set('user_token', {token: res.data.token});
        Storage.set('user_info', userInfo);
        login = true;
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Main',
              params: {
                title: 'Home',
              },
            }),
          ],
        });
        yield put(resetAction);
      } else {
        Toast.info(res.errmsg);
      }
      yield put(
        createAction('updateState')({login, fetching: false, user: userInfo}),
      );
      Storage.set('login', login);
    },
    *wxLogin({payload}, {call, put}) {
      yield put(createAction('updateState')({fetching: true}));
      const res = yield call(userService.wxLogin, payload);
      let login = false,
        userInfo = '';
      if (res.error == 0) {
        userInfo = res.data.user;
        Storage.set('user_token', {token: res.data.token});
        Storage.set('user_info', userInfo);
        login = true;
        //yield put(NavigationActions.back())
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Main',
            }),
          ],
        });
        yield put(resetAction);
      } else {
        Toast.error(res.errmsg);
      }
      yield put(
        createAction('updateState')({login, fetching: false, user: userInfo}),
      );
      Storage.set('login', login);
    },
    *phoneLogin({payload}, {call, put}) {
      yield put(createAction('updateState')({fetching: true}));
      const res = yield call(userService.phoneLogin, payload);
      let login = false,
        userInfo = '';
      console.warn(res);
      if (res.error == 0) {
        console.log(res);
        userInfo = res.data.user;
        Storage.set('user_token', {token: res.data.token});
        Storage.set('user_info', userInfo);
        login = true;
        //yield put(NavigationActions.back())
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Main',
              params: {
                title: 'Home',
              },
            }),
          ],
        });
        yield put(resetAction);
      } else {
        console.log('res.errmsg');
        Toast.error(res.errmsg);
      }
      yield put(
        createAction('updateState')({login, fetching: false, user: userInfo}),
      );
      Storage.set('login', login);
    },
    *sendCode({payload}, {call, put}) {
      const res = yield call(userService.sendCode, payload);
      console.warn('send code');
    },
    *checkCode({payload}, {call, put}) {
      const res = yield call(userService.checkPhone, payload);
      if (res.error == 0) {
        if (res.data == true) {
          Toast.error('该手机号已注册!');
        } else {
          const res1 = yield call(userService.checkCode, payload);
          console.warn(res1);
          if (res1.error == 0) {
            if (res1.data == true) {
              const navigateAction = NavigationActions.navigate({
                routeName: 'SetPassword',
                params: {...payload, type: 'new'},
              });
              yield put(navigateAction);
            } else {
              Toast.error(res1.errmsg);
            }
          } else {
            Toast.error(res1.errmsg);
          }
        }
      } else {
        Toast.error(res.errmsg);
      }
    },
    //忘记密码，检查手机
    *checkMobile({payload}, {call, put}) {
      const res = yield call(userService.checkMobile, payload);
      console.warn(res);
      if (res.error == 0) {
        console.warn('resetPass');
        const navigateAction = NavigationActions.navigate({
          routeName: 'SetPassword',
          params: {...payload, type: 'forgot'},
        });
        yield put(navigateAction);
      } else {
        Toast.error(res.errmsg);
      }
    },
    *signUp({payload}, {call, put}) {
      yield put(createAction('updateState')({fetching: true}));
      const res = yield call(userService.signUp, payload);
      let login = false;
      console.warn(res);
      if (res.error == 0) {
        console.log(res);
        const userInfo = res.data.user;
        Storage.set('user_token', {token: res.data.token});
        Storage.set('user_info', userInfo);
        login = true;
        //yield put(NavigationActions.back())
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Main',
            }),
          ],
        });
        yield put(resetAction);
      } else {
        console.log('res.errmsg');
        Toast.error(res.errmsg);
      }
      yield put(createAction('updateState')({login, fetching: false}));
      Storage.set('login', login);
    },
    *resetPassword({payload}, {call, put}) {
      yield put(createAction('updateState')({fetching: true}));
      const res = yield call(userService.resetPassword, payload);
      let login = false;
      console.warn(res);
      if (res.error == 0) {
        //yield put(NavigationActions.back())
        const resetLogin = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'LoginNavigator'})],
        });
        yield put(resetLogin);
      } else {
        console.log('res.errmsg');
        Toast.error(res.errmsg);
      }
      yield put(createAction('updateState')({login, fetching: false}));
    },
    *logout(action, {call, put}) {
      yield call(Storage.clear);
      yield put(createAction('updateState')({login: false}));
      const resetLogin = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'LoginNavigator'})],
      });
      yield put(resetLogin);
    },
    //个人中心
    *getMineDetail({payload, callback}, {call, put}) {
      const response = yield call(userService.getMineDetail, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改名字
    *changename({payload, callback}, {call, put}) {
      const response = yield call(userService.changename, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改图片
    *changeimg({payload, callback}, {call, put}) {
      const response = yield call(userService.changeimg, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改图片后请求数据
    *update_avatar({payload, callback}, {call, put}) {
      const response = yield call(userService.update_avatar, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心验证手机号码发送短信
    *verify_code({payload, callback}, {call, put}) {
      const response = yield call(userService.verify_code, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心验证手机号码发送短信下一步
    *check_mobile({payload, callback}, {call, put}) {
      const response = yield call(userService.check_mobile, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改手机号码发送短信(手机是否存在)
    *check_has_mobile({payload, callback}, {call, put}) {
      const response = yield call(userService.check_has_mobile, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改手机号码发送短信(发送短信)
    *check_phone({payload, callback}, {call, put}) {
      const response = yield call(userService.check_phone, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心修改手机号码发送短信(确定)
    *bindPhone({payload, callback}, {call, put}) {
      const response = yield call(userService.bindPhone, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心地址
    *address({payload, callback}, {call, put}) {
      const response = yield call(userService.address, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心地址(保存)
    *address_store({payload, callback}, {call, put}) {
      const response = yield call(userService.address_store, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心地址(保存返回新数据)
    *address_index({payload, callback}, {call, put}) {
      const response = yield call(userService.address_index, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心地址(删除)
    *address_delete({payload, callback}, {call, put}) {
      const response = yield call(userService.address_delete, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心地址(修改)
    *address_update({payload, callback}, {call, put}) {
      const response = yield call(userService.address_update, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心反馈提交
    *feedback({payload, callback}, {call, put}) {
      const response = yield call(userService.feedback, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
    //个人中心绑定微信
    *bindWeixin({payload, callback}, {call, put}) {
      const response = yield call(userService.bindWeixin, payload);
      if (callback && typeof callback == 'function') {
        callback(response);
      }
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'loadStorage'});
    },
  },
};
