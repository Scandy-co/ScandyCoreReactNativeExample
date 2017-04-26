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

import { ScandyCoreVisualizer, ScandyCore } from 'scandy-core-rn';
import * as scandycore_license from '../scandycore_license';

export default class ScannerScreen extends Component {
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
