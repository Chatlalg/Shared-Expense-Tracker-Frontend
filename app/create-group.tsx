import { View, Text, ImageBackground, TextInput, TouchableNativeFeedback } from 'react-native'
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const CreateGroup = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [groupName, setGroupName] = useState<string>('')
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <View>
      <ImageBackground source={require("../assets/images/home-bg.png")} className='h-full '>
        <View className='flex flex-row' style={{ gap: 70, margin: 10 }}>
          <View className='justify-center'>
            <Entypo name="cross" size={40} color="white" onPress={() => router.dismiss()} />
          </View>
          <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 22, textAlignVertical: "center" }}>Create Group</Text>
        </View>

        <View style={{ gap: 10, marginTop:10, paddingHorizontal:20 }}>
          <View>
            <Text className='text-white' style={{ fontFamily: "Montserrat_400Regular" }}>Group Id:</Text>
            <View className='border-2 rounded-3xl border-white w-full px-4 flex-row items-center justify-between' style={{ paddingVertical: 10, }}>
              <Text className='text-white' style={{ fontFamily: "Montserrat_400Regular" }}>
                69420
              </Text>
            </View>
          </View>

          <View>
            <Text className='text-white' style={{ fontFamily: "Montserrat_400Regular" }}>Group Name:</Text>
            <View className='border-2 rounded-3xl border-white w-full px-4 flex-row items-center justify-between'>
              <TextInput
                className='text-white'
                cursorColor={"white"}
                value={groupName}
                placeholder="Enter group name"
                placeholderTextColor="white"
                onChangeText={(name) => setGroupName(name)}
                style={{ fontFamily: "Montserrat_400Regular" }}
              />
            </View>
          </View>

          <View>
            <Text className='text-white' style={{ fontFamily: "Montserrat_400Regular" }}>Password</Text>
            <View className='border-2 rounded-3xl border-white w-full px-4 flex-row items-center justify-between'>
              <TextInput
                className='text-white'
                cursorColor={"white"}
                value={password}
                placeholder="Enter password"
                placeholderTextColor="white"
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                style={{ fontFamily: "Montserrat_400Regular" }}
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                onPress={toggleShowPassword}
              />
            </View>
          </View>

          <View className='flex flex-row justify-center'>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#FFF', false)} onPress={() => console.log("group created")}>
              <View className='border-white border-2 rounded-xl' style={{ paddingHorizontal: 30, paddingVertical: 10, margin: 20 }}>
                <Text className='text-white'>Create</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

      </ImageBackground>
    </View>
  )
}

export default CreateGroup