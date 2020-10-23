import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, ImageBackground, ScrollView, KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'
import { Container, Header, Content, Button, Text,Form,Input,Item,Label,Icon} from 'native-base';
import colors from '../styles/colors';

import { createAction, NavigationActions,Toast } from '../utils'

class SetPassword extends Component {
    static navigationOptions = ({ navigation }) => {
        const type = {'new':'设置密码','forgot':'重置密码'}
        return {
            title: type[navigation.getParam('type', 'new')],
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            formValid: true,
            validPassword: false,
            password:null,
            rePassword:null,
            loadingVisible: false,
            secure:true,
            mobile:props.navigation.state.params.mobile,
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

      handlePasswordChange(password) {
        // eslint-disable-next-line
        if(password.length > 4){
            this.setState({ validPassword: true });
        }

        this.setState({ password:password });
    }
    handlePasswordVerifyChange(password) {
        // eslint-disable-next-line
        this.setState({ rePassword:password });
    }

    handleNextButton() {
        //this.setState({ loadingVisible: true });
        const { mobile,type,password,rePassword } = this.state;
        if(password.length < 4){
            Toast.error('密码位数太少啦，建议8-16位')
            return
        }
        if(password != rePassword){
             Toast.error('密码输入不一致')
            return
        }
        if(type=='new'){
        this.props.dispatch({ type: 'app/signUp', payload: { mobile, password,password_confirmation:rePassword } })
        }else if(type=='forgot') {
            this.props.dispatch({ type: 'app/resetPassword', payload: { mobile, password,password_confirmation:rePassword } })
        }

    }

  
    render() {
        const { fetching } = this.props
        const {
            type,
            validPassword
            
        } = this.state;
         const typeName = {'new':'确认提交','forgot':'确认提交'}
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
                <Label>密码</Label> 
                <Input onChangeText={this.handlePasswordChange.bind(this)} />
                </Item>

                <Item floatingLabel>
                  <Label>验证密码</Label> 
                <Input textContentType="password" textContentType="password" onChangeText={this.handlePasswordVerifyChange.bind(this)}/>
                </Item>
                </Form>
                </View>

                 <View style={{marginTop:50}}>
                    <Button rounded block style={{backgroundColor:colors.primary}} onPress={this.handleNextButton} disabled={validPassword?false:true}><Text> {typeName[type]} </Text></Button>
                    </View>



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

})

export default connect(({ app }) => ({ ...app }))(SetPassword)
