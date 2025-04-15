import { router } from 'expo-router'
import { View, Text, TouchableNativeFeedback } from 'react-native'

interface GroupOperationProps {
    button_name: string,
    path: string
}

const GroupOperation = ({ button_name, path }: GroupOperationProps) => {
    return (
        <TouchableNativeFeedback onPress={() => router.push(`./${path}`)}>
            <View className=' bg-white flex-1 justify-center rounded-xl min-w-48 px-7 py-16'>
                <Text className='text-center text-xl' style={{ fontFamily: "Montserrat_600SemiBold" }}>{button_name}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

export { GroupOperation }