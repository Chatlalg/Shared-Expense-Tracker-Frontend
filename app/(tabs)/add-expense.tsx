import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Member = {
    email: string;
    username: string;
};

type SelectedMembers = {
    [key: string]: boolean;
};

type CustomAmounts = {
    [key: string]: string;
};

type RequestPayload = {
    lender_email: string | undefined;
    pool_id: string | undefined;
    description: string;
    splitType: 'equal' | 'unequal';
    amount?: number;
    participants?: string[];
    participantAmounts?: Array<{email: string; amount: number}>;
};

type ParticipantAmount = {
    email: string;
    amount: number;
};

const AddExpense = () => {
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal'); 
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<SelectedMembers>({});
    const [customAmounts, setCustomAmounts] = useState<CustomAmounts>({});
    const [totalUnequalAmount, setTotalUnequalAmount] = useState<string>('0.00');
    const [loading, setLoading] = useState<boolean>(true);
    const [lenderEmail, setLenderEmail] = useState<string | undefined>();
    const [pool_id, setPoolId] = useState<string | undefined>();
    const {user} = useUser();
    
    useEffect(() => {
        fetchUserAndMembers();
    }, []);
    
    const fetchUserAndMembers = async () => {
        try {
            const storedPoolId = await AsyncStorage.getItem('currentPoolId');
            if (!storedPoolId) {
                return;
            }
            setPoolId(storedPoolId);
            console.log("Pool ID:", storedPoolId);
            setLoading(true);
            const email = user?.emailAddresses[0].emailAddress;
            setLenderEmail(email);
            
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/group/getallmembers`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    pool_id: storedPoolId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            setMembers(data);

            const initialSelectedState: SelectedMembers = {};
            const initialAmountState: CustomAmounts = {};

            data.forEach((member: Member) => {
                initialSelectedState[member.email] = false;
                initialAmountState[member.email] = '0.00';
            });

            setSelectedMembers(initialSelectedState);
            setCustomAmounts(initialAmountState);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (splitType === 'unequal') {
            const total = Object.values(customAmounts).reduce((sum: number, value: string) => {
                return sum + (parseFloat(value) || 0);
            }, 0);
            setTotalUnequalAmount(total.toFixed(2));
        }
    }, [customAmounts, splitType]);

    const toggleMember = (memberEmail: string) => {
        setSelectedMembers(prev => ({
            ...prev,
            [memberEmail]: !prev[memberEmail]
        }));
    };

    const updateCustomAmount = (memberEmail: string, value: string) => {
        setCustomAmounts(prev => ({
            ...prev,
            [memberEmail]: value
        }));
    };

    const addExpense = async () => {
        try {
            if (!description.trim()) {
                return;
            }

            if (splitType === 'equal' && (!amount || parseFloat(amount) <= 0)) {
                return;
            }

            if (splitType === 'unequal' && parseFloat(totalUnequalAmount) <= 0) {
                return;
            }

            if (splitType === 'equal' && !Object.values(selectedMembers).some(selected => selected)) {
                return;
            }

            setLoading(true);

            let requestPayload: RequestPayload = {
                lender_email: lenderEmail,
                pool_id: pool_id,
                description: description,
                splitType: splitType
            };

            if (splitType === 'equal') {
                const participants = Object.keys(selectedMembers).filter(member => selectedMembers[member]);
                requestPayload = {
                    ...requestPayload,
                    amount: parseFloat(amount),
                    participants: participants
                };
            } else {
                const participantAmounts: ParticipantAmount[] = [];

                Object.keys(customAmounts).forEach(email => {
                    const amt = parseFloat(customAmounts[email]);
                    if (amt > 0) {
                        participantAmounts.push({
                            email,
                            amount: amt
                        });
                    }
                });

                requestPayload = {
                    ...requestPayload,
                    amount: parseFloat(totalUnequalAmount),
                    participantAmounts: participantAmounts
                };
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/expense/addexpense`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add expense');
            }

            setAmount('');
            setDescription('');
            setSelectedMembers(prev => {
                const reset: SelectedMembers = {};
                Object.keys(prev).forEach(key => {
                    reset[key] = false;
                });
                return reset;
            });
            setCustomAmounts(prev => {
                const reset: CustomAmounts = {};
                Object.keys(prev).forEach(key => {
                    reset[key] = '0.00';
                });
                return reset;
            });
        } catch (error) {
            console.error("Failed to add expense:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSplitType = () => {
        setSplitType(splitType === 'equal' ? 'unequal' : 'equal');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/home-bg.png")}
                style={styles.background}
            >
                <View style={styles.pageContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.formContainer}>
                            {/* Equal Split View */}
                            {splitType === 'equal' && (
                                <>
                                    <Text style={styles.label}>Amount</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={amount}
                                        onChangeText={setAmount}
                                        keyboardType="numeric"
                                        placeholder="Enter amount"
                                        placeholderTextColor="#888"
                                    />

                                    <Text style={styles.label}>Description</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Enter description"
                                        placeholderTextColor="#888"
                                    />

                                    <View style={styles.splitToggleContainer}>
                                        <Text style={styles.label}>Split</Text>
                                        <TouchableOpacity
                                            style={styles.splitToggleButton}
                                            onPress={toggleSplitType}
                                        >
                                            <Text style={styles.splitToggleText}>Equally</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.label}>Choose members</Text>
                                    <View style={styles.membersContainer}>
                                        {members.map(member => (
                                            <View key={member.email} style={styles.memberRow}>
                                                <Text style={styles.memberName}>{member.username}</Text>
                                                <TouchableOpacity
                                                    style={styles.checkbox}
                                                    onPress={() => toggleMember(member.email)}
                                                >
                                                    {selectedMembers[member.email] && <View style={styles.checkedBox} />}
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Unequal Split View */}
                            {splitType === 'unequal' && (
                                <>
                                    <Text style={styles.label}>Total Amount</Text>
                                    <View style={styles.calculatedAmountContainer}>
                                        <Text style={styles.calculatedAmount}>{totalUnequalAmount}</Text>
                                    </View>

                                    <Text style={styles.label}>Description</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Enter description"
                                        placeholderTextColor="#888"
                                    />

                                    <View style={styles.splitToggleContainer}>
                                        <Text style={styles.label}>Split</Text>
                                        <TouchableOpacity
                                            style={styles.splitToggleButton}
                                            onPress={toggleSplitType}
                                        >
                                            <Text style={styles.splitToggleText}>Unequally</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.label}>Enter individual amounts</Text>
                                    <View style={styles.membersContainer}>
                                        {members.map(member => (
                                            <View key={member.email} style={styles.memberRowUnequal}>
                                                <Text style={styles.memberName}>{member.username}</Text>
                                                <TextInput
                                                    style={styles.amountInput}
                                                    value={customAmounts[member.email]}
                                                    onChangeText={(value) => updateCustomAmount(member.email, value)}
                                                    keyboardType="numeric"
                                                    placeholder="0.00"
                                                    placeholderTextColor="#888"
                                                />
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>

                    {/* Add button fixed at bottom */}
                    <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addExpense}
                            disabled={loading}
                        >
                            <Text style={styles.addButtonText}>
                                {loading ? 'Adding...' : 'Add Expense'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    pageContainer: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    formContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        alignSelf: 'center',
    },
    label: {
        color: '#FF6B6B',
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: 'transparent',
        color: 'white',
        padding: 10,
        marginBottom: 15,
        height: 45,
    },
    calculatedAmountContainer: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    calculatedAmount: {
        color: 'white',
        fontSize: 16,
    },
    splitToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    splitToggleButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    splitToggleText: {
        color: 'white',
        fontSize: 16,
    },
    membersContainer: {
        marginBottom: 15,
    },
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    memberRowUnequal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    memberName: {
        color: 'white',
        fontSize: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
    },
    amountInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: 'white',
        width: 80,
        textAlign: 'right',
        paddingVertical: 5,
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
    }
});

export default AddExpense;