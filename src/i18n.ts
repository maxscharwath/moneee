import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locale/en.json' assert { type: 'json' };
import fr from './locale/fr.json' assert { type: 'json' };

export default i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		fallbackLng: 'en',
		resources: {
			en: {translation: en},
			fr: {translation: fr},
		},
	});
