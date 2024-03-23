import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
    en: en,
    ru: ru
};

i18n.use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'ru',// default language to use.
    });
