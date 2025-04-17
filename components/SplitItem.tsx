import { View, Text, TouchableNativeFeedback, Modal, ImageBackground } from "react-native"
import { useState } from "react"
import { Entypo } from "@expo/vector-icons"
import { TextInput } from "react-native-paper"

type SplitItemType = {
    id: string,
    username: string,
    amount: Number,
    userIsBorrower: boolean,
}

const SplitItem = (item: SplitItemType) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [payAmount, setPayAmount] = useState<Number>(0)
    const handlePayPress = () => {
        setIsModalOpen(true)
        console.group("opened")
    }

    return (
        <View>
            <View className='border-white flex flex-row justify-between w-full border-2 rounded-xl' style={{ minHeight: 100, paddingHorizontal: 10, marginVertical: 10 }}>
                <Text style={{ fontFamily: "Montserrat_600SemiBold", color: "white", textAlignVertical: "center" }}>
                    {
                        item.userIsBorrower ?
                            `${item.username} owes you ${item.amount} Rs` :
                            `You owe ${item.username}, ${item.amount} Rs`
                    }
                </Text>
                {
                    !item.userIsBorrower &&
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#FFF', false)} onPress={handlePayPress}>
                        <View className='border-white border-2 rounded-xl justify-center' style={{ paddingHorizontal: 30, paddingVertical: 10, margin: 20 }}>
                            <Text className='text-white'>Pay</Text>
                        </View>
                    </TouchableNativeFeedback>
                }
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={isModalOpen}
            >
                <ImageBackground source={require("../assets/images/home-bg.png")} className='h-full'>
                    <View className="h-full w-full">
                        <View style={{ paddingTop: 20 }} className="flex flex-row">
                            <Text style={{ fontFamily: "Montserrat_600SemiBold", color: "white", textAlignVertical: "center", fontSize: 20, marginLeft: 130, marginRight: 90 }}>Pay Back</Text>
                            <View className='justify-center'>
                                <Entypo name="cross" size={40} color="white" onPress={() => setIsModalOpen(false)} />
                            </View>
                        </View>

                        <View className="rounded-xl border-2 border-red-400 px-10 py-10 flex flex-col w-full gap-10">
                            <Text className="text-red-400 text-center" style={{ fontFamily: "Montserrat_500Medium", fontSize: 18 }}>Enter amount</Text>
                            <TextInput
                                mode="flat"
                                textColor="#f87171"
                                value={`${payAmount}`}
                                onChangeText={(amt) => setPayAmount(new Number(amt))}
                                style={{ backgroundColor: "transparent", borderBottomColor: "#f87171", borderBottomWidth: 5, textAlign: "center", fontSize: 24 }}
                            />

                            <View className="flex flex-row justify-center">
                                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#FFF', false)} onPress={() => {
                                    console.log("paid")
                                    setPayAmount(0)
                                    setIsModalOpen(false)
                                }}>
                                    <View className='border-white border-2 rounded-xl items-center' style={{ width: 100, paddingVertical: 10 }}>
                                        <Text className='text-white'>Settle</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </Modal>
        </View>
    )
}

export { SplitItemType, SplitItem }