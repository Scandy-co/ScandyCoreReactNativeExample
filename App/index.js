/**
 * @flow
 */

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
import { ScandyCoreVisualizer, ScandyCore } from 'scandy-core-rn';


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
      </View>
    );
  }
}

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

class ViewerScreen extends Component {
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


const ScandyCoreReactNativeExample = StackNavigator({
  Home: {screen: HomeScreen},
  Selection: {screen: SelectionScreen},
  Viewer: {screen: ViewerScreen},
})

export default () => {
  return AppRegistry.registerComponent('ScandyCoreReactNativeExample', () => ScandyCoreReactNativeExample);
};
