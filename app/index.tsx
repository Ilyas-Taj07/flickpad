import NoteCard from "@/components/NoteCard";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { getData, storeData } from '../components/db'


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

export default function Home() {

  const router = useRouter()

  const [isActive, setIsActive] = useState(false)
  const [notes, setNotes] = useState<note_card_props[] | void>([])

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        let values = await getData('notes')
        if (values === undefined) {
          setNotes([])
        }
        else {
          setNotes(values)
        }
      }
      fetchData()
    }, [])
  );

  const handleDelete = async (id: number) => {
    // delete logic
    let currentNotes = await getData('notes')
    let newNotes = currentNotes.filter((val: note_card_props) => val._id !== id)
    await storeData(newNotes, 'notes')
    setNotes(newNotes)
  }

  return (
    <View className="bg-[#686497] h-full">
      <StatusBar barStyle={'light-content'} backgroundColor={'#686497'} />
      {/* Heading */}
      <View className="py-10 px-5 flex-row justify-between w-full">
        <Text className="text-4xl font-bold text-[#f9f8ff]">Notes</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" color={"#f9f8ff"} size={30} />
        </TouchableOpacity>
      </View>
      {/* List */}
      {
        notes?.length === 0 ?
          <ScrollView>
            <View className="flex justify-center items-center h-[500px]">
              <Text className="text-2xl text-primary_txt font-bold">No Data</Text>
            </View>
          </ScrollView>
          :
          <ScrollView className="px-5">
            {
              notes?.map((item: note_card_props) => {
                return <NoteCard
                  key={item._id}
                  item={item}
                  handleDelete={handleDelete}
                />
              })
            }
            <View className="h-[50px]"></View>
          </ScrollView>
      }
      <View className="absolute bottom-10 left-1/2 transform -translate-x-1/2 h-16 w-16 flex justify-center items-center">
        <TouchableOpacity onPress={() => setIsActive(!isActive)}>
          <View className="bg-[#65baab] rounded-full shadow-lg flex justify-center items-center h-16 w-16">
            <MaterialIcons color={'#fefefe'} name="add" size={40} />
          </View>
        </TouchableOpacity>
        {
          isActive && (
            <View className="absolute -top-24">
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/note",
                  params: {
                    noteId: '',
                    type: 'note'
                  }
                })
                setIsActive(false)
              }}>
                <Text className="bg-card text-primary_txt w-20 text-center py-2 rounded-lg mb-2">Note</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/note",
                  params: {
                    noteId: '',
                    type: 'list'
                  }
                })
                setIsActive(false)
              }}>
                <Text className="bg-card text-primary_txt w-20 text-center py-2 rounded-lg">List</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    </View >
  );
}