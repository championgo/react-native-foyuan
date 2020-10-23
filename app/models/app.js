import {
  StackActions,
} from '../utils';
//import * as userService from '../services/userService';

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: false,
    fetching: false,
    user: '',
  },
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
  },
  effects: {
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'loadStorage'});
    },
  },
};
