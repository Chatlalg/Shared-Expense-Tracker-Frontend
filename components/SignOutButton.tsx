import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity, View } from 'react-native'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View className='flex flex-row justify-end' style={{marginTop:2}}>
      <TouchableOpacity onPress={handleSignOut} >
        <View className='border-2 border-white px-10 rounded-lg'>
          <Text className='text-white text-lg'>Sign out</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}