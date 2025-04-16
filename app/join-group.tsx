import { View, Text, ImageBackground, TextInput, TouchableNativeFeedback } from 'react-native'
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const JoinGroup = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [groupId, setgroupId] = useState<string>('')
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <View>
      <ImageBackground source={require("../assets/images/home-bg.png")} className='h-full'>
        <View className='flex flex-row' style={{ gap: 85, margin: 10 }}>
          <View className='justify-center'>
            <Entypo name="cross" size={40} color="white" onPress={() => router.dismiss()} />
          </View>
          <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 22, textAlignVertical: "center" }}>Join Group</Text>
        </View>

        <View style={{ gap: 10, marginTop:10, paddingHorizontal:20 }}>
          <View>
            <Text className='text-white' style={{ fontFamily: "Montserrat_400Regular" }}>Group id:</Text>
            <View className='border-2 rounded-3xl border-white w-full px-4 flex-row items-center justify-between'>
              <TextInput
                className='text-white'
                cursorColor={"white"}
                value={groupId}
                placeholder="Enter group id"
                placeholderTextColor="white"
                onChangeText={(name) => setgroupId(name)}
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
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#FFF', false)} onPress={() => console.log("group joined")}>
              <View className='border-white border-2 rounded-xl' style={{ paddingHorizontal: 30, paddingVertical: 10, margin: 20 }}>
                <Text className='text-white'>Join</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

      </ImageBackground>
    </View>
  )
}

export default JoinGroup