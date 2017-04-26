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
import * as scandycore_license from './scandycore_license';


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

class ScannerScreen extends Component {
  static navigationOptions = {
    title: 'Scanner',
  };

  state = {
    message: "Initializing...",
    ready: false,
    initialized: false,
    previewing: false,
    scanning: false,
    scanner: "/storage/emulated/0/Download/recording.rrf"
  }

  visualizer_ready = (res) => {
    this.listener.remove();
    if( res.success ){
      ScandyCore.hasUSBScanner().then(
        () => {
          this.setState({scanner: ""});
        }
        , () => {
          this.setState({scanner: "/storage/emulated/0/Download/recording.rrf"});
        }
      );
      ScandyCore.setLicense(scandycore_license.license).then(
        () => {
          ScandyCore.initializeScanner(this.state.scanner)
          .then(
            () => {
              this.setState({initialized:true});
              console.log('finished Initialize!');
            }
          , () => {
              this.setState({initialized:false});
              console.log('failed to Initialize');
              this.setState({
                ready: false,
                initialized: false,
                message: 'failed to Initialize'
              });
          });
        }
        ,() => {
          this.setState({
            ready: false,
            initialized: false,
            message: 'failed to set license'
          });
          console.log('failed to set license');
        }
      );
    }
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('onVisualizerReady', this.visualizer_ready);
  }

  componentWillUnmount() {
    this.kill();
  }

  kill = () => {
    ScandyCore.quit();
  }

  renderVisualizer() {
    if (this.props.navigation.state.routeName === 'Scanner') {
      return (
        <ScandyCoreVisualizer style={{
          backgroundColor: 'transparent',
          height: Dimensions.get('window').height/2,
          width: Dimensions.get('window').width
        }}/>
      )
    } else {
      null
    }
  }

  togglePreview = () => {
    if( this.state.initialized ) {
      ScandyCore.startPreview().then(
        () => {
          this.setState({previewing: true});
        }
        , () => {
          this.setState({previewing: false});
        }
      )
    }
  }

  toggleScan = () => {
    if( this.state.initialized && this.state.previewing ) {
      if( this.state.scanning ){
        ScandyCore.stopScanning().then(
          () => {
            this.setState({
              scanning: false,
              previewing: false
            });
          }
          , () => {
            this.setState({
              scanning: false,
              previewing: false
            });
          }
        )
      } else {
        ScandyCore.startScanning().then(
          () => {
            this.setState({scanning: true});
          }
          , () => {
            this.setState({scanning: false});
          }
        )
      }
    }
  }

  renderControls() {
    if( this.state.initialized ) {
      if( !this.state.previewing ){
        return (
            <Button onPress={this.togglePreview} title="Start Preview"/>
        )
      }
      if( this.state.initialized && this.state.previewing){
        if( this.state.scanning ){
          return (
            <Button onPress={this.toggleScan} title="Stop Scan"/>
          )
        } else {
          return (
            <Button onPress={this.toggleScan} title="Start Scan"/>
          )
        }
      }
    } else {
      return (
        <Text
          style={{textAlign: 'center', fontSize:24}}
          >
          { this.state.message }
        </Text>
      )
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    console.log("props", this.props);
    return (
      <View>
        <Button onPress={this.kill} title="Go Back"/>
        {this.renderVisualizer()}
        {this.renderControls()}
      </View>
    );
  }
}

const ScandyCoreReactNativeExample = StackNavigator({
  Home: {screen: HomeScreen},
  Selection: {screen: SelectionScreen},
  Viewer: {screen: ViewerScreen},
  Scanner: {screen: ScannerScreen}
})

export default () => {
  return AppRegistry.registerComponent('ScandyCoreReactNativeExample', () => ScandyCoreReactNativeExample);
};
