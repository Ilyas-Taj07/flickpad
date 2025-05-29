background: #686497
text: #f9f8ff
Card: #423d66

Different random colors: #f3edd5, #d7889b, #9184e0, #65baab



npx expo install @react-native-async-storage/async-storage


import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Saving error:', e);
  }
};


import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async () => {
 try {
        const value = await AsyncStorage.getItem('my-key');
        if (value !== null) {
          setMyValue(JSON.parse(value));
        }
      } catch (e) {
        console.error('Reading error:', e);
      }
}

getData();