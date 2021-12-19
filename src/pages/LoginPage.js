import React from 'react';
import { Alert, Button,TouchableOpacity, TextInput,Text, View, StyleSheet, ToastAndroid } from 'react-native';
// https://www.npmjs.com/package/react-native-form-validator
import ValidationComponent from 'react-native-form-validator';
import axios from 'axios';
import { UrlActions } from '../actions/UrlActions';

class LoginPage extends ValidationComponent  {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
    };

  }

  _onSubmit() {
    // Call ValidationComponent validate method
    this.validate({
      username: {required: true},
      password: {required: true},
      // number: {numbers: true},
      // date: {date: 'YYYY-MM-DD'}
    });
  }

  
  async onLogin() {

    // let validate = this.validate({
    //   username: {required: true},
    //   password: {required: true},
    //   // number: {numbers: true},
    //   // date: {date: 'YYYY-MM-DD'}
    // });
    // if(!validate) return;

    const { username, password } = this.state;
    const redirectToHome = (params)=>{
      this.props.navigation.navigate('Home',params);
    }
    // // proses login lakukan disini
      axios.post(UrlActions.POST_LOGIN, {
          username: username,
          password: password,
        })
        .then(function (response) {
          // handle success
          if(response.data.success === true){
            const token = response.data.result.token;
            const role = response.data.result.role;
            if(response.data.result.id_karyawan == null){
              ToastAndroid.show("Super Admin tidak dapat melakukan presensi", ToastAndroid.LONG);
            }else{
              ToastAndroid.show(response.data.message, ToastAndroid.LONG);
              redirectToHome({
                token: response.data.result.token,
                role: response.data.result.role,
                id_karyawan: response.data.result.id_karyawan
              });
            }
            
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          if(error.response){
            ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
          }else{
            ToastAndroid.show(error.message, ToastAndroid.LONG);
          }
        });
    
  }

  render() {
    return (
      
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        {this.isFieldInError('username') && this.getErrorsInField('username').map(errorMessage => <Text>{errorMessage}</Text>) }
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <Text>{errorMessage}</Text>) }
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={this._onPressButton}
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.textStyle}>
              LOGIN
            </Text>
          </TouchableOpacity>

      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C7E3FC',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    backgroundColor: '#ecf0f1'
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17
  },
  buttonStyle: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    backgroundColor: '#207cca'
  },
});

// ...

export default LoginPage;