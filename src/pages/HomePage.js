// Import React
import React, {useState, Component} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  BackHandler
} from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import {UrlActions} from '../actions/UrlActions';
import {format} from 'date-fns';
import GetLocation from 'react-native-get-location'
import Geolocation from 'react-native-geolocation-service';


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
        infoCheckin: "-",
        infoCheckout: "-",
        statusCheckin: false,
        statusCheckout: false,
        tgl_presensi: format(new Date(), 'dd MMMM yyyy'),
        longitute: -6.175392, // latitude monas jakarta
        latitude: 106.827153, // longitude monas, jakarta
    };
    this.showInfoPresensiHariIni();
  }  

  
  componentDidMount() {
    this.showInfoPresensiHariIni(); 
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
    return true;
  }

  setInfoCheckIn = (newText)=>{
    this.setState({infoCheckin: newText});
  }
  
  setInfoCheckout = (newText)=>{
    this.setState({infoCheckout: newText});
  }
  
  setStatusCheckIn = (bool)=>{
    this.setState({statusCheckin: bool});
  }
  
  setStatusCheckout = (bool)=>{
    this.setState({statusCheckout: bool});
  }

  showInfoPresensiHariIni = async () =>{
      const self = this;
      axios.get(UrlActions.GET_INFO_PRESENSI_HARI_INI,{
        headers: { 
          Authorization: `Bearer ${this.props.route.params.token}`,
        }
      })
      .then(function (response) {
        // handle success
        if(response.data.success === true){
          if(response.data.result.status_checkin){
            self.setInfoCheckIn(`Sudah Pada ${response.data.result.checkin}`);
            self.setStatusCheckIn(true);
          }else{
            self.setInfoCheckIn(`Belum Checkin`);
            self.setStatusCheckIn(false);
          }

          if(response.data.result.status_checkout){
             self.setInfoCheckout(`Sudah Pada ${response.data.result.checkout}`);
            self.setStatusCheckout(true);
          }else{
            self.setInfoCheckout(`Belum Checkout`);            
            self.setStatusCheckout(false);
          }
        }else{
          ToastAndroid.show(response.data.message, ToastAndroid.LONG);
        }
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
      
  
  render() {
    console.log(this.props);
        
    
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera permission',
            },
          );
          // If CAMERA Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else return true;
    };

    const requestExternalWritePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'External Storage Write Permission',
              message: 'App needs write permission',
            },
          );
          // If WRITE_EXTERNAL_STORAGE Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          alert('Write permission err', err);
        }
        return false;
      } else return true;
    };

  

  const checkin = async (response) =>{
    
    const uri_file = response.assets[0].uri;
    const filePath = uri_file.replace('file://', '');
    const self = this;
    RNFetchBlob.fetch(
          'POST',
          UrlActions.POST_PRESENSI_CHECKIN,
          {
            Authorization: `Bearer ${this.props.route.params.token}`,
            //otherHeader: 'foo',
            'Content-Type': 'multipart/form-data',
          },
          [
              // part file from storage
              { name : 'filecheckin', filename : response.assets[0].fileName, type: response.assets[0].type, data: RNFetchBlob.wrap(filePath)},
              // elements without property `filename` will be sent as plain text
              { name : 'lat', data : self.state.latitude.toString()},
              { name : 'lang', data : self.state.longitute.toString()},
            ],
        ).then((resp) => {
          console.log('Response Saya');
          console.log(resp.data);
          let respData =  JSON.parse(resp.data);
          ToastAndroid.show(respData.message, ToastAndroid.LONG);
          if(respData.success){
            self.showInfoPresensiHariIni();
          }
          
        }).catch((err) => {
           ToastAndroid.show(err.message, ToastAndroid.LONG);
        });
  }

  const checkout = async (response) =>{
    
    const uri_file = response.assets[0].uri;
    const filePath =  uri_file.replace('file://', '');
    self = this;

    RNFetchBlob.fetch(
          'POST',
          UrlActions.POST_PRESENSI_CHECKOUT,
          {
            Authorization: `Bearer ${this.props.route.params.token}`,
            //otherHeader: 'foo',
            'Content-Type': 'multipart/form-data',
          },
          [
              // part file from storage
              { name : 'filecheckout', filename : response.assets[0].fileName, type: response.assets[0].type, data: RNFetchBlob.wrap(filePath)},
              // elements without property `filename` will be sent as plain text
              { name : 'lat', data : self.state.latitude.toString()},
              { name : 'lang', data : self.state.longitute.toString()},
            ],
        ).then((resp) => {
          console.log('Response Saya');
          console.log(resp.data);
          let respData =  JSON.parse(resp.data);
          ToastAndroid.show(respData.message, ToastAndroid.LONG);
          if(respData.success){
            self.showInfoPresensiHariIni();
          }
          
        }).catch((err) => {
           ToastAndroid.show(err.message, ToastAndroid.LONG);
        });
  }

  const captureImage = async (type, type_presensi) => {
    if(type_presensi == 'checkin'){
      if(this.state.statusCheckin == true){
        ToastAndroid.show("Anda sudah melakukan checkin untuk hari ini", ToastAndroid.LONG);
        return;
      }
    }else{
      if(this.state.statusCheckin == false){
        ToastAndroid.show("Anda belum melakukan checkin", ToastAndroid.LONG);
        return;
      }else{
        if(this.state.statusCheckout == true){
          ToastAndroid.show("Anda sudah melakukan checkout untuk hari ini", ToastAndroid.LONG);
          return;
        }
      }
    }
      
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      //durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.assets);
        console.log('uri -> ', response.assets[0].uri);
        console.log('width -> ', response.assets[0].width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName);

        if(type_presensi == 'checkin'){
          checkin(response);
        }else{
          checkout(response);
        }

      });
    }
  };

    return (
        <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Presensi Online
      </Text>
      <View style={styles.container}>
        <View marginTop={50}>
          <View alignItems= 'center'>
              <Text style={styles.textInfoHari}  >Sudahkah Anda mengisi Kehadiran untuk hari ini, {this.state.tgl_presensi}</Text>
          </View>
        </View>
        <View margin={10}>
          <View alignItems= 'center'>
              <Text style={styles.textInfoPresensi}  >{this.state.infoCheckin}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={() => captureImage('photo','checkin')}>
            <Text style={styles.textStyle}>
              CHECKIN
            </Text>
          </TouchableOpacity>
        </View>
        <View margin={10}>
          <View alignItems= 'center'>
              <Text style={styles.textInfoPresensi} >{this.state.infoCheckout}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={() => captureImage('photo', 'checkout')}>
            <Text style={styles.textStyle}>
              CHECKOUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    );
  } 
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#C7E3FC',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  textInfoHari: {
    alignItems: 'center',
    padding: 10,
    //marginVertical: 10,
    textAlign: 'center',
    width: 250,
    marginBottom:20
  },
  textInfoPresensi: {
    alignItems: 'center',
    backgroundColor: '#7AD695',
    padding: 10,
    //marginVertical: 10,
    textAlign: 'center',
    width: 250,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#2A99F9',
    padding: 1,
    fontSize: 12,
    //marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});

export default HomePage;