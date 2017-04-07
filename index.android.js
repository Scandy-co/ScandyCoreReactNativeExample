/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

import ScandyCoreVisualizer from 'scandy-core-rn';


export default class ReactNativeDemo extends Component {
  componentWillMount() {
    NativeModules.ScandyCore.initialize();

    me = this;
    DeviceEventEmitter.addListener('onVisualizerReady', function(e: Event) {
      me.onVisualizerReady(e);
    });
    DeviceEventEmitter.addListener('onFinishedLoadingMesh', function(e: Event) {
      me.onFinishedLoadingMesh(e);
    });
  }

  onVisualizerReady(e){
    console.log("onVisualizerReady()");
    NativeModules.ScandyCore.loadMeshFromURL("https://s3.amazonaws.com/scandycore-test-assets/scandy-obj.zip");
  }

  onFinishedLoadingMesh(e){
    console.log("onFinishedLoadingMesh()");
  }

  render() {
    return (
      <View style={styles.container}>
        <ScandyCoreVisualizer style={styles.scandycore} >
          <Text style={styles.welcome}>
            scandy-core-rn
          </Text>
          <Text style={styles.instructions}>
            This is embedded in the scandy-core-rn visualizer view
          </Text>
        </ScandyCoreVisualizer>
        <Text style={styles.welcome}>
          ReactNativeDemo
        </Text>
        <Text style={styles.instructions}>
          This is part of the the ReactNativeDemo
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 0,
    margin: 0,
  },
  scandycore: {
    flex: 2,
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  welcome: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    margin: 25,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 25,
  },
});

AppRegistry.registerComponent('ReactNativeDemo', () => ReactNativeDemo);
