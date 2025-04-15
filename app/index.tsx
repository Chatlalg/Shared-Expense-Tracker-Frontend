import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { View } from 'react-native'
import Home from '@/pages/Home'

export default function Page() {
  const { user } = useUser()
  return (
    
    <View className='min-h-full'>
      <SignedIn>
        <Home/>
      </SignedIn>
      
      <SignedOut>
        <Redirect href={"/(auth)/sign-in"}/>
      </SignedOut>
    </View>
  )
}