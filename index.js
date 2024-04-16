import {App} from './src/layers/presentation/App';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { Geocoder } from 'react-native-yamap';
import YaMap from 'react-native-yamap';
import './src/i18n';

import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: "https://b75d666c06c5818076e8b36556cf0982@o4507095065100288.ingest.de.sentry.io/4507095067394128",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    _experiments: {
        // profilesSampleRate is relative to tracesSampleRate.
        // Here, we'll capture profiles for 100% of transactions.
        profilesSampleRate: 1.0,
    },
});

// todo - KeyGen
YaMap.init(String(process.env.YA_MAP_KEY))
    .then(() => {
        YaMap.setLocale('en_RU').then(() => {})
        Geocoder.init(String(process.env.YA_MAP_GEO));
    });

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));