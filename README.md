# ScandyCoreReactNativeExample

**WARNING CURRENTLY DEPRECRATED!**

This is a React Native example using Scandy Core (scandy-core-rn)

## Installation and How to use

#### Step 1 - NPM Install

```shell
npm install --save scandy-core-rn
```
#### Step 2 - Update Gradle Settings

```gradle
// file: android/settings.gradle
...

include ':scandy-core-rn', ':app'
project(':scandy-core-rn').projectDir = new File(rootProject.projectDir, '../libs/scandy-core/android')
```

#### Step 3 - Update app Gradle Build

```gradle
// file: android/app/build.gradle
...

dependencies {
    ...
    compile project(':scandy-core-rn')
}
```

#### Step 4 - Register React Package

```java
// file: android/app/source/main/java/com/{projectName}.MainApplication.java
...
import co.scandy.scandycore.RNScandyCorePackage; // import

public class MainApplication extends Application implements ReactApplication {
...
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNScandyCorePackage()
          , new MainReactPackage()
      );
    }
...

```

#### Step 5 - Require and use in Javascript

```js
// file: index.android.js

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ScandyCoreVisualizer from 'scandy-core';

export default class ReactNativeDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScandyCoreVisualizer.ScandyCoreVisualizerInterface
          style={styles.scandycore}
          >
        </ScandyCoreVisualizer.ScandyCoreVisualizerInterface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scandycore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff0000',
  },
});

AppRegistry.registerComponent('ReactNativeDemo', () => ReactNativeDemo);
```


## Notes
- Please report any issues or send patches to get fixes in
