import { Alert, Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { getData, randomColor, storeData } from '../components/db'
import Checkbox from 'expo-checkbox';


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

const NoteScreen = () => {

    const router = useRouter()
    const { noteId, type } = useLocalSearchParams()

    const numericNoteId = typeof noteId === 'string' ? parseInt(noteId, 10) : NaN

    const [isTitle, setIsTitle] = useState(false)
    const [note, setNote] = useState<any>('')
    const [title, setTitle] = useState<any>('')

    const [isTextUpdated, setIsTestUpdated] = useState(false)

    const [currentNote, setCurrentNote] = useState<any>({
        _id: 0,
        title: '',
        text: '',
        itemList: [],
        type: 'note',
        lastUpdated: '',
        addedDate: '',
        color: ''
    })

    const handleUpdateTitle = async () => {
        try {
            // save title
            let mytitle = String(title)
            let existingData = await getData('notes')
            let newValues = existingData.map((item: note_card_props) => item._id === currentNote._id ? { ...item, "title": mytitle } : item)
            await storeData(newValues, 'notes')
            setIsTitle(false)
            setCurrentNote({ ...currentNote, "title": mytitle })
            Alert.alert("Saved")
        }
        catch (err) {
            console.log('error', err)
        }
    }

    const handleChangeText = async (value: any) => {
        setNote(value)
        let existingData = await getData('notes')
        let newValues = existingData.map((item: note_card_props) => item._id === currentNote._id ? { ...item, 'text': value } : item)
        await storeData(newValues, 'notes')
    }

    const handleUpdateListItemText = async (id: number, value: string) => {

        let newValue = { ...currentNote, "itemList": currentNote?.itemList.map((item: items_list_props) => item._id === id ? { ...item, "item": value } : item) }

        let existingValues = await getData('notes')
        await storeData(existingValues.map((item: note_card_props) => item._id === currentNote?._id ? { ...newValue } : item), 'notes')
        setCurrentNote(newValue)

    }

    const handleUpdateCheck = async (id: number) => {

        let newValue = { ...currentNote, "itemList": currentNote?.itemList.map((item: items_list_props) => item._id === id ? { ...item, "isActive": !item.isActive } : item) }

        let existingValues = await getData('notes')
        await storeData(existingValues.map((item: note_card_props) => item._id === currentNote?._id ? { ...newValue } : item), 'notes')
        setCurrentNote(newValue)
    }

    const handleAddNewItem = async () => {
        let newValue = {
            ...currentNote, "itemList": [...currentNote?.itemList, {
                _id: new Date().getTime(),
                item: "",
                isActive: false
            }]
        }

        let existingValues = await getData('notes')
        await storeData(existingValues.map((item: note_card_props) => item._id === currentNote?._id ? { ...newValue } : item), 'notes')
        setCurrentNote(newValue)
    }

    const handleRemoveItem = async (id: number) => {
        let newValue = {
            ...currentNote, "itemList": currentNote?.itemList.filter((item: items_list_props) => item._id !== id)
        }

        let existingValues = await getData('notes')
        await storeData(existingValues.map((item: note_card_props) => item._id === currentNote?._id ? { ...newValue } : item), 'notes')
        setCurrentNote(newValue)
    }

    useEffect(() => {

        async function fetchData() {
            let data: note_card_props[] = await getData('notes')
            let value: note_card_props | undefined = data?.find(item => item._id === numericNoteId)
            setCurrentNote(value)
            if (value !== undefined) {
                setNote(value?.text)
                setTitle(value?.title)
            }
            else {
                setNote('')
                setTitle('')
            }
        }
        fetchData()

    }, [numericNoteId])

    useEffect(() => {
        async function createNewRecord() {
            setIsTitle(true)
            let existingData = await getData('notes')

            let textValue = {}

            if (type === 'note') {
                textValue = {
                    "text": ""
                }
            }
            else {
                textValue = {
                    "itemList": [
                        {
                            _id: new Date().getTime(),
                            item: "",
                            isActive: false
                        }
                    ]
                }
            }

            // create a new empty records here and add it to the list and set the same into the item variable
            let newRecord = {
                _id: new Date().getTime(),
                title: 'New',
                ...textValue,
                type: type,
                lastUpdated: new Date().toLocaleDateString(),
                addedDate: new Date().toLocaleString('Us-en', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                color: randomColor(),
                isSecure: false
            }

            let newValues;

            if (existingData === undefined) {
                newValues = [newRecord]
            }
            else {
                newValues = [...existingData, newRecord]
            }
            await storeData(newValues, 'notes')
            setCurrentNote(newRecord)
            setNote('')
            setTitle('New')
            setIsTitle(false)
        }
        if (currentNote === undefined) {
            createNewRecord()
        }
    }, [currentNote])

    return (
        <View className='h-full bg-primary_bg'>
            {/* Back button */}
            <View className='flex flex-row items-center gap-6 w-full'>
                <MaterialIcons name='chevron-left' size={50} color={"#fefefe"} onPress={() => router.back()} />
                {
                    currentNote?.title === undefined || isTitle || currentNote?.title === '' ?
                        <View className='flex flex-row flex-1 items-center px-2'>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder='Write title'
                                className='text-[#e7e3ff] pb-5 flex-1 placeholder:text-primary_txt caret-[#fefefe] text-lg'
                            />
                            <Button title='Save' onPress={handleUpdateTitle} />
                        </View>
                        :
                        <Text className='text-primary_txt text-xl font-bold line-clamp-1 flex-1' onLongPress={() => setIsTitle(true)}>{currentNote?.title}</Text>
                }
            </View>

            {type === 'note' ?
                <View className='px-4 py-2'>
                    <TextInput
                        value={note}
                        className='px-2 my-2 text-[#e7e3ff] placeholder:text-primary_txt h-full align-top pb-24 caret-[#fefefe]'
                        style={{ lineHeight: 25 }}
                        multiline
                        placeholder='Write something here'
                        onChangeText={handleChangeText}
                    />
                </View>
                :
                <ScrollView>
                    <View className='px-8 py-10'>
                        {
                            currentNote?.itemList.length !== 0 && currentNote?.itemList.filter((item: items_list_props) => !item.isActive).map((item: items_list_props) => {
                                return <ListItem
                                    key={item._id}
                                    id={item._id}
                                    listItem={item.item}
                                    isActive={item.isActive}
                                    handleUpdate={handleUpdateListItemText}
                                    handleUpdateCheck={handleUpdateCheck}
                                    handleRemoveItem={handleRemoveItem}
                                />
                            })
                        }
                        <TouchableOpacity onPress={handleAddNewItem}>
                            <View className='flex-row w-32 items-center gap-3 ml-8'>
                                <MaterialIcons name='add' color={"#fefefe"} size={28} />
                                <Text className='text-primary_txt text-lg'>List item</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            currentNote?.itemList.filter((item: items_list_props) => item.isActive).length !== 0 && (
                                <Text className='text-primary_txt text-lg ml-4 mt-8 mb-5'>Checked Items</Text>
                            )
                        }
                        {
                            currentNote?.itemList.length !== 0 && currentNote?.itemList.filter((item: items_list_props) => item.isActive).map((item: items_list_props) => {
                                return <ListItem
                                    key={item._id}
                                    id={item._id}
                                    listItem={item.item}
                                    isActive={item.isActive}
                                    handleUpdate={handleUpdateListItemText}
                                    handleUpdateCheck={handleUpdateCheck}
                                    handleRemoveItem={handleRemoveItem}
                                />
                            })
                        }
                    </View>
                </ScrollView>
            }
        </View>
    )
}

export default NoteScreen;

interface listItem_props {
    id: number,
    listItem: string,
    isActive: boolean,
    handleUpdate: (id: number, value: string) => void,
    handleUpdateCheck: (id: number) => void,
    handleRemoveItem: (id: number) => void
}

function ListItem({
    id,
    listItem,
    isActive,
    handleUpdate,
    handleUpdateCheck,
    handleRemoveItem
}: listItem_props) {

    const [text, setText] = useState('')
    const [isactive, setisactive] = useState(false)

    useEffect(() => {
        setisactive(isActive)
        setText(listItem)
    }, [isActive])


    const handleCheck = (checked: boolean) => {
        // fire a function which will update the isActive and put this list item into the checked list
        setisactive(checked)
        handleUpdateCheck(id)
    }

    const handleUpdateText = (value: string) => {
        setText(value)
        handleUpdate(id, value)
    }

    return (
        <View className='flex-row items-center mb-2'>
            <Checkbox
                value={isactive}
                color={'#423d66'}
                onValueChange={handleCheck}
                className='p-3'
            />
            {
                isactive ?
                    <Text className='flex-1 pl-4 text-[#dcd6fc] text-xl line-through'>{text}</Text>
                    :
                    <TextInput
                        multiline={true}
                        value={text}
                        onChangeText={handleUpdateText}
                        className='flex-1 pl-4 text-primary_txt caret-[#fefefe] text-xl'
                        maxLength={40}
                    />
            }
            <TouchableOpacity onPress={() => handleRemoveItem(id)}>
                <MaterialIcons name='close' color={"#fefefe"} size={24} />
            </TouchableOpacity>
        </View>
    )

}