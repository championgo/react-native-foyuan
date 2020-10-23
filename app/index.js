import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry, StyleSheet, Text, StatusBar } from 'react-native';

import dva from './utils/dva'
import Router, { routerMiddleware, routerReducer } from './router'
//import appModel from './models/app'
import { theme } from "./utils";
import { default as models}  from './models'


const app = dva({
  initialState: {},
  models: models,
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

