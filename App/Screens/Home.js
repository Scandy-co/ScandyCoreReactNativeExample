import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  DeviceEventEmitter,
  Linking,
} from 'react-native';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  componentDidMount() {
    Linking.getInitialURL()
      .then(url => {
        this._handleDeeplink(url)
      })
      .catch(err => {
        debugger
        console.warn('Deeplinking error', err)
      })
    Linking.addListener('url', e => {
      this._handleDeeplink(e.url)
    })
  }

  _handleDeeplink(url) {
    const { navigate } = this.props.navigation;
    if (url) {
      navigate('Viewer', {url: url})
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Scandy Core SDK React Native Example</Text>
        <Button
          onPress={() => navigate('Selection')}
          title="Select Mesh"
        />
      <Button
        onPress={() => navigate('Scanner')}
        title="Initialize Scan Mode"
      />
      </View>
    );
  }
}
