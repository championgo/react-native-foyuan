import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HomeSec1 = ({key}) => {
    console.log(key);
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.author}>
                <View style={styles.meta}>
                    <Text style={styles.name}>Knowledge Bot</Text>
                    <Text style={styles.timestamp}>1st Jan 2025</Text>
                </View>
            </View>
        </ScrollView>
    );
}

// class HomeSec1 extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//         };
//     }

//     componentDidMount() {
//         console.log(this.props);
//     }

//     render() {
//         const { key } = this.props;
//         return (
//             <ScrollView
//                 style={styles.container}
//                 contentContainerStyle={styles.content}
//             >
//                 <View style={styles.author}>
//                     <View style={styles.meta}>
//                         <Text style={styles.name}>Knowledge Bot</Text>
//                         <Text style={styles.timestamp}>1st Jan 2025</Text>
//                     </View>
//                 </View>
//             </ScrollView>
//         );
//     }
// }

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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


export default HomeSec1;