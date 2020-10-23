import * as React from 'react';
import {connect} from 'react-redux';
import {View, Text, Button} from 'react-native';

function HomeScreen({navigation, count}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Details Screen{count}</Text>
            <Button title="Go to Home" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}
export default connect(({count}) => ({
    count
}))(HomeScreen);
