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
  Picker,
  Dimensions,
  DeviceEventEmitter,
  Linking,
} from 'react-native';

const FileSystem = require('react-native-fs');

const scandy_core_test_files = [
  { title: "Select a file", url:""},
  { title: "View OBJ.zip", url: "https://s3.amazonaws.com/scandycore-test-assets/scandy-obj.zip" },
  { title: "View PLY.zip", url: "https://s3.amazonaws.com/scandycore-test-assets/scandy-ply.zip" },
  { title: "View PLY", url: "https://s3.amazonaws.com/scandycore-test-assets/scandy.ply" },
  { title: "View OBJ", url: "https://s3.amazonaws.com/scandycore-test-assets/scandy.obj" },
]

export default class SelectionScreen extends Component {
  static navigationOptions = {
    title: 'Select Mesh',
  };

  state = {
    files: scandy_core_test_files,
    selected: scandy_core_test_files[0].url
  }

  findPlyInDirectory(dir_path) {
    let _this = this;
    FileSystem.readDir(dir_path)
    .then((result1) => {
      let files = [];
      result1.forEach(function(file) {
        if (file.isDirectory()){
          // Recursion!
          _this.findPlyInDirectory(file.path);
        } else {
          // only grab the files we want by ext
          if (file.path.slice((file.path.lastIndexOf('.') - 1 >>> 0) + 2) === "ply") {
            dir_name = dir_path.split("/");
            dir_name = dir_name[dir_name.length-1];
            files.push({
              title: dir_name+"/"+file.name,
              url: file.path
            });
          }
        }
      });
      return Promise.all(files);
    })
    .then(
      (new_files) => {
        files = _this.state.files
        new_files.forEach((file) => {
          files.push(file)
        });
        _this.setState({files: files});
      }
    )
    ;
  }

  componentDidMount() {
    this.findPlyInDirectory(FileSystem.ExternalStorageDirectoryPath + '/Download')
  }

  renderViewButtons() {
    const { navigate } = this.props.navigation;

    let files = this.state.files.map( (file, i) => {
        return <Picker.Item key={i} value={file.url} label={file.title} />
    });
    return (
      <Picker
        selectedValue={this.state.selected}
        onValueChange={(url) => {
          if( this.state.selected != url )
            navigate('Viewer', { url: url})
          }
        }
        >
        { files }
      </Picker>
    )
  }

  render() {
    return (
      <View>
        <Text>Files to select from go here.</Text>
        {this.renderViewButtons()}
      </View>
    );
  }
}
