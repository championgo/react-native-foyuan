import React, { PureComponent } from 'react'
import Config from './config'
import { BackHandler, Animated, Easing, DeviceEventEmitter } from 'react-native'
import {
  NavigationActions,
} from 'react-navigation'
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "react-navigation-stack";
import { theme, pxToDp } from './utils'

//import Login from './containers/Login'
//import Home from './containers/Home'
// import HomeMore from './containers/HomeMore'

const HomeNavigator = createBottomTabNavigator({
  // Home: { screen: Home },
  HomeBackup: { screen: HomeBackup },
  Sort: { screen: Sort },
  ShoppingCart: { screen: ShoppingCart },
  // Account: { screen: Account },
  Mine: { screen: Mine },
}, {
  tabBarOptions: {
    ...theme.tabbar,
    labelStyle: {
      fontSize: pxToDp(20)
    }
  }
})

HomeNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation?.state.routes[navigation?.state.index]
  let title = '', headerShown = true;

  if (routeName == 'HomeBackup') {
    title = "首页";
    headerShown = false;
  } else if (routeName == 'Sort') {
    title = "分类";
    headerShown = false;
  } else if (routeName == 'ShoppingCart') {
    title = "购物车";
    headerShown = false;
    DeviceEventEmitter.emit('buyAgain', true);
  } else {
    title = "个人中心";
  }

  return {
    headerTitle: title || routeName,
    headerShown
  }
}

const MainNavigator = createStackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    Detail: { screen: Detail },
    HomeMore: { screen: HomeMore },
    CommodityDetail: { screen: CommodityDetail },
    CombinationDiscount: { screen: CombinationDiscount },
    SeckillDetails: { screen: SeckillDetails },
    Aboutus: { screen: Aboutus },
    Mycoupon: { screen: Mycoupon },
    Orderdetails: { screen: Orderdetails },
    Aftersale: { screen: Aftersale },
    Evaluate: { screen: Evaluate },
    AftersalesProcess: { screen: AftersalesProcess },
    ReceivingAftersale: { screen: ReceivingAftersale },
    TrackingLogistics: { screen: TrackingLogistics },
    DiscountJump: { screen: DiscountJump },
    EvaluateSuccess: { screen: EvaluateSuccess },
    AllEvaluate: { screen: AllEvaluate },
    ScrollableTabBarExample: { screen: ScrollableTabBarExample },
    CustomTabBarExample: { screen: CustomTabBarExample },
    CustomIndicatorExample: { screen: CustomIndicatorExample },
    CoverflowExample: { screen: CoverflowExample },
    AutoWidthTabBarExample: { screen: AutoWidthTabBarExample },
    EditMine: { screen: EditMine },
    ModifyPhone: { screen: ModifyPhone },
    EditPhone: { screen: EditPhone },
    Address: { screen: Address },
    Search: { screen: Search },
    ShopHome: { screen: ShopHome },
    Settlement: { screen: Settlement },
    Feedback: { screen: Feedback },
    GiftCard: { screen: GiftCard },
    HomeCouponList: { screen: HomeCouponList },
    GiftCardExchange: { screen: GiftCardExchange },
    GiftCardTransaction: { screen: GiftCardTransaction },
    SeckillList: { screen: SeckillList },
    MyInvoice: { screen: MyInvoice },
    InvoiceDetail: { screen: InvoiceDetail },
    MineInvoiceForm: { screen: MineInvoiceForm },
    Orders: { screen: Orders },
    CommodityArea: { screen: CommodityArea },
    SettlementCoupons: { screen: SettlementCoupons },
    SettlementGiftCards: { screen: SettlementGiftCards },
    PaySuccessed: { screen: PaySuccessed },
  },
  {
    headerMode: 'float',
  }
)
const LoginNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    LoginPass: { screen: LoginPass },
    PhoneVerify: { screen: PhoneVerify, path: 'phone/:type' },
    SetPassword: { screen: SetPassword, path: 'password/:type/:mobile' },
    Privacy: { screen: Privacy },
    Agreement: { screen: Agreement },
  }

)

const AppNavigator = createStackNavigator(
  {
    LoginNavigator: { screen: LoginNavigator },
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    //mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

export const routerReducer = createNavigationReducer(AppNavigator)

export const routerMiddleware = createReactNavigationReduxMiddleware(
  //'root',
  state => state.router
)

const App = createReduxContainer(AppNavigator);

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

class Router extends PureComponent {
  componentWillMount() {
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
  }
  componentDidMount() {
    SplashScreen.hide();
    wechat.registerApp(Config[Config.dev].appid,'https://yx.esehoo.com/ios/')
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
