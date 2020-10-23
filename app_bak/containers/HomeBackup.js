import * as React from 'react';
import { StyleSheet, Image, SafeAreaView, Linking } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-tiny-toast';

import {
  TabView,
  TabBar,
} from 'react-native-tab-view';
import { Loading, Search } from '../components';
import Pages from './HomeComponents/Pages'
import { theme, pxToDp, NavigationActions } from '../utils';
import Config from '../config';
const apiDomain = Config[Config.dev].apiDomain;

const homeMeau = [
  { name: '首页', id: 1 },
];

class HomeBackup extends React.Component {
  static navigationOptions = {
    tabBarLabel: '主页',
    tabBarIcon: ({ focused, tintColor }) => {
      return (
        <Image
          style={[styles.icon, { tintColor }]}
          source={require('../images/home.png')}
        />
      )
    },
  }

  state = {
    index: 0,
    routes: [],
    datas: [],
    couponList: [],
    seckillDatas: {},
    listStatus: [],
  };

  componentDidMount() {
    this.getHomeMeauList();
    this.listPlateHome();
  }

  /**
   * 首页导航列Service
   */
  getHomeMeauList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "HomeModel/getHomeMeauList",
      payload: {},
      callback: res => {
        const meunList = res;
        const newDataArray = [...homeMeau, ...meunList];
        const newRoutes = newDataArray.map(item => {
          return {
            key: item.id,
            title: item.name
          };
        });

        this.setState({
          routes: newRoutes,
        }, () => {
          this.getHomeListPlateService();
        });
      }
    });
  }

  /**
   * 首页导航列表详情
   */
  getHomeListPlateService = (refresh = false) => {
    const { dispatch } = this.props;
    const { index, datas, routes } = this.state;
    const id = routes[index].key;

    /**
     * 有数据就不请求了
     */
    if (!!datas[index] && !refresh) {
      return;
    }

    dispatch({
      type: "HomeModel/getHomeListPlate",
      payload: {
        id
      },
      callback: res => {
        if (index != 0) {
          datas[index] = res;
          this.setState({
            datas
          });
        } else {
          this.getBanner(res);
        }
      }
    });
  }

  /**
   * 主页banner
   */
  getBanner = (data) => {
    const { dispatch } = this.props;
    const { index, datas } = this.state;

    dispatch({
      type: "HomeModel/getBanner",
      payload: {},
      callback: res => {
        data.images = res;
        datas[index] = data;
        this.setState({
          datas
        });
      }
    });
  }

  /**
   * 首页优惠券列表
   */
  couponList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "HomeModel/couponList",
      payload: {
        page: 1,
        pageSize: 2
      },
      callback: res => {
        this.setState({
          couponList: res
        });
      }
    });
  }

  /**
   * 首页秒杀列表
   */
  seckillList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "HomeModel/seckillList",
      payload: {
        page: 1,
        pageSize: 3
      },
      callback: res => {
        this.setState({
          seckillDatas: res
        });
      }
    });
  }

  /**
   * 首页模块状态列表
   */
  listPlateHome = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "HomeModel/listPlateHome",
      payload: {},
      callback: res => {
        this.couponList();
        this.seckillList();
        this.setState({
          listStatus: res
        });
      }
    });
  }

  /**
   * 切换导航
   * @param {*} index 导航索引
   */
  handleIndexChange = (index) => {
    this.setState({
      index,
    }, () => {
      this.getHomeListPlateService();
    });
  }

  renderTabBar = (
    props
  ) => (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    );

  renderScene = ({ route }) => {
    const { index, datas, couponList, seckillDatas, listStatus } = this.state;
    return <Pages
      key={route.key}
      data={datas[index]}
      navIndex={index}
      onBanner={this.onBanner}
      seeMore={this.seeMore}
      goDetail={this.gotoCommodityDetail}
      onRefresh={this.onRefresh}
      isRefreshing={false}
      listStatus={listStatus}
      couponList={couponList}
      getCoupon={this.getCoupon}
      seckillDatas={seckillDatas}
      {...this.props}
    />;
  };

  /**
   * 商品详情
   * @param {*} item 商品
   */
  gotoCommodityDetail = (item) => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }));
  }

  /**
   * go to 秒杀商品详情
   * @param {*} item 秒杀商品
   */
  gotoSeckillDetails = (item) => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: "SeckillDetails", params: item }));
  }

  /**
   * 跳转banner
   * @param {*} item 广告项
   */
  onBanner = (item) => {
    if (!!item.link) {
      // const strUrl = apiDomain + '/weixin/commodity-detail/%7B%22id%22%3A263%7D';
      const strUrl = item.link;
      // 通过正则识别域名并判断点击的banner链接是否是本站的，是本站的就跳转，不是则跳转到app外
      const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
      const url = reg.exec(strUrl)[0];
      const localUrl = reg.exec(apiDomain)[0];
      // console.log('跳转banner' + JSON.stringify(item), url);
      if (url === localUrl) {
        // /最后一个反斜杠的位置
        const index = strUrl.lastIndexOf('\/');
        // ?位置
        const indexQuestionMark = strUrl.indexOf('?');
        // 链接的长度
        const strLen = strUrl.length;
        // 得到参数
        const params = strUrl.substring(index + 1, indexQuestionMark > -1 ? indexQuestionMark : strLen);
        if (strUrl.indexOf('commodity-detail') > -1) {
          this.gotoCommodityDetail(params);
          return;
        }

        if (item.link.indexOf('seckill-detail') > -1) {
          this.gotoSeckillDetails(params);
          return;
        }
      } else {
        Linking.canOpenURL(item.link).then(supported => {
          if (supported) {
            Linking.openURL(item.link);
          } else {
            Toast.show('该设备不支持此功能', {
              position: 0,
              duration: 3000
            });
          }
        });
      }
    }
  }

  /**
   * 查看更多
   * @param {*} item 查看项
   */
  seeMore = (item) => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: 'HomeMore', params: { id: item.id } }));
  }

  /**
   * 下拉刷新
   */
  onRefresh = () => {
    const { index } = this.state;
    if (index == 0) {
      this.listPlateHome();
    };
    this.getHomeListPlateService(true);
  }

  /**
   * 获取优惠卷
   * @param {*} item 优惠卷
   */
  getCoupon = (item, index) => {
    const { couponList } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "HomeModel/getCoupon",
      payload: {
        coupon_id: item.id
      },
      callback: res => {
        couponList[index].receive = 1;
        this.setState({
          couponList
        });
      }
    });
  }

  /**
   * 搜索
   */
  goSearch = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: "Search" }));
  }

  render() {
    const { HomeModel: { meauListLoading } } = this.props;

    if (meauListLoading) {
      return <Loading />
    }

    return (
      <SafeAreaView style={styles.container}>
        <Search onPress={() => this.goSearch()} />
        <TabView
          swipeEnabled={false}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baseBackgroundColor,
  },
  icon: {
    width: pxToDp(40),
    height: pxToDp(40),
  },
  tabbar: {
    backgroundColor: theme.colorWhite,
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: theme.baseColor,
  },
  label: {
    color: '#333',
    fontSize: pxToDp(32)
  },
});

export default connect(
  ({
    HomeModel: { ...HomeModel }
  }) => ({
    HomeModel
  })
)(HomeBackup);
