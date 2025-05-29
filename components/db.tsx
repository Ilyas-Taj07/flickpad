
import AsyncStorage from '@react-native-async-storage/async-storage';

interface items_list_props {
    _id: number,
    item: string,
    isActive: boolean
}

interface note_card_props {
    _id: number,
    title?: string,
    itemList?: items_list_props[],
    text: string,
    type: string,
    lastUpdated: string,
    addedDate: string,
    color: string,
    isSecure: boolean
}


export const storeData = async (value: any, key: string) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Saving error:', e);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (e) {
        console.error('Reading error:', e);
    }
}

export function randomColor() {
    let colors = ["#f3edd5", "#d7889b", '#9184e0', "#65baab"]

    let randomNumber = Math.floor(Math.random() * colors.length)

    return colors[randomNumber]

}