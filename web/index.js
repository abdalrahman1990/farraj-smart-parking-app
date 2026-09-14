import './consoleFilter';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';

// Generate required css
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import ioniconsFont from 'react-native-vector-icons/Fonts/Ionicons.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome;
}
@font-face {
  src: url(${ioniconsFont});
  font-family: Ionicons;
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
