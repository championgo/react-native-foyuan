import React from 'react'
import { AppRegistry, StyleSheet, Text, StatusBar } from 'react-native'

import dva from './utils/dva'
import Router, { routerMiddleware, routerReducer } from './router'
import appModel from './models/app'
import SearchModel from './models/SearchModel';
import commodityModel from './models/commodityModel';
import HomeModel from './models/HomeModel';
import Mine from './models/Mine';
import SortModel from './models/SortModel';
import { theme } from "./utils";

const styles = StyleSheet.create({
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

const app = dva({
  initialState: {},
  models: [appModel, SearchModel, commodityModel, HomeModel, Mine, SortModel],
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

AppRegistry.registerComponent('wwyxapp', () => App)

