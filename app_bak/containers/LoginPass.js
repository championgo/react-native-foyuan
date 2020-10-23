import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native'
import { connect } from 'react-redux'

import { Container, Header, Content, Button, Text,Item,Input,Icon,Form,Toast } from 'native-base';
import InputField from '../components/form/InputField';
import colors from '../styles/colors';

//import * as wechat from 'react-native-wechat'

class LoginPass extends Component {
  static navigationOptions = {
    title: '密码登录',
    headerBackTitle:null,
    headerTransparent: true,
  }

    constructor(props) {
        super(props);
        this.state = {
            formValid: true,
            validPhone: false,
            //mobile: '17756989411',
            //password: 'xucheng1996',
            mobile:null,
            password:null,
            validPassword: false,
            loadingVisible: false,
            secure:true,
        };

        this.handleNextButton = this.handleNextButton.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        //this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    }

    componentDidMount() {
        // 监听键盘弹出与收回
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.props.dispatch({
            type: 'app/checkLogin',
            payload: {}
        })
    }
    loginWithPhone(){
         this.props.navigation.navigate('PhoneVerify',{type:'phone'})
         console.warn('phone')
    }
    newUser(){
          this.props.navigation.navigate('PhoneVerify',{type:'new'})
    }


    handleNextButton() {
        //this.setState({ loadingVisible: true });
        console.log('ss');
        //const {navigation } = this.props;
        //const { navigate } = navigation;
        const { mobile, password } = this.state;
        this.props.dispatch({ type: 'app/login', payload: { mobile, password } })

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

    handlePasswordChange(password) {
        const { validPassword } = this.state;

        this.setState({ password });
        if (password.length > 4) {
            // Password has to be at least 4 characters long
            this.setState({ validPassword: true });
        } else {
            this.setState({ validPassword: false });
        }
        // if (!validPassword) {
        //     if (password.length > 4) {
        //         // Password has to be at least 4 characters long
        //         this.setState({ validPassword: true });
        //     }
        // } else if (password <= 4) {
        //     this.setState({ validPassword: false });
        // }
    }

  toggleNextButtonState() {
        const { validEmail, validPassword } = this.state;
        if (validEmail && validPassword) {
            return false;
        }
        return true;
    }

forgot(){

     this.props.navigation.navigate('PhoneVerify',{type:'forgot'})

}


  render() {
    const { fetching } = this.props
     const {
            formValid, loadingVisible, validPhone, validPassword,mobile,password,secure
        } = this.state;
    return (
         <Container>
           <Content padder>
                            {fetching ? (
                    <View style={[styles.container]}>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                ) : (
                        <View style={[styles.container]}>

                            <Form>
            <Item>
              <Input placeholder="手机号码" onChangeText={this.handlePhoneChange.bind(this)} />
            </Item>
            <Item>
              <Input placeholder="密码" textContentType="password" secureTextEntry={secure} onChangeText={this.handlePasswordChange.bind(this)} />
            </Item>
          </Form>
                 <Button hasText transparent style={[styles.forgot]}  onPress={this.forgot.bind(this)}><Text style={{textAlign:'right',fontSize:12}}>忘记密码?</Text></Button>
                    <View style={{marginTop:50}}>
                    <Button rounded block style={{backgroundColor:colors.primary}} onPress={this.handleNextButton} disabled={(validPhone && validPassword)?false:true}><Text> 登录 </Text></Button>
                    </View>
                     <View style={styles.fixToText}>

                      <Button hasText transparent onPress={this.loginWithPhone.bind(this)}><Text style={{textAlign:'left',fontSize:12}} >短信验证码登录</Text></Button>
         <Button hasText transparent onPress={this.newUser.bind(this)}><Text style={{textAlign:'right',fontSize:12}}>新用户注册</Text></Button>
                    </View>
                    </View>
                 
                        
                             
                    )}
            </Content>
         </Container>


    )
  }
}

const styles = StyleSheet.create({
    container:{
        marginTop:100,
        marginBottom:50
    },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgot:{
        right:0,
        position: 'absolute',
        top:60
    }


})

export default connect(({ app }) => ({ ...app }))(LoginPass)
