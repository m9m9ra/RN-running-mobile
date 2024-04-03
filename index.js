import {App} from "./src/App";
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { Geocoder } from 'react-native-yamap';
import YaMap from 'react-native-yamap';
import './src/i18n';

// todo - KeyGen
YaMap.init(String(process.env.YA_MAP_KEY));
YaMap.setLocale('en_US');
Geocoder.init(String(process.env.YA_MAP_GEO));
AppRegistry.registerComponent(appName, () => App);
