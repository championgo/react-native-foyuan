import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import theme from "../utils/theme";

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator color={theme.baseColor} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Loading;
