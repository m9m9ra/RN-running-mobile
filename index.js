import {App} from "./src/App";
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import './src/i18n';
import YaMap from 'react-native-yamap';

// todo - KeyGen
YaMap.init(process.env.YA_MAP_KEY);
AppRegistry.registerComponent(appName, () => App);
