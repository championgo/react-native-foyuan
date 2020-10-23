import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, ImageBackground, ScrollView, KeyboardAvoidingView, Alert} from 'react-native'
import { connect } from 'react-redux'

import { Container, Header, Content, Button, Text,Form,Input,Item,Label,Icon} from 'native-base';
import InputField from '../components/form/InputField';
import colors from '../styles/colors';

import { createAction, NavigationActions } from '../utils'

class PhoneVerify extends Component {
    static navigationOptions = ({ navigation }) => {
        const type = {'new':'新用户注册','phone':'短信验证码登录','wechat':'绑定手机号','forgot':'重置密码'}
        return {
            title: type[navigation.getParam('type', 'new')],
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            formValid: true,
            validPhone: false,
            //mobile: '17756989411',
            //password: 'xucheng1996',
            mobile:null,
            code:null,
            loadingVisible: false,
            secure:true,
            type:props.navigation.state.params.type,
            countDown:0,
        };

        //this.handleCloseNotification = this.handleCloseNotification.bind(this);
        this.handleNextButton = this.handleNextButton.bind(this);
        //this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    }

    componentDidMount() {
        // 监听键盘弹出与收回
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

      handlePhoneChange(phone) {
        // eslint-disable-next-line
        const phoneCheckRegex = /^1[3456789]\d{9}$/;
        const { validPhone } = this.state;
        this.setState({ mobile:phone });
        if (!validPhone) {
            if (phoneCheckRegex.test(phone)) {
                this.setState({ validPhone: true });
            }
        } else if (!phoneCheckRegex.test(phone)) {
            this.setState({ validPhone: false });
        }
    }

    handleNextButton() {
        //this.setState({ loadingVisible: true });
        const { mobile,code,type } = this.state;
        if(type=='phone'){
        this.props.dispatch({ type: 'app/phoneLogin', payload: { mobile, verifyCode:code } })
        }else if(type=='new') {
            this.props.dispatch({ type: 'app/checkCode', payload: { mobile, verifyCode:code } })
        }else if(type == 'forgot'){
            this.props.dispatch({ type: 'app/checkMobile', payload: { mobile, verifyCode:code } })
        }

        /* setTimeout(() => {
      const { emailAddress, password } = this.state;
      if (logIn(emailAddress, password)) {
        this.setState({ formValid: true, loadingVisible: false });
        navigate('TurnOnNotifications');
      } else {
        this.setState({ formValid: false, loadingVisible: false });
      }
    }, 2000);*/
    }

    handleCodeChange(code) {

        this.setState({ code });
    }
    sendCode(){
        const { mobile} = this.state;
        this.props.dispatch({ type: 'app/sendCode', payload: { mobile } })
        this.countDown(60)

    }
    countDown(num){
        if(num ==0) return;
        num--
        this.setState({countDown:num})
        setTimeout(()=>{
            this.countDown(num);
        },1000)
    }
    test(){
        console.warn('test')
         this.props.navigation.navigate('SetPassword',{type:'forgot',mobile:'13812278420'})

    }
    goPage(routeName){
         this.props.navigation.navigate(routeName)
    }


    render() {
        const { fetching } = this.props
        const {
            formValid, loadingVisible, validPhone,countDown,type
        } = this.state;
         const typeName = {'new':'注册','phone':'登录','wechat':'确认提交','forgot':'下一步'}
        return (
            <Container>
            {fetching ? (
                <View style={[styles.container]}>
                <ActivityIndicator size="large" color="#ffffff" />
                </View>
            ) : (<Content padder>
                <View style={[styles.container]}>
                <Form>
                  <Item floatingLabel>
              <Label>手机号码</Label> 
                <Input onChangeText={this.handlePhoneChange.bind(this)} />
                </Item>

                <Item floatingLabel>
                  <Label>验证码</Label> 
                <Input onChangeText={this.handleCodeChange.bind(this)}/>
                </Item>
                </Form>
                <Button small bordered style={[styles.verify]} disabled={(validPhone ==false || countDown > 0)?true:false} onPress={this.sendCode.bind(this)}><Text>{countDown>0?countDown:'发送验证码'} </Text></Button>
                </View>

                 <View style={{marginTop:50}}>
                    <Button rounded block style={{backgroundColor:colors.primary}} onPress={this.handleNextButton} disabled={validPhone?false:true}><Text> {typeName[type]} </Text></Button>
                    </View>

                {/*<View style={{marginTop:50}}>
                    <Button rounded block style={{backgroundColor:colors.primary}} onPress={this.test.bind(this)}><Text> {typeName[type]} </Text></Button>
                    </View>*/}
                {type=='new'?( <View style={{textAlign:'center'}}>
                <Text style={{textAlign:'center',fontSize:13,color:'#333333',paddingTop:10,marginBottom:5}}>点击“注册”按钮，即表示您已阅读并同意</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                <Button small transparent onPress={()=>this.goPage('Agreement')}><Text> 《软件许可及服务协议》</Text></Button>
                <Text style={{fontSize:13,color:'#333333',paddingTop:6}}> 和 </Text>
                <Button small transparent onPress={()=>this.goPage('Privacy')}><Text>《隐私政策》</Text></Button>
                </View>
                </View>):null}



                </Content>
            )}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginBottom:50
    },
    verify:{
        right:0,
        position: 'absolute',
        top:95
    }

})

export default connect(({ app }) => ({ ...app }))(PhoneVerify)
