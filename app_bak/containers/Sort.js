import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import { Touchable, Search, Loading } from '../components';

import { NavigationActions, pxToDp, theme } from '../utils';

class Sort extends Component {
    static navigationOptions = {
        tabBarLabel: '分类',
        tabBarIcon: ({ focused, tintColor }) => (
            <Image
                style={[styles.icon, { tintColor }]}
                source={require('../images/sort.png')}
            />
        ),
    }

    state = {
        sortList: [],
        sortSubList: [],
        loading: false,
        subLoading: false,
        sortItemIndex: 0,
    };

    componentDidMount() {
        this.initService();
    }


    /**
     * 初始化请求
     * @param {*} loading 请求状态
     */
    initService = (loading = true,) => {
        const { dispatch } = this.props;
        this.setState({
            loading
        }, () => {
            dispatch({
                type: "SortModel/category_list",
                payload: {},
                callback: res => {
                    this.setState({
                        loading: false,
                        subLoading: false,
                        sortList: res
                    }, () => {
                        this.sortSubListService();
                    });
                }
            });
        });
    }

    /**
     * 次级列表
     * @param {*} params 提交参数
     * @param {*} subLoading 请求状态
     */
    sortSubListService = (subLoading = true) => {
        const { dispatch } = this.props;
        const { sortList, sortItemIndex, sortSubList } = this.state;

        /**
         * 存在值不发出请求
         */
        if (!!sortSubList[sortItemIndex]) {
            return false;
        }

        const payload = {
            level: 2,
            parent_id: sortList[sortItemIndex].id
        };

        this.setState({
            subLoading
        }, () => {
            dispatch({
                type: "SortModel/category_list",
                payload,
                callback: res => {
                    sortSubList[sortItemIndex] = res;
                    this.setState({
                        subLoading: false,
                        sortSubList
                    });
                }
            });
        });
    }

    /**
     * 搜索
     */
    goSearch = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "Search" }));
    }

    /**
     * 选择分类列表项
     * @param {*} item 选择项
     * @param {*} index 选择项索引
     */
    chooseSortItem = (item, index) => {
        this.setState({
            sortItemIndex: index
        }, () => {
            this.sortSubListService();
        });
    }

    /**
     * 选择次分类列表项
     * @param {*} item 选择项
     * @param {*} index 选择项索引
     */
    chooseSortSubItem = (item, index) => {
        console.log(item);
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: 'CommodityArea', params: item }));
    }

    render() {
        const { loading, sortList, sortItemIndex, sortSubList, subLoading } = this.state;

        if (!!loading) {
            return <Loading />;
        }

        return (
            <SafeAreaView style={styles.container}>
                <Search onPress={() => this.goSearch()} />
                <View style={styles.sortContainer}>
                    <View style={styles.containerL}>
                        <ScrollView>
                            {
                                sortList.map((item, index) => <Touchable
                                    key={'sortList' + index + item.id}
                                    style={styles.sortList}
                                    onPress={() => this.chooseSortItem(item, index)}
                                >
                                    <Text style={[styles.sortListText, sortItemIndex == index ? styles.sortListTextActive : '']}>{item.name}</Text>
                                </Touchable>)
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.containerR}>
                        <ScrollView>
                            <View style={styles.sortSubListContainer}>
                                <View style={styles.sortSubListContainerTop}>
                                    <Image resizeMode="cover" source={{ uri: sortList[sortItemIndex]?.image }} style={styles.sortListImage} />
                                </View>
                                <View style={styles.sortListIntro}>
                                    <View style={styles.sortListIntroMark} />
                                    <Text style={styles.sortListIntroText}>{sortList[sortItemIndex]?.intro || '无'}</Text>
                                    <View style={styles.sortListIntroMark} />
                                </View>
                                <View style={styles.sortSubListContainerBottom}>
                                    {
                                        subLoading ?
                                            <Loading /> :
                                            sortSubList[sortItemIndex]?.map((item, index) => <Touchable
                                                key={'sortSubList' + item.id + index}
                                                style={styles.sortSubList}
                                                onPress={() => this.chooseSortSubItem(item, index)}
                                            >
                                                <Image resizeMode="contain" source={{ uri: item.image }} style={styles.sortSubListImage} />
                                                <Text numberOfLines={1} style={styles.sortSubListText}>{item.name}</Text>
                                            </Touchable>)
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
    },
    icon: {
        width: pxToDp(40),
        height: pxToDp(40),
    },
    sortContainer: {
        flex: 1,
        flexDirection: "row",
        paddingTop: pxToDp(28),
    },
    containerL: {
        flex: 1,
    },
    containerR: {
        flex: 3
    },
    sortList: {
        paddingVertical: pxToDp(32),
        overflow: "hidden"
    },
    sortListText: {
        height: pxToDp(50),
        lineHeight: pxToDp(50),
        fontSize: pxToDp(28),
        color: "#a3a8b0",
        paddingLeft: pxToDp(28)
    },
    sortListTextActive: {
        fontSize: pxToDp(32),
        color: "#2d2d2d",
        borderLeftWidth: pxToDp(6),
        borderLeftColor: "#2d2d2d"
    },
    sortSubListContainer: {
        paddingLeft: pxToDp(16),
        paddingRight: pxToDp(20)
    },
    sortSubListContainerTop: {
        width: "100%",
        height: pxToDp(208),
        overflow: "hidden"
    },
    sortListImage: {
        width: "100%",
        height: "100%"
    },
    sortListIntro: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: pxToDp(8),
        marginBottom: pxToDp(48)
    },
    sortListIntroText: {
        color: "#b0b4bb",
        fontSize: pxToDp(24),
        height: pxToDp(34),
        lineHeight: pxToDp(34),
        marginHorizontal: pxToDp(20),
    },
    sortListIntroMark: {
        width: pxToDp(20),
        height: pxToDp(2),
        backgroundColor: "#b0b4bb",
        borderRadius: pxToDp(2)
    },
    sortSubListContainerBottom: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: pxToDp(-15)
    },
    sortSubList: {
        width: 100 / 3 + '%',
        paddingHorizontal: pxToDp(15),
        marginBottom: pxToDp(30)
    },
    sortSubListImage: {
        paddingTop: "100%",
        borderRadius: pxToDp(8),
        marginBottom: pxToDp(16),
    },
    sortSubListText: {
        color: '#2d2d2d',
        fontSize: pxToDp(24),
        height: pxToDp(34),
        lineHeight: pxToDp(34),
        textAlign: "center"
    }
})

export default connect(({ SortModel: { ...SortModel } }) => ({ SortModel }))(Sort);
