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

import { StackNavigator, NavigationActions } from 'react-navigation';

import {ScannerScreen, HomeScreen, SelectionScreen, ViewerScreen } from "./Screens"

const ScandyCoreReactNativeExample = StackNavigator({
  Home: {screen: HomeScreen},
  Selection: {screen: SelectionScreen},
  Viewer: {screen: ViewerScreen},
  Scanner: {screen: ScannerScreen}
})

export default () => {
  return AppRegistry.registerComponent('ScandyCoreReactNativeExample', () => ScandyCoreReactNativeExample);
};
