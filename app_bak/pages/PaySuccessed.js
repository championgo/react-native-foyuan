import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text } from 'react-native';
import { connect } from 'react-redux';

import { Button, Loading } from '../components';
import { theme, pxToDp, NavigationActions, StackActions } from '../utils';

class PaySuccessed extends React.Component {
    static navigationOptions = {
        title: '支付成功',
        headerShown: false
    };

    componentDidMount() { }

    /**
     * 查看订单
     */
    checkOrder = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "Orders" }));
    }

    /**
     * 回到首页
     */
    homeBack = () => {
        const { dispatch } = this.props;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Main",
                })
            ]
        });
        dispatch(resetAction);
    }

    render() {
        // if (!!!coupon) {
        //     return <Loading />
        // }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.top}>
                        <View style={styles.topTextContainer}>
                            <Text style={styles.topText}>支付成功</Text>
                        </View>
                        <View style={styles.btns}>
                            <Button
                                style={styles.checkOrder}
                                textStyle={styles.checkOrderText}
                                text="查看订单"
                                onPress={() => this.checkOrder()}
                            />
                            <Button
                                style={styles.homeBack}
                                textStyle={styles.homeBackText}
                                text="回到首页"
                                onPress={() => this.homeBack()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    top: {
        backgroundColor: theme.colorWhite,
        marginBottom: pxToDp(10),
        paddingHorizontal: pxToDp(40)
    },
    topTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: pxToDp(75),
        paddingBottom: pxToDp(94)
    },
    topText: {
        fontSize: pxToDp(42),
        color: "#2D2D2D",
        fontWeight: "500"
    },
    btns: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: pxToDp(100)
    },
    checkOrder: {
        width: pxToDp(305),
        height: pxToDp(98),
        borderRadius: pxToDp(4)
    },
    checkOrderText: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#F7F8FA"
    },
    homeBack: {
        width: pxToDp(305),
        height: pxToDp(98),
        borderRadius: pxToDp(4),
        backgroundColor: "#FF826E"
    },
    homeBackText: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#F7F8FA"
    }
});

export default connect()(PaySuccessed);