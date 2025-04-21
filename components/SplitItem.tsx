import { View, Text, TouchableNativeFeedback, Modal, ImageBackground } from "react-native"
import { useState } from "react"
import { Entypo } from "@expo/vector-icons"
import { TextInput } from "react-native-paper"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';

type SplitItemType = {
    id: string,
    username: string,
    amount: number,
    userIsBorrower: boolean,
    email: string,
    onPaymentSuccess?: () => void
}

const SplitItem = (item: SplitItemType) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [payAmount, setPayAmount] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useUser()
    const userEmail = user?.emailAddresses[0].emailAddress

    const handleAmountChange = (amt: string) => {
        // Remove any non-numeric characters except decimal point
        const numericValue = amt.replace(/[^0-9.]/g, '');
        
        // Check if the amount is valid
        if (numericValue === '') {
            setPayAmount('');
            setError('');
            return;
        }

        const amount = parseFloat(numericValue);
        if (isNaN(amount)) {
            setPayAmount(numericValue);
            setError('');
            return;
        }

        if (amount > item.amount) {
            setError('Amount cannot exceed outstanding amount');
            setPayAmount(numericValue);
        } else {
            setError('');
            setPayAmount(numericValue);
        }
    }

    const handlePayPress = () => {
        setIsModalOpen(true)
        setPayAmount('')
        setError('')
    }

    const handleSettle = async () => {
        if (!payAmount || error || parseFloat(payAmount) <= 0) return;

        try {
            setIsLoading(true);
            const poolId = await AsyncStorage.getItem('currentPoolId');
            if (!poolId) {
                throw new Error('No pool selected');
            }

            // When paying back, the current user is the borrower and the item.email is the lender
            const paymentData = {
                pool_id: parseInt(poolId),
                borrower_email: userEmail,
                lender_email: item.email,
                amount: parseFloat(payAmount)
            };

            console.log('Making payment with:', paymentData);

            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/split/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message;
                } catch (e) {
                    errorMessage = responseText || 'Failed to process payment';
                }
                throw new Error(errorMessage);
            }

            const result = JSON.parse(responseText);
            setPayAmount('');
            setIsModalOpen(false);
            // Call the refresh callback if provided
            if (item.onPaymentSuccess) {
                item.onPaymentSuccess();
            }
        } catch (err) {
            console.error('Payment error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
        } finally {
            setIsLoading(false);
        }
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
                        <View style={{ paddingTop: 20 }} className="flex flex-row justify-between items-center px-4">
                            <Text style={{ fontFamily: "Montserrat_600SemiBold", color: "white", fontSize: 24 }}>Pay Back</Text>
                            <Entypo name="cross" size={40} color="white" onPress={() => setIsModalOpen(false)} />
                        </View>

                        <View className="flex-1 justify-center items-center px-8">
                            <View className="w-full bg-white/10 rounded-2xl p-6">
                                <Text className="text-white text-center mb-2" style={{ fontFamily: "Montserrat_500Medium", fontSize: 18 }}>
                                    {`You are paying ${item.username}`}
                                </Text>
                                
                                <Text className="text-white/80 text-center mb-6" style={{ fontFamily: "Montserrat_400Regular", fontSize: 16 }}>
                                    {`Outstanding amount: ₹${item.amount.toFixed(2)}`}
                                </Text>
                                
                                <Text className="text-white text-center mb-2" style={{ fontFamily: "Montserrat_500Medium", fontSize: 16 }}>
                                    Enter amount
                                </Text>

                                <TextInput
                                    mode="flat"
                                    textColor="white"
                                    value={payAmount}
                                    onChangeText={handleAmountChange}
                                    keyboardType="numeric"
                                    style={{ 
                                        backgroundColor: "transparent",
                                        textAlign: "center", 
                                        fontSize: 32,
                                        color: "white",
                                        height: 60,
                                        borderBottomWidth: 2,
                                        borderBottomColor: error ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.3)",
                                        marginBottom: 8
                                    }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                />

                                {error && (
                                    <Text className="text-red-400 text-center mb-4" style={{ fontFamily: "Montserrat_400Regular", fontSize: 14 }}>
                                        {error}
                                    </Text>
                                )}

                                <View className="flex flex-row justify-center mt-4">
                                    <TouchableNativeFeedback 
                                        background={TouchableNativeFeedback.Ripple('#FFF', false)} 
                                        onPress={handleSettle}
                                    >
                                        <View className={`border-white border-2 rounded-xl items-center px-8 py-3 ${(!payAmount || error || isLoading) ? 'opacity-50' : ''}`}>
                                            <Text className='text-white text-lg' style={{ fontFamily: "Montserrat_600SemiBold" }}>
                                                {isLoading ? 'Processing...' : 'Settle'}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </Modal>
        </View>
    )
}

export { SplitItemType, SplitItem }