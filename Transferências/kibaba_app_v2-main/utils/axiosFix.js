// utils/axiosFix.js
import { Platform } from 'react-native';
import axios from 'axios';

// Fix para o problema de platform no React Native
if (Platform.OS !== 'web') {
  axios.defaults.adapter = require('axios/lib/adapters/http');
}

export default axios;
