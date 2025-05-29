import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getData, storeData } from '@/components/db'
import Checkbox from 'expo-checkbox'

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

const Settings = () => {

    const router = useRouter()

    const [isSecureNote, setIsSecureNote] = useState(false)

    const [isChangePassword, setIsChangePassword] = useState(false)

    return (
        <View className='bg-primary_bg h-full'>
            {/* Header */}
            <View className='flex flex-row items-center gap-3 w-full'>
                <MaterialIcons name='chevron-left' size={50} color={"#fefefe"} onPress={() => router.back()} />
                <Text className='text-primary_txt text-2xl font-bold'>Settings</Text>
            </View>
            <View className='mt-5'>
                <View className='w-full h-[2px] bg-[#423d66] my-2'></View>
                {/* Option-1: Put password on the Item */}
                <TouchableOpacity onPress={() => setIsSecureNote(true)}>
                    <View className='flex-row gap-3 items-center px-3'>
                        <MaterialIcons name='security' color={"#fefefe"} size={28} />
                        <Text className='text-lg text-primary_txt'>Secure Note</Text>
                    </View>
                </TouchableOpacity>
                {/* Optino-2: Change Password: use modal to change the password by entering the new password */}
                <TouchableOpacity onPress={() => setIsChangePassword(true)}>
                    <View className='flex-row gap-3 items-center px-3 mt-5'>
                        <MaterialIcons name='lock' color={"#fefefe"} size={28} />
                        <Text className='text-lg text-primary_txt'>Change Password</Text>
                    </View>
                </TouchableOpacity>
                <View className='w-full h-[2px] bg-[#423d66] my-2'></View>
            </View>

            {
                isSecureNote && (
                    <Modal
                        animationType='slide'
                        visible={isSecureNote}
                    >
                        <SecureNotes setIsSecureNote={setIsSecureNote} />
                    </Modal>
                )
            }

            {
                isChangePassword && (
                    <Modal
                        animationType='slide'
                        visible={isChangePassword}
                    >
                        <ChangePassword setIsChangePassword={setIsChangePassword} />
                    </Modal>
                )
            }

        </View>
    )
}

export default Settings;


function ChangePassword({ setIsChangePassword }: { setIsChangePassword: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [isPasswordExists, setIsPasswordExists] = useState(true)
    const [password, setPassword] = useState('')
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {

        async function fetch() {
            let data = await getData('password')
            if (data !== undefined) {
                if (!isNaN(parseInt(data))) {
                    // setPassword(data)
                    setIsPasswordExists(false)
                }
            }
        }
        fetch()

    }, [])

    const handleSetPassword = async () => {
        await storeData(password, 'password')
        setIsPasswordExists(false)
        setPassword('')
    }

    const handleCheckPassword = async () => {
        let originalPassword = await getData('password')

        if (originalPassword === password) {
            setIsVerified(true)
            setPassword('')
        }
        else {
            Alert.alert("Nop!")
        }
    }

    if (isPasswordExists) {
        return (
            <View className='justify-center items-center h-full'>
                <View >
                    <Text className='text-lg text-center text-[#222222] font-bold'>No Password found</Text>
                    <Text className='text-center text-sm text-[#222222]'>Set Password</Text>
                </View>
                <View>
                    <TextInput
                        keyboardType='number-pad'
                        placeholder='Enter the Pass Code'
                        secureTextEntry={true}
                        className='w-[200px] text-xl text-center my-4'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Button title={"Set Pass Code"} onPress={handleSetPassword} />
                </View>

                <View className='absolute left-1/2 top-0 transform -translate-x-1/2'>
                    <TouchableOpacity onPress={() => setIsChangePassword(false)}>
                        <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if (!isVerified) {
        return (
            <View className='justify-center items-center h-full'>
                <View >
                    <Text className='text-lg text-center text-[#222222] font-bold'>Please Verify</Text>
                    <Text className='text-center text-sm text-[#222222]'>Pass Code is required</Text>
                </View>
                <View>
                    <TextInput
                        keyboardType='number-pad'
                        placeholder='Enter the Pass Code'
                        secureTextEntry={true}
                        className='w-[200px] text-xl text-center my-4'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Button title={"Check Pass Code"} onPress={handleCheckPassword} />
                </View>

                <View className='absolute left-1/2 top-0 transform -translate-x-1/2'>
                    <TouchableOpacity onPress={() => setIsChangePassword(false)}>
                        <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View className='justify-center items-center h-full'>
            <View>
                <Text className='text-lg text-center text-[#222222] font-bold'>Change Password</Text>
                <Text className='text-center text-sm text-[#222222]'>Choose any number you want</Text>
            </View>
            <View>
                <TextInput
                    keyboardType='number-pad'
                    placeholder='Enter the Pass Code'
                    secureTextEntry={true}
                    className='w-[200px] text-xl text-center my-4'
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title={"Change Pass Code"} onPress={handleSetPassword} />
            </View>

            <View className='absolute left-1/2 top-0 transform -translate-x-1/2'>
                <TouchableOpacity onPress={() => setIsChangePassword(false)}>
                    <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

function SecureNotes({ setIsSecureNote }: { setIsSecureNote: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [notes, setNotes] = useState([])
    const [isPasswordVerified, setIsPasswordVerified] = useState(false)
    const [password, setPassword] = useState('')

    useEffect(() => {

        async function fetch() {
            let data = await getData('notes')
            if (data !== undefined) {
                setNotes(data)
            }
        }
        fetch()

    }, [])

    const handleUpdateSecure = async (id: number, value: boolean) => {

        let data = await getData('notes')
        let newData = data.map((item: note_card_props) => item._id === id ? { ...item, "isSecure": value } : item)
        await storeData(newData, 'notes')

    }

    const handleCheckPassword = async () => {

        let originalPassword = await getData('password')

        if (originalPassword === password) {
            setIsPasswordVerified(true)
        }
        else {
            Alert.alert("Nop!")
        }
    }

    if (!isPasswordVerified) {
        return (
            <View className='justify-center items-center h-full'>
                <View >
                    <Text className='text-lg text-center text-[#222222] font-bold'>Please Verify</Text>
                    <Text className='text-center text-sm text-[#222222]'>Pass Code is required</Text>
                </View>
                <View>
                    <TextInput
                        keyboardType='number-pad'
                        placeholder='Enter the Pass Code'
                        secureTextEntry={true}
                        className='w-[200px] text-xl text-center my-4'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Button title={"Check Pass Code"} onPress={handleCheckPassword} />
                </View>

                <View className='absolute left-1/2 top-0 transform -translate-x-1/2'>
                    <TouchableOpacity onPress={() => setIsSecureNote(false)}>
                        <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View className='bg-[#fefefe] h-full'>
            <View className='justify-center items-center'>
                <TouchableOpacity onPress={() => setIsSecureNote(false)}>
                    <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                </TouchableOpacity>
            </View>

            {/* Show notes list and a button to move it to secure note */}
            <ScrollView>
                <View className='px-3 py-4'>
                    <Text className='text-[#222222] text-2xl font-bold'>All Notes</Text>
                    <Text className='text-[#222222] text-sm'>Please Check the items for making it secure</Text>
                </View>
                {
                    notes.map((item: note_card_props) => {
                        return (
                            <SecureItem item={item} key={item._id} handleUpdateSecure={handleUpdateSecure} />
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

function SecureItem({ item, handleUpdateSecure }: {
    item: note_card_props,
    handleUpdateSecure: (id: number, value: boolean) => void

}) {

    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsChecked(item.isSecure)
    }, [])

    const handleChecked = (checked: boolean) => {
        setIsChecked(checked)
        handleUpdateSecure(item._id, checked)
    }

    return (
        <View className='flex-row gap-3 my-2 px-3 items-center'>
            <Checkbox
                value={isChecked}
                color={'#423d66'}
                onValueChange={handleChecked}
                className='p-3'
            />
            <Text className='text-[#222222] text-lg'>{item.title}</Text>
        </View>
    )
}