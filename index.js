import {App} from "./src/App";
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
// import YaMap from 'react-native-yamap';

// todo - KeyGen
// YaMap.init('API_KEY');
AppRegistry.registerComponent(appName, () => App);
