import React from 'react';
import { Alert, Button, TextInput, View, StyleSheet, ToastAndroid } from 'react-native';
import axios from 'axios';
import { UrlActions } from '../actions/UrlActions';
const baseUrl = 'http://192.168.8.104:3000';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
    };
  }

  
  async onLogin() {
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
            ToastAndroid.show(response.data.message, ToastAndroid.LONG);
            const token = response.data.result.token;
            const role = response.data.result.role;
            //alert(token);
            redirectToHome({
              token: response.data.result.token,
              role: response.data.result.role,
              id_karyawan: response.data.result.id_karyawan
            });
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          if(error.data != undefined){
            alert(error.data.message);
          }else{
            alert(error.message);
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
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

// ...

export default LoginPage;