import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationActions, pxToDp, theme } from '../../utils'


export default class HomeSec extends React.PureComponent {

    state = {
        a: 8
    };


    componentDidMount() {
        const { classificationId } = this.props;
        console.log(classificationId);
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <View style={styles.author}>
                    <View style={styles.meta}>
                        <Text style={styles.name} onPress={() => {
                            console.log(this.props.classificationId);
                            this.setState({
                                a: this.props.classificationId
                            });
                        }}>Knowledge Bot {this.props.classificationId}</Text>
                        <Text style={styles.timestamp}>1st Jan 2025 && {this.state.a}</Text>
                    </View>
                </View>
                <Text style={styles.title}>Lorem Ipsum</Text>
                <Text style={styles.paragraph}>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It
                    has roots in a piece of classical Latin literature from 45 BC, making
                    it over 2000 years old.
                </Text>
                <Text style={styles.paragraph}>
                    Richard McClintock, a Latin professor at Hampden-Sydney College in
                    Virginia, looked up one of the more obscure Latin words, consectetur,
                    from a Lorem Ipsum passage, and going through the cites of the word in
                    classical literature, discovered the undoubtable source.
                </Text>
                <Text style={styles.paragraph}>
                    Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de
                    Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by
                    Cicero, written in 45 BC. This book is a treatise on the theory of
                    ethics, very popular during the Renaissance. The first line of Lorem
                    Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in
                    section 1.10.32.
                </Text>
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
