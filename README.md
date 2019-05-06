# Scandy Core React Native Setup Guide

### Please Note: These docs currently being updated - the Example code may not be in sync with the more recently updated directions below.

# iOS Instructions

## Getting Started

### Create and setup a [React Native](https://facebook.github.io/react-native/) app 

```
react-native init MyScandyCoreProject
cd MyScandyCoreProject
```

### Add `ScandyCoreLicense.txt` and `ScandyCore.framework` to your `.gitignore`!!!

Navigate to the app's iOS project directory and create a folder titled `Frameworks`, this is where we'll be placing our `ScandyCore.framework`:

```
cd $PATH_TO_PROJ/MyScandyCoreProject/ios/MyScandyCoreProject
mkdir Frameworks
```

After unzipping the `ScandyCore-0.4.1-iOS` archive, copy or move the `ScandyCore.framework` to the newly created `Frameworks` folder:

```
cd Frameworks
cp ~/Downloads/ScandyCore-0.4.1-iOS/ScandyCore.framework ./
```
*The version number will be different, this guide is using v0.4.1*

## Linking the framework
Open `MyScandyCoreProject.xcodeproj` in XCode.

1. In the Project Navigator's **General** tab, press **+** under **Embedded Binaries** and select the `ScandyCore.framework` from the `Frameworks` folder.

2. In the Project Navigator's **Build Settings** tab, use the search bar to find the **Header Search Paths** setting.

3. Press **+** and add the path to the `ScandyCore.framework`'s Header files: `$(PROJECT_DIR)/MyScandyCoreProject/Frameworks/ScandyCore.framework/Headers/`

4. In the Project Navigator's **Build Settings** tab, use the search bar to find the **Enable Bitcode** setting, and set it to **NO**

5. In the Project Navigator's **Build Settings** tab, under **Architectures**, remove all **Valid Architectures** *except* `arm64`


## Adding your Scandy Core license

1. Move the `ScandyCoreLicense.txt` file provided to you when you purchased a license to the iOS project's directory:

```
cd $PATH_TO_PROJ/MyScandyCoreProject/ios/MyScandyCoreProject/
cp ~/Downloads/ScandyCoreLicense.txt 

```

2. In XCode's Project Navigator sidebar, right click on the root of `MyScandyCoreProject` and select **Add Files to MyScandyCoreProject...**. Select the `ScandyCoreLicense.txt` file provided to you when you purchased a license.



3. In the Project Navigator, under the **Build Phases** tab, expand the **Copy Bundle Resources** section.  If the `ScandyCoreLicense.txt` file is not already listed, press **+** and select it.


## Test Scandy Core is linked properly
First, make sure you've selected a valid Development Team in the Project Navigator's **General** tab under the **Signing** section & set the **Deployment Target** to the **12.2**.

Scandy Core **does not** build on a Simulator.  You must use a physical TrueDepth enabled iPhone or iPad.  Once you've selected a physical device target, **Run** your project.

If your project builds and installs on your phone, you successfully linked Scandy Core!

## Interfacing with Scandy Core
You can now start using Scandy Core in your application.  To interface with Scandy Core from javascript you'll need to create a Native Module that exports the Scandy Core methods to React.

The React team docs are a helpful in understanding how to go about writing these "bridging" methods: [Native Modules](https://facebook.github.io/react-native/docs/native-modules-ios)

Create `RCT_EXPORT_METHODS` of the Scandy Core API methods you want exposed to javascript-land.


# Android Instructions

## Setup

#### Step 1 - Extract Scandy Core SDK

This is _an_ example you might need to modify slightly:

```shell
mv ~/Download/ScandyCore-*.zip ./dependencies/
cd ./dependencies/
unzip ScandyCore-*.zip
rm ScandyCore-*.zip
mv ScandyCore-* ScandyCore
```

#### Step 2 - Confirm Gradle Settings

```gradle
// file: android/settings.gradle
...

include ':scandy-core-rn'
project(':scandy-core-rn').projectDir = new File(rootProject.projectDir, '../dependencies/ScandyCore/scandy-core-rn/android')
```

#### Step 3 - Confirm app Gradle Build

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

* Create the file: `App/scandycore_license.js`

```bash
touch ./App/scandycore_license.js
```

* Paste your license from the email in the file like so:

```js
export var license = '{"vendor":"Scandy LLC","license":{"product":"Scandy Core","version":"1.0","expiry":"never","hostid":"any","customer”:”foo@bar.com”,”userdata":"{}","signature":"49EDA410195D11E79D989C63E968CD3E49EDA410195D11E79D989C63E968CD3E49EDA410195D11E79D989C63E968CD3E49EDA410195D11E79D989C63E968CD3E"}}';

```

## Building

If you're unfamiliar with React Native maybe check out [their docs](https://facebook.github.io/react-native/).

```bash
react-native run-android
```

## Notes
- Please report any issues or send patches to get fixes in










