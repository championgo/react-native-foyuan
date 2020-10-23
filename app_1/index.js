import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry, StyleSheet, Text, StatusBar } from 'react-native';

import dva from './utils/dva'
import Router, { routerMiddleware, routerReducer } from './router'
//import appModel from './models/app'
import { theme } from "./utils";
import * as models from './models';

/*const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: 'Roboto',    // 可以试试 fontFamily: '',
  }
});

const oldRender = Text.render;
Text.render = function (...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [origin.props.style, styles.defaultFontFamily]
  });
};
*/
const app = dva({
  initialState: {},
  models: [...models],
  extraReducers: { router: routerReducer },
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(
  <>
    <StatusBar barStyle="dark-content" backgroundColor={theme.headerTintColor} animated={true} hidden={false} androidtranslucent={true} />
    <Router />
  </>
)

AppRegistry.registerComponent('foyuan', () => App)

