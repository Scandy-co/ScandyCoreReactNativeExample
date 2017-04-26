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

import { ScandyCoreVisualizer, ScandyCore } from 'scandy-core-rn';

export default class ViewerScreen extends Component {
  static navigationOptions = {
    title: 'Mesh Viewer',
  };

  state = {
    ready: false,
  }

  finished = (success) => {
    this.listener.remove()
    if (success) {
      console.log('finished loading!')
    } else {
      console.log('failed to load')
    }
  }

  componentDidMount() {
    this.download(this.props.navigation.state.params.url)
  }

  quit = () => {
    console.log("onFinishedQuit")
  }

  download = (url) => {
    this.listener = DeviceEventEmitter.addListener('onFinishedLoadingMesh', this.finished)
    this.listener = DeviceEventEmitter.addListener('onFinishedQuit', this.quit)
    setTimeout(() => {
      ScandyCore.loadMeshFromURL(url)
    }, 2000)
  }

  componentWillUnmount() {
    ScandyCore.quit();
  }

  kill = () => {
    ScandyCore.quit();
  }

  renderVisualizer() {
    if (this.props.navigation.state.routeName === 'Viewer') {
      return (
        <ScandyCoreVisualizer style={{
          backgroundColor: 'transparent',
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width
        }}/>
      )
    } else {
      null
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    console.log("props", this.props);
    return (
      <View>
        <Button onPress={this.kill} title="Go Back"/>
        {this.renderVisualizer()}
      </View>
    );
  }
}
