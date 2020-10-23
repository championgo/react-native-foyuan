import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { pxToDp, theme } from "../utils";
import Touchable from './Touchable';

const Search = props => (
    <View style={styles.searchContainer}>
        <Touchable style={styles.container} {...props}>
            <Image style={styles.searchIcon} resizeMode="contain" source={require('../images/search.png')} />
            <Text style={styles.searchText}>搜索商品</Text>
        </Touchable>
    </View>
);

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: pxToDp(120),
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(26),
        backgroundColor: theme.colorWhite,
        overflow: "hidden"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: "row",
        height: pxToDp(68),
        overflow: "hidden",
        paddingHorizontal: pxToDp(20),
        backgroundColor: "#f2f2f2"
    },
    searchIcon: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginRight: pxToDp(20)
    },
    searchText: {
        fontSize: pxToDp(24),
        color: "#a3a8b0",
    }
});

export default Search;
