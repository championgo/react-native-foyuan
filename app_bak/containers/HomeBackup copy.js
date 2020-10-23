import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'

import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';

import TimerMixin from 'react-timer-mixin';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import createReactClass from 'create-react-class';

import { NavigationActions, pxToDp, theme } from '../utils'
import HomeSec from './Test/HomeSec'
import HomeSec1 from './Test/HomeSec1'
import ClassificationTabBar from './Test/ClassificationTabBar'

import { Loading } from '../components'

const homeMeau = [
  { name: '首页', id: 0 },
];

class HomeBackup extends Component {
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
    dataArray: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: "HomeModel/getHomeMeauList",
      payload: {},
      callback: res => {
        const meunList = res;
        const newDataArray = [...homeMeau, ...meunList];

        this.setState({
          dataArray: newDataArray,
        });
      }
    });

  }

  _renderDynamicView = () => {
    const { dataArray } = this.state;
    const _views = [];
    for (let i = 0; i < dataArray.length; i++) {
      const labelName = dataArray[i].name;
      const classificationId = dataArray[i].id;
      _views.push(<View tabLabel={labelName} key={labelName + i}>
        <HomeSec classificationId={classificationId} {...this.props} />
      </View>);
    }

    return _views;
  }

  _renderTabTitle() {
    const texts = [];
    for (let i = 0; i < this.state.dataArray.length; i++) {
      const labelName = this.state.dataArray[i].name;
      texts.push(labelName);
    }
    return texts;
  }


  render() {
    const { HomeModel: { meauListLoading } } = this.props;

    if (meauListLoading) {
      return <Loading />
    }

    return <View style={styles.container}>
      <ScrollableTabView
        style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: '#fff' }}
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}
        locked={false} //是否不允许滑动
        scrollWithoutAnimation={true}
        showsHorizontalScrollIndicator={false}
        prerenderingSiblingsNumber={Infinity}
      >
        {this._renderDynamicView()}
      </ScrollableTabView>
    </View>
  }
};

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
    backgroundColor: '#fff',
  },
  tab: {
    // width: 120,
    width: 'auto',
  },
  indicator: {
    backgroundColor: theme.baseColor,
  },
  label: {
    fontWeight: '400',
    color: '#333'
  },
});

export default connect(
  ({
    HomeModel: { ...HomeModel }
  }) => ({
    HomeModel
  })
)(HomeBackup);
