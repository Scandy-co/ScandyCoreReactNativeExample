# ScandyCoreReactNativeExample

This is a React Native example using Scandy Core (scandy-core-rn)

## Setup

#### Step 1 - NPM Install

```shell
npm link dependencies/ScandyCore/scandy-core-rn
```
#### Step 2 - Update Gradle Settings

```gradle
// file: android/settings.gradle
...

include ':scandy-core-rn'
project(':scandy-core-rn').projectDir = new File(rootProject.projectDir, '../node_modules/scandy-core-rn/android')
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

#### Step 5 - Set license

* Create the file: `android/app/src/main/assets/scandycore_license.json`
* Paste your license from the email in `android/app/src/main/assets/scandycore_license.json`

#### Step 6 - Require and use in Javascript

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

## Building

If you're unfamiliar with React Native maybe check out [their docs](https://facebook.github.io/react-native/).

```bash
react-native run-android
```

## Notes
- Please report any issues or send patches to get fixes in
