import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ImageBackground } from "react-native";
import { useState } from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons"
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()


  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <ImageBackground source={require("../../assets/images/login-bg3.jpg")} className='h-full flex flex-col justify-between px-10 gap-10 py-20'>
        <Text className='text-white text-4xl' style={{ fontFamily: "Montserrat_700Bold" }} >Welcome{"\n"}Back </Text>

        <View className='gap-6'>
          <TextInput
            className='border-b-2 rounded-3xl text-white border-white w-full px-4'
            cursorColor={"white"}
            style={{ fontFamily: "Montserrat_400Regular" }}
            placeholderTextColor="white"
            value={emailAddress}
            placeholder="Email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <View className='border-b-2 rounded-3xl border-white w-full px-4 flex-row items-center justify-between'>
            <TextInput
              className='text-white'
              cursorColor={"white"}
              value={password}
              placeholder="Password"
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
          <TouchableOpacity onPress={onSignInPress} className='px-20 mt-6'>
            <View className='border-2 border-white rounded-xl p-3 shadow-2xl shadow-white bg-gray-950 opacity-80'>
              <Text className='text-white text-center' style={{ fontFamily: "Montserrat_500Medium" }}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='flex flex-row justify-center'>
          <Text className='text-white opacity-60' style={{ fontFamily: "Montserrat_500Medium" }}>Don't have an account?</Text>
          <Link href="/sign-up">
              <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold" }}> Sign up</Text>
            </Link>
        </View>
      </ImageBackground>
    </View>
  )
}