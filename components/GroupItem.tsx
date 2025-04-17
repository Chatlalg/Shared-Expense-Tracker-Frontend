import { View, Text, TouchableNativeFeedback } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

type GroupItemProps = {
    id: string,
    group_name: string,
    members: Number
}



const GroupItem = (props: GroupItemProps) => {
    const router = useRouter();

    const handlePress = () => {
        console.log(props.id)
        router.push("./(tabs)/all-expenses")
    }

    return (
        <TouchableNativeFeedback onPress={handlePress} background={TouchableNativeFeedback.Ripple("#FFF", false)}>
            <View className='flex flex-row rounded-xl justify-between border-white border-2' style={{ padding: 25, marginVertical: 5 }}>
                <Text style={{ fontFamily: "Montserrat_600SemiBold", color: "white", fontSize: 18 }}>{props.group_name}</Text>
                <View className='flex flex-row align-items-center' style={{ gap: 5 }}>
                    <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 20, textAlignVertical: "center" }}>{`${props.members}`}</Text>
                    <View className='flex justify-center'>
                        <FontAwesome6 name="user-group" size={20} color="white" />
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}

export { GroupItem, GroupItemProps }