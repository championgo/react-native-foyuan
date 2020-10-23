import React from 'react'
import { StyleSheet, Text, ActivityIndicator } from 'react-native'
import Touchable from './Touchable';
import { pxToDp, theme } from "../utils";

export const Button = ({ text, children, style, textStyle, loading = false, loadingColor = "#fff", loadingStyle, ...rest }) => (
  <Touchable style={[styles.button, style]} {...rest}>
    {loading ? (
      <ActivityIndicator
        style={[styles.indicator, loadingStyle]}
        color={loadingColor}
        size="small"
      />
    ) : null}
    <Text numberOfLines={1} style={[styles.text, textStyle]}>{text || children}</Text>
  </Touchable>
)

const styles = StyleSheet.create({
  button: {
    // paddingHorizontal: pxToDp(50),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    backgroundColor: theme.baseColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: pxToDp(32),
    fontWeight: "500",
    color: "#fff"
  },
  indicator: {
    marginRight: pxToDp(16)
  }
})

export default Button
