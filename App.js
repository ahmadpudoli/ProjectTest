import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/LoginPage';
import HomePage from './src/pages/HomePage';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={
              { 
                title: "Login Presensi Mobile",
              }
            }
          />
          <Stack.Screen
            name="Home"
            component={HomePage} 
            options={
              { 
                title: "Login Presensi Mobile",
                header: ()=>null
              }
            }           
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;