
### **Flickpad**

A feature-rich notepad app built with **React Native Expo** that goes beyond just taking notes. Flickpad offers a clean and intuitive interface with the following key features:

- **Text Notes** – Quickly jot down ideas, reminders, or detailed content.
- **Checklist** – Create to-do lists or checkable task lists to stay organized.
- **Spend Sheet** – A simple monthly budget tracker. Set a total budget, add expenses, and track how much you've saved.
- **Note Locking** – Password-protect your notes to keep sensitive information secure.

Security is also a focus: Flickpad allows you to lock notes with a password, ensuring sensitive information stays private.

At its core, **Flickpad** is a powerful notepad app with added tools for productivity and personal finance tracking.











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
