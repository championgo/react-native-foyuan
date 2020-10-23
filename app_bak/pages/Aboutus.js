import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme } from '../utils'
import { Loading, FooterLogo } from '../components';


class Aboutus extends Component {
    static navigationOptions = {
        title: '关于我们',
    }
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {

    }
    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <FooterLogo />
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
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(Aboutus)
