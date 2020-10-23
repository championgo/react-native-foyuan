import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationActions, pxToDp, theme } from '../../utils'


class PageOne extends React.PureComponent {

    state = {
        a: 8
    };


    componentDidMount() {
        const { id } = this.props;
        console.log('PageOne:' + id);
    }

    render() {
        const { id } = this.props;

        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <View>
                    <Text>page one {id}</Text>
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

export default PageOne;
