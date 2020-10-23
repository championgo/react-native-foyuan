import React from 'react';
import { StyleSheet, View, Image, Text, SafeAreaView, ScrollView, } from 'react-native';
import { NavigationActions, pxToDp, theme } from '../utils'

export const FooterLogo = (props) => (
  <View>
    {/* <View style={styles.headtitle}>
      <Text style={styles.title}>关于我们</Text>
    </View> */}
    <View style={styles.footerlogo}>
      <Image source={require('../images/wuweilogo.png')} style={styles.logo} />
      <Text style={styles.text}>Copy right©2020 无锡无畏科技互助有限公司 版权所有</Text>
      <Text style={styles.text}>苏ICP备16038532号-2</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  headtitle: {
    width: "100%",
    height: pxToDp(88),
  },
  title: {
    fontSize: pxToDp(32),
    color: '#2D2D2D',
    textAlign: "center",
    lineHeight: pxToDp(88)
  },
  footerlogo: {
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(30),
  },

  logo: {
    width: pxToDp(260),
    height: pxToDp(80),
    marginVertical: pxToDp(40)
  },
  text: {
    color: '#a0a0a0',
    fontSize: pxToDp(28),
    marginBottom: pxToDp(10)
  }
})
export default FooterLogo;
