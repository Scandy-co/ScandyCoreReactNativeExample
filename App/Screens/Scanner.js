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
  Slider,
  TextInput,
  Picker,
  Alert,
  Button,
  Dimensions,
  DeviceEventEmitter,
  Linking,
} from 'react-native';

import { ScandyCoreVisualizer, ScandyCore } from 'scandy-core-rn';
import * as scandycore_license from '../scandycore_license';

const FileSystem = require('react-native-fs');

export default class ScannerScreen extends Component {
  static navigationOptions = {
    title: 'Scanner',
  };

  state = {
    message: "Initializing...",
    scandycore_state_watcher: false,
    scan_state: "",
    ready: false,
    initialized: false,
    previewing: false,
    scanning: false,
    has_scanned: false,
    has_mesh: false,
    use_cases: [],
    scan_size: false,
    resolution: false,
    resolutions: [],
    use_case: "",
    mesh_name: "MESH NAME",
    scanner: "/storage/emulated/0/Download/recording.rrf"
  }

  componentDidMount() {
    this.state.scandycore_state_watcher = setInterval( () => {
      ScandyCore.getScanState().then((res) => {
        this.setState({scan_state: res.scan_state});
      })
    }, 100);
    this.listener = DeviceEventEmitter.addListener('onVisualizerReady', this.visualizer_ready);
  }

  componentWillUnmount() {
    clearInterval(this.state.scandycore_state_watcher);
    this.kill();
  }

  kill = () => {
    ScandyCore.quit();
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
              ScandyCore.getUseCases()
              .then(
                (res) => {
                  this.setState({
                    use_cases:res.use_cases,
                    use_case:res.use_cases[0]
                  });
                  console.log(`got use_cases: ${res.use_cases}`);
                }
              )
              .then(ScandyCore.getAvailableScanResolutions).then( (res) => {
                this.setState({resolutions: res.resolutions})
                console.log(`got resolutions: ${res.resolutions}`);
              })
              .then(this.updateScanSize)
              .then(this.updateResolution);
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
    } else {
      this.setState({message: "failed to create visualizer. Go back and try again"})
    }
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
    this.setState({ has_scanned: false })
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
    // has_mesh should always be reset when toggling a Scan,
    // since whether just starting/stopping generateMesh has not been run on this session.
    this.setState({ has_mesh: false })

    if( this.state.initialized && this.state.previewing ) {
      if( this.state.scanning ){
        ScandyCore.stopScanning().then(
          () => {
            // On success we set scanning and previewing to false
            // and has_scanned to true
            this.setState({
              scanning: false,
              previewing: false,
              has_scanned: true
            });
          }
          , () => {
            // On failure we set scanning, previewing, and has_scanned to false
            this.setState({
              scanning: false,
              previewing: false,
              has_scanned: false
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

  renderScanButton() {
    if( !this.state.previewing ){
      return (
        <Button onPress={this.togglePreview} title="Start Preview"/>
      )
    }
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

  updateScanSize = (size) => {
    if( size == null ){ size = 2.0 }
    ScandyCore.setScanSize(size)
    .then(
      () => {
        console.log("set scan size");
      }
      , () => {
        console.log("failed to set scan size");
      }
    )
    .then( () => {
      ScandyCore.getScanSize()
      .then(
        (res) => {
          this.setState({scan_size: res.size.x })
        }, () => {
          console.log("failed to get scan size");
        }
      )
    })
  }

  updateResolution = (resolution) => {
    if( resolution == null ){ resolution = this.state.resolutions.length/2 }
    ScandyCore.setResolution(resolution)
    .then(
      () => {
        console.log("set scan resolution");
      }
      , () => {
        console.log("failed to set scan resolution");
      }
    )
    .then( () => {
      ScandyCore.getResolution().then( (res) => {
        this.setState({resolution: res.resolution})
      }, () => {
        console.log("failed to get scan resolution");
      })
    })
  }

  renderConfigurationSliders() {
    if( this.state.previewing ) {
      let use_cases = this.state.use_cases.map( (use_case, i) => {
          return <Picker.Item key={i} value={use_case} label={use_case} />
      });
      return (
        <View>
          <Text>Size:  { ( this.state.scan_size != false ? `${this.state.scan_size.toFixed(2)}m` : "-" )}</Text>
          <Slider
            disabled={!this.state.previewing}
            value={3.0}
            step={0.05}
            minimumValue={0.1}
            maximumValue={4.5}
            onSlidingComplete={ this.updateScanSize }
          >
          </Slider>
          <Text>Resolution: { ( this.state.resolution != false ? this.state.resolution.description : "-" )}</Text>
          <Slider
            disabled={!this.state.previewing}
            value={this.state.resolutions.length/2}
            step={1}
            minimumValue={1}
            maximumValue={this.state.resolutions.length}
            onSlidingComplete={this.updateResolution}
          >
          </Slider>
          <Picker
            selectedValue={this.state.use_case}
            onValueChange={
              (use_case) => {
                ScandyCore.setUseCase(use_case);
                this.setState({use_case: use_case});
              }
            }
          >
            {use_cases}
          </Picker>
        </View>
      )
    }
  }

  createMesh = () => {
    ScandyCore.generateMesh().then(
      () => {
        this.setState({has_mesh:true})
      }
      , () => {
        this.setState({has_mesh:false})
      }
    )
  }

  saveMesh = () => {
    function slugify(text) {
      // https://gist.github.com/mathewbyrne/1280286
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
    let mesh_path = FileSystem.ExternalStorageDirectoryPath + '/Download/' + `${slugify(this.state.mesh_name)}.ply`
    ScandyCore.saveMesh(mesh_path).then(
      () => {
        Alert.alert(
          'Saved your mesh!',
          `Your mesh have been saved to: ${mesh_path}`,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        this.setState({has_mesh:false})
      }
      , () => {
        Alert.alert(
          'Failed to save your mesh!',
          `We couldn't save your mesh, sorry.`,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        this.setState({has_mesh:false})
      }
    )
  }

  renderMeshButton() {
    if( this.state.has_mesh ) {
      return(
        <View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({mesh_name: text})}
            value={this.state.mesh_name}
          />
        <Button onPress={this.saveMesh} title="Save Mesh"/>
        </View>
      )
    }
    if( this.state.has_scanned ) {
      return(
        <Button
          onPress={this.createMesh}
          title="Create Mesh"
        />
      )
    }
  }

  renderControls() {
    if( this.state.initialized ) {
      return (
        <View>
          {this.renderScanButton()}
          {this.renderConfigurationSliders()}
          {this.renderMeshButton()}
        </View>
      )
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
    return (
      <View>
        <Button onPress={this.kill} title="Go Back"/>
        <Text>Current scan state: {this.state.scan_state}</Text>
        {this.renderVisualizer()}
        {this.renderControls()}
      </View>
    );
  }
}
