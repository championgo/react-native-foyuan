import * as React from 'react';
import { BackHandler, Animated, Easing, DeviceEventEmitter } from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { connect } from 'react-redux'
import HomeScreen from './views/home';
import LoginScreen from './views/login';
import Loading from './views/Loading'

const App = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}
class Router extends React.PureComponent {
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
    this.listener = DeviceEventEmitter.addListener('action', (message) => {
      //收到监听后想做的事情
      if (message == 'logout') {
        const resetLogin = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Login" })]
        });
        this.props.dispatch(resetLogin)
      }

    })
    //SplashScreen.hide();
    //wechat.registerApp(Config[Config.dev].appid,'https://yx.esehoo.com/ios/')
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
    if (this.listener) {
      this.listener.remove();
    }
  }

  backHandle = () => {
    // DeviceEventEmitter.emit('ba', true); // 
    const currentScreen = getActiveRouteName(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const { app, dispatch, router } = this.props
    if (app.loading) return <Loading />

    return (
        <App dispatch={dispatch} state={router} />
    )
  }
}

export default connect(({ app, router }) => ({ app, router }))(Router)
