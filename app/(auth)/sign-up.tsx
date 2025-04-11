import { useState } from 'react'
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRef } from 'react'
import OTPTextView from 'react-native-otp-textinput';
import axios from "axios"

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false)


  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password, username)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        username
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const [code, setCode] = useState('')
  const input = useRef<OTPTextView>(null);
  const onVerifyPress = async () => {
    if (!isLoaded) return
    console.log(code)
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        
        try {
          await setActive({ session: signUpAttempt.createdSessionId })
          const response = await axios.post(`${process.env.SERVER_URL}/register`,
            {
              email: emailAddress
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              withCredentials: true
            })
            console.log(response)
            router.replace('/')
        } catch (err) {
          console.log(err)
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View>
        <ImageBackground source={require("../../assets/images/login-bg3.jpg")} className='h-full py-10 px-10 justify-between '>
          <View className='gap-10'>
            <Text className='text-white text-3xl text-center' style={{ fontFamily: "Montserrat_700Bold" }}>Verify your email</Text>
            <OTPTextView
              ref={input}
              handleTextChange={setCode}
              inputCount={6}
              textInputStyle={{
                justifyContent: "center",
                borderWidth: 4,
                borderRadius: 10,
                paddingTop: 0,
                color: "#48CAE4"
              }}
              offTintColor={"#faf9f9"}
              tintColor={"#48CAE4"}
              keyboardType='numeric'
            />
          </View>
          <TouchableOpacity onPress={onVerifyPress} className='mt-6'>
            <View className='border-2 border-white rounded-xl p-3 shadow-2xl shadow-white bg-gray-950 opacity-80'>
              <Text className='text-white text-center' style={{ fontFamily: "Montserrat_500Medium" }}>Submit</Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View>
      <ImageBackground source={require("../../assets/images/login-bg3.jpg")} className='h-full flex flex-col justify-between px-10 gap-10 py-20'>
        <Text className='text-white text-4xl' style={{ fontFamily: "Montserrat_700Bold" }} >Create{"\n"}Account </Text>

        <View className='gap-6'>
          <TextInput
            className='border-b-2 rounded-3xl text-white border-white w-full px-4'
            cursorColor={"white"}
            style={{ fontFamily: "Montserrat_400Regular" }}
            placeholderTextColor="white"
            autoCapitalize='words'
            value={username}
            placeholder='Username'
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput
            className='border-b-2 rounded-3xl text-white border-white w-full px-4'
            cursorColor={"white"}
            style={{ fontFamily: "Montserrat_400Regular" }}
            placeholderTextColor="white"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            onChangeText={(email) => setEmailAddress(email)}
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
          <TouchableOpacity onPress={onSignUpPress} className='px-20 mt-6'>
            <View className='border-2 border-white rounded-xl p-3 shadow-2xl shadow-white bg-gray-950 opacity-80'>
              <Text className='text-white text-center' style={{ fontFamily: "Montserrat_500Medium" }}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='flex flex-row justify-center'>
          <Text className='text-white opacity-60' style={{ fontFamily: "Montserrat_500Medium" }}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold" }}> Sign in</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  )
}