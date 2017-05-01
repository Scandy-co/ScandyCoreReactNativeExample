# ScandyCoreReactNativeExample

This is a React Native example using Scandy Core (scandy-core-rn)

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
