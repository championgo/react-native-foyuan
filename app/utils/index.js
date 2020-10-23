import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

export { CommonActions, StackActions } from '@react-navigation/native';
//export { default as Storage } from "./storage";
export const delay = time => new Promise(resolve => setTimeout(resolve, time));
export const createAction = type => payload => ({ type, payload });

export { default as theme } from "./theme";

const format = "YYYY-MM-DD HH:mm:ss";

