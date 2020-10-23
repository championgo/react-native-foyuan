import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import { Textarea } from "native-base";
import ImagePicker from 'react-native-image-crop-picker';
import Config from '../config';

class Evaluate extends Component {
    static navigationOptions = {
        title: '评价',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 加载状态
            meauListLoad: true,
            problem: [
                "商品问题",
                "物流问题",
                "包装问题",
                "客服问题",
                "其他"
            ],
            Container: "",
            // 订单id
            order_id: '',
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'Mine/getReview',
            payload: {
                id
            },
            callback: res => {
                if (res) {
                    res.map(item => {
                        item.rating = 5;
                        item.question = "";
                        item.content = "";
                        item.images = [];
                        item.tabIndex = 0
                    });
                    this.setState({
                        order_id: id,
                        Container: res,
                        meauListLoad: false
                    })
                }
            }
        })
    }
    Stars = (rating, item) => {
        const { Container } = this.state;
        item.rating = rating + 1;
        this.setState({
            Container
        });
    }

    Problem = (question, item) => {
        const { Container } = this.state;
        item.question = question;
        this.setState({
            Container
        });
    }
    // 上传图片
    Upload(itum) {
        ImagePicker.openPicker({
            mediaType: 'photo',
            includeBase64: true
        }).then(image => {
            let Image = 'data:image/png;base64,' + image.data;
            this.props.dispatch({
                type: `app/changeimg`,
                payload: {
                    image: Image,
                },
                callback: (res) => {
                    if (res.error == 0) {
                        itum.images.push(Config.apicommodity + res.data)
                        const { Container } = this.state;
                        this.setState({
                            Container
                        });
                    }
                }
            });
        }).catch(res => {
            console.log(res)
        })
    }
    // 删除图片
    Delete = (item, itum) => {
        this.props.dispatch({
            type: `Mine/deteteupload`,
            payload: {
                image: item.replace(Config.apicommodity, '')
            },
            callback: (res) => {
                if (res) {
                    let arr = itum.images;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == item) {
                            arr.splice(i, 1);
                        };
                        const { Container } = this.state;
                        this.setState({
                            Container
                        });
                    }
                }
            }
        })
    }
    onChange = (itum, content) => {
        const { Container } = this.state;
        itum.content = content;
        this.setState({
            Container
        });
    }
    // 发布
    Release = () => {
        const { Container } = this.state;
        const products = [];
        Container.map((item) => {
            products.push({ content: item.content, images: item.images, product_sku_id: item.product_sku_id, question: item.question, rating: item.rating })
        })
        this.props.dispatch({
            type: `Mine/postreview`,
            payload: {
                order_id: this.state.order_id,
                products: products
            },
            callback: (res) => {
                if (res) {
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'EvaluateSuccess' }))
                }
            }
        });
    }
    render() {
        const numArr = [0, 1, 2, 3, 4];
        const { meauListLoad } = this.state
        if (meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{ paddingBottom: pxToDp(100) }}>
                        {
                            this.state.Container.map((itum, Idx) => (
                                <View style={styles.searchbackground} key={`Container_${Idx}`}>
                                    {/* 评分 */}
                                    <View style={styles.evaluate_commodity}>
                                        <View style={styles.commodity_pic}>
                                            <Image style={styles.commodity_pic} source={{ uri: itum.product_thumb }}></Image>
                                        </View>
                                        <View style={styles.scorecon}>
                                            <View style={styles.scorenumber}>
                                                <Text style={styles.scoretitle}>评分</Text>
                                                <View style={styles.scorestars}>
                                                    {
                                                        numArr.map((item) => (
                                                            <Touchable key={`stars_${item}`} onPress={() => this.Stars(item, itum)}>
                                                                <Image style={styles.scorestarspic} source={itum.rating < item + 1 ? require('../images/noscore.png') : require('../images/score.png')}></Image>
                                                            </Touchable>
                                                        ))
                                                    }
                                                </View>
                                            </View>
                                            {
                                                itum.rating > 3 ?
                                                    <Text style={styles.scoreword}>超赞，很喜欢呢</Text>
                                                    :
                                                    <Text style={styles.scoreword}>哎，失望</Text>
                                            }
                                        </View>
                                    </View>
                                    {/* 请选择您遇到的问题 */}
                                    {
                                        itum.rating > 3 ?
                                            null
                                            :
                                            <View style={styles.negative_comment}>
                                                <Text style={styles.negative_comment_title}>请选择您遇到的问题</Text>
                                                <View style={styles.negative_comment_reasons}>
                                                    {
                                                        this.state.problem.map((item, Index) => (
                                                            <Text style={styles[itum.question == item ? 'negative_comment_contentco' : 'negative_comment_content']} onPress={() => this.Problem(item, itum)} key={`problem_${Index}`}>{item}</Text>
                                                        ))
                                                    }
                                                </View>
                                            </View>
                                    }
                                    {/* 评分内容图片 */}
                                    <View style={styles.score_word_pic}>
                                        <View style={styles.score_word_pic_con}>
                                            <Textarea style={styles.Inputcon}
                                                placeholder="快告诉小伙伴你的使用心得吧"
                                                placeholderTextColor="#a3a8b0"
                                                onChangeText={content => this.onChange(itum, content)}
                                                value={itum.content}
                                            />
                                            <View style={styles.Upload_pictures}>
                                                {
                                                    itum.images.map((item, index) => (
                                                        <View style={styles.Upload_picture} key={`images_${index}`}>
                                                            <ImageBackground style={styles.uploadpictrue} source={{ uri: item }}>
                                                                <Text style={styles.detlet} onPress={() => this.Delete(item, itum)}>X</Text>
                                                            </ImageBackground>
                                                        </View>
                                                    ))
                                                }
                                                {
                                                    itum.images.length < 3 ?
                                                        <Touchable style={styles.Upload_picture} onPress={() => this.Upload(itum)}>
                                                            <ImageBackground style={styles.uploadpictrue} source={require('../images/upload.png')}></ImageBackground>
                                                        </Touchable>
                                                        : null
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }

                    </View>
                </ScrollView>
                <Text style={styles.release} onPress={() => this.Release()}>发布评价</Text>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    searchbackground: {
        paddingHorizontal: pxToDp(40)
    },
    evaluate_commodity: {
        marginTop: pxToDp(30),
        display: 'flex',
        flexDirection: 'row'
    },
    commodity_pic: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(4),
        backgroundColor: "red"
    },
    scorecon: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: pxToDp(30)
    },
    scorenumber: {
        height: pxToDp(50),
        flexDirection: 'row',
        alignItems: "center",
    },
    scoreword: {
        fontSize: pxToDp(24),
        color: 'black'
    },
    scoretitle: {
        fontSize: pxToDp(30),
        paddingRight: pxToDp(30)
    },
    scorestars: {
        width: pxToDp(250),
        height: pxToDp(50),
        flexDirection: 'row'
    },
    scorestarspic: {
        width: pxToDp(50),
        height: pxToDp(50),
    },
    negative_comment: {
        marginTop: pxToDp(40)
    },
    negative_comment_title: {
        fontSize: pxToDp(30),
        color: '#2d2d2d'
    },
    negative_comment_reasons: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    negative_comment_content: {
        width: pxToDp(140),
        height: pxToDp(60),
        fontSize: pxToDp(24),
        color: '#2d2d2d',
        textAlign: 'center',
        lineHeight: pxToDp(60),
        borderRadius: pxToDp(30),
        borderColor: "#a3a8b0",
        borderWidth: pxToDp(2),
        borderStyle: 'solid',
        marginTop: pxToDp(30),
        marginRight: pxToDp(30),
        flexWrap: 'wrap'
    },
    negative_comment_contentco: {
        width: pxToDp(140),
        height: pxToDp(60),
        fontSize: pxToDp(24),
        color: 'white',
        textAlign: 'center',
        lineHeight: pxToDp(60),
        borderRadius: pxToDp(30),
        borderColor: "#66bfb8",
        borderWidth: pxToDp(2),
        borderStyle: 'solid',
        marginTop: pxToDp(30),
        marginRight: pxToDp(30),
        flexWrap: 'wrap',
        backgroundColor: '#66bfb8'
    },
    score_word_pic: {
        marginVertical: pxToDp(30),
        backgroundColor: '#f2f2f2'
    },
    score_word_pic_con: {
        paddingHorizontal: pxToDp(10),
        paddingVertical: pxToDp(30)
    },
    Inputcon: {
        width: "100%",
        height: pxToDp(190),
    },
    Upload_pictures: {
        height: pxToDp(190),
        marginTop: pxToDp(30),
        marginHorizontal: pxToDp(20),
        display: 'flex',
        flexDirection: 'row',
    },
    Upload_picture: {
        width: pxToDp(190),
        height: pxToDp(190),
        marginRight: pxToDp(20),
    },
    uploadpictrue: {
        width: '100%',
        height: '100%',
        display: "flex",
        justifyContent: 'flex-end',
        flexDirection: "row",
    },
    detlet: {
        width: pxToDp(40),
        height: pxToDp(40),
        backgroundColor: "rgba(0,0,0,0.5)",
        textAlign: "center",
        lineHeight: pxToDp(40),
        fontSize: pxToDp(30),
        color: 'white'
    },
    release: {
        width: '100%',
        height: pxToDp(100),
        backgroundColor: '#66bfb8',
        fontSize: pxToDp(30),
        color: 'white',
        textAlign: 'center',
        lineHeight: pxToDp(100)
    }

})

export default connect(({ Mine }) => ({ ...Mine }))(Evaluate)
