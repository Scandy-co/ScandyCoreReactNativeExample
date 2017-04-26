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

class SelectionScreen extends Component {
  static navigationOptions = {
    title: 'Select Mesh',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Files to select from go here.</Text>
        <Button
          onPress={() => navigate('Viewer', { url: 'https://s3.amazonaws.com/scandycore-test-assets/scandy-obj.zip'})}
          title="View OBJ.zip"
        />
        <Button
          onPress={() => navigate('Viewer', { url: 'https://s3.amazonaws.com/scandycore-test-assets/scandy-ply.zip'})}
          title="View PLY.zip"
        />
        <Button
          onPress={() => navigate('Viewer', { url: 'https://s3.amazonaws.com/scandycore-test-assets/scandy.ply'})}
          title="View PLY"
        />
      </View>
    );
  }
}
