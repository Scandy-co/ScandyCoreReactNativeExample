/****************************************************************************\
 * Copyright (C) 2017 Scandy
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 *
 \****************************************************************************/

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

export default class SelectionScreen extends Component {
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
