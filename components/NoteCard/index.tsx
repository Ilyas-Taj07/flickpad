import { View, Text, TouchableOpacity, Alert, TextInput, Button, Modal } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { getData } from '../db'

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

interface note_card_prop {
    item: note_card_props,
    handleDelete: (id: number) => void
}

const NoteCard = ({ item, handleDelete }: note_card_prop) => {

    const router = useRouter()
    const [isVerify, setIsVerify] = useState(false)

    const handleDeleteAction = () => {
        Alert.alert(
            "Action Required",
            "Do you want to proceed?",
            [
                {
                    text: "No",
                    onPress: () => console.log("No action needed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => handleDelete(item._id)
                }
            ],
            { cancelable: false }
        );
    }

    const handleVerifyPassword = () => {

        if (item.isSecure) {
            setIsVerify(true)
        }
        else {
            router.push({
                pathname: "/note",
                params: { noteId: item?._id, type: item.type }
            })
        }

    }

    return (
        <TouchableOpacity onPress={handleVerifyPassword}>
            <View className='bg-[#423d66] rounded-xl mb-5 p-2 h-[120px] relative'>
                {/* Heading and time */}
                <View className='absolute left-8 top-4'>
                    <Text className='text-[#f9f8ff] font-bold mb-1 text-lg'>{item?.title}</Text>
                    <Text className='text-[#dcd6fc] text-sm mb-2'>{item?.addedDate}</Text>
                    {
                        !item.isSecure && (
                            <>
                                {
                                    item.type === 'note' ?
                                        <Text className='text-[#dcd6fc] w-[300px] line-clamp-2'>{item?.text}</Text> :
                                        (
                                            item?.itemList?.slice(0, 2).map((val: items_list_props) => {
                                                return <Text className='text-[#dcd6fc] w-[300px] line-clamp-1' key={val._id}>{val.item}</Text>
                                            })
                                        )
                                }
                            </>
                        )
                    }

                </View>
                <TouchableOpacity onPress={handleDeleteAction}>
                    <View className='absolute top-2 right-2'>
                        <MaterialIcons name='delete' size={28} color={'#fefefe'} />
                    </View>
                </TouchableOpacity>
                {
                    item.isSecure && (
                        <View className='absolute bottom-2 right-2'>
                            <MaterialIcons name='lock' color={"#fefefe"} size={20} />
                        </View>
                    )
                }
                <View
                    style={{ backgroundColor: `${item.color}` }}
                    className='w-2 h-3/4 block rounded-lg absolute top-[20%] left-0'></View>

                {
                    isVerify && (
                        <Modal
                            visible={isVerify}
                            animationType='slide'
                        >
                            <Verify setIsVerify={setIsVerify} item={item} />
                        </Modal>
                    )
                }
            </View>
        </TouchableOpacity>
    )
}

export default NoteCard;


function Verify({ setIsVerify, item }: {
    setIsVerify: React.Dispatch<React.SetStateAction<boolean>>,
    item: note_card_props
}) {

    const router = useRouter()

    const [password, setPassword] = useState('')

    const handleCheckPassword = async () => {
        let originalPassword = await getData('password')
        if (originalPassword === password) {
            setIsVerify(false)
            setTimeout(() => {
                router.push({
                    pathname: "/note",
                    params: { noteId: item?._id, type: item.type }
                })
            }, 500)
        }
        else {
            Alert.alert("Nop!")
        }
    }

    return (
        <View className='justify-center items-center h-full'>
            <View >
                <Text className='text-lg text-center text-[#222222] font-bold'>Please Verify</Text>
                <Text className='text-center text-sm text-[#222222]'>Pass Code is required</Text>
            </View>
            <View>
                <TextInput
                    keyboardType='number-pad'
                    placeholder='Enter the Pass Code my-4'
                    secureTextEntry={true}
                    className='w-[200px] text-xl text-center'
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title={"Check Pass Code"} onPress={handleCheckPassword} />
            </View>

            <View className='absolute left-1/2 top-0 transform -translate-x-1/2'>
                <TouchableOpacity onPress={() => setIsVerify(false)}>
                    <MaterialIcons name='keyboard-arrow-down' size={40} color={"#222222"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}