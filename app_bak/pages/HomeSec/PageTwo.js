import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';

import { NavigationActions, pxToDp, theme } from '../../utils'

import { Loading } from '../../components';
import StyleOne from '../../containers/HomeComponents/StyleOne';
import StyleTwo from '../../containers/HomeComponents/StyleTwo';
import StyleThree from '../../containers/HomeComponents/StyleThree';
import StyleFour from '../../containers/HomeComponents/StyleFour';

class PageTwo extends React.PureComponent {

    render() {
        const { index, data } = this.props;

        if (!!!data) {
            return <Loading />;
        }

        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <StyleOne />
                <StyleTwo />
                <StyleThree />
                <StyleFour />
                <View>
                    <Image style={styles.avatar} source={{
                        uri: data && data.images[0].image
                    }} />
                    <Text>page two {index}</Text>
                    <Text>{JSON.stringify(data && data.list)}</Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    content: {
        paddingVertical: 16,
    },
    author: {
        flexDirection: 'row',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    meta: {
        marginHorizontal: 8,
        justifyContent: 'center',
    },
    name: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 24,
    },
    timestamp: {
        color: '#999',
        fontSize: 14,
        lineHeight: 21,
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 24,
    },
    title: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 36,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    paragraph: {
        color: '#000',
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginVertical: 8,
    },
});

export default PageTwo;
