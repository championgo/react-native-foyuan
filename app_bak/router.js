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
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from "react-navigation-stack";
import { theme, pxToDp } from './utils'

import Loading from './containers/Loading'
import Login from './containers/Login'
import LoginPass from './containers/LoginPass'
import SetPassword from './containers/SetPassword'
import PhoneVerify from './containers/PhoneVerify'
import Home from './containers/Home'
import HomeBackup from './containers/HomeBackup'
import Sort from './containers/Sort';
import ShoppingCart from './containers/ShoppingCart'

import Account from './containers/Account'
import Detail from './containers/Detail'
import Mine from './containers/Mine'

import HomeMore from './pages/HomeMore'
import CommodityDetail from './pages/CommodityDetail'
import CombinationDiscount from './pages/CombinationDiscount'
import SeckillDetails from './pages/SeckillDetails'
import Aboutus from './pages/Aboutus'
import Mycoupon from './pages/Mycoupon'
import Orderdetails from './pages/Orderdetails'
import Aftersale from './pages/Aftersale'
import Evaluate from './pages/Evaluate'
import AftersalesProcess from './pages/AftersalesProcess'
import ReceivingAftersale from './pages/ReceivingAftersale'
import TrackingLogistics from './pages/TrackingLogistics'
import DiscountJump from './pages/DiscountJump'
import EvaluateSuccess from './pages/EvaluateSuccess'
import AllEvaluate from './pages/AllEvaluate'

import EditMine from './pages/EditMine'
// import HomeMore from './containers/HomeMore'
import ModifyPhone from './pages/ModifyPhone'
import EditPhone from './pages/EditPhone'
import Address from './pages/Address'
import Search from './pages/Search'
import * as wechat from 'react-native-wechat-lib'
import ShopHome from './pages/ShopHome'
import Feedback from './pages/Feedback'
import GiftCard from './pages/GiftCard'
import GiftCardExchange from './pages/GiftCardExchange'
import GiftCardTransaction from './pages/GiftCardTransaction'
import MyInvoice from './pages/MyInvoice'
import InvoiceDetail from './pages/InvoiceDetail'
import MineInvoiceForm from './pages/MineInvoiceForm'
import CommodityArea from './pages/CommodityArea'

import ScrollableTabBarExample from './pages/test'
import CustomTabBarExample from './pages/CustomTabBarExample'
import CustomIndicatorExample from './pages/CustomIndicatorExample'
import CoverflowExample from './pages/CoverflowExample'
import AutoWidthTabBarExample from './pages/AutoWidthTabBarExample'
import { Root } from "native-base";
import Settlement from './pages/Settlement';
import HomeCouponList from './pages/HomeCouponList';
import SeckillList from './pages/SeckillList';
import Orders from './pages/Orders';
import SplashScreen from 'react-native-splash-screen'
import Agreement from './containers/agreement'
import Privacy from './containers/privacy'
import SettlementCoupons from './pages/SettlementCoupons';
import SettlementGiftCards from './pages/SettlementGiftCards';
import PaySuccessed from './pages/PaySuccessed';

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
      <Root>
        <App dispatch={dispatch} state={router} />
      </Root>
    )
  }
}

export default connect(({ app, router }) => ({ app, router }))(Router)
