import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import { Button } from '../components'

import { NavigationActions, pxToDp, theme } from '../utils'

class Home extends Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />
    ),
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }
  homeMore = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'HomeMore' }))
  }
  homeMore1 = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ScrollableTabBarExample' }))
  }

  homeMore2 = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'CustomTabBarExample' }))
  }

  homeMore3 = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'CustomIndicatorExample' }))
  }
  homeMore4 = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'CoverflowExample' }))
  }
  homeMore5 = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'AutoWidthTabBarExample' }))
  }
  Search = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Search' }))

  }
  ShopHome = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ShopHome' }))

  }

  Settlement = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Settlement', params: { sku: 1, num: 3 } }))
  }

  SeckillDetails = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'SeckillDetails' }))

  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <Button text="Goto Detail" onPress={this.gotoDetail} />
          </View>
          <View style={styles.test}>
            <Text style={styles.test_text}>sadasd</Text>
          </View>
          <View>
            <Button text="Goto homeMore" onPress={this.homeMore} />
          </View>
          <View>
            <Button text="Goto SeckillDetails" onPress={this.SeckillDetails} />
          </View>
          <View>
            <Button text="Goto homeMore1" onPress={this.homeMore1} />
          </View>
          <View>
            <Button text="Goto TabBarIconExample" onPress={this.homeMore2} />
          </View>
          <View>
            <Button text="Goto CustomIndicatorExample" onPress={this.homeMore3} />
          </View>
          <View>
            <Button text="Goto CoverflowExample" onPress={this.homeMore4} />
          </View>
          <View>
            <Button text="Goto AutoWidthTabBarExample" onPress={this.homeMore5} />
            <Button text="Goto Search" onPress={this.Search} />
          </View>
          <View>
            <Button text="ShopHome" onPress={this.ShopHome} />
          </View>
          <View>
            <Button text="Settlement" onPress={this.Settlement} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baseBackgroundColor,
  },
  icon: {
    width: 32,
    height: 32,
  },
  test: {
    height: pxToDp(80),
    backgroundColor: theme.colorEc6025,
    justifyContent: "center",
    alignItems: "center"
  },
  test_text: {
    fontSize: pxToDp(50)
  }
})

export default connect()(Home)
