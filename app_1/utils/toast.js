import { Toast } from "native-base";


function error(msg) {
  Toast.show({
    text: msg,
    buttonText: "OK",
    duration: 3000,
    position: 'top',
    type: "danger"
  })
  return
}
function fail(msg) {
  Toast.show({
    text: msg,
    buttonText: "OK",
    duration: 3000,
    position: 'top',
    type: "danger"
  })
  return
}
function success(msg) {
  Toast.show({
    text: msg,
    buttonText: "OK",
    duration: 3000,
    position: 'top',
    type: "success"
  })
  return
}
function info(msg) {
  Toast.show({
    text: msg,
    buttonText: "OK",
    duration: 3000,
    position: 'top'
  })
  return
}
function warn(msg) {
  Toast.show({
    text: msg,
    buttonText: "OK",
    duration: 3000,
    position: 'top',
    type: "warning"
  })
  return

}


export default {
  error,
  success,
  info,
  warn,
  fail
}
