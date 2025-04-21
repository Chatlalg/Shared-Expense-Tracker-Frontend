import { Modal, View, Text, ImageBackground, FlatList, TouchableNativeFeedback, RefreshControl } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { DataTable } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useFocusEffect } from '@react-navigation/native';

type ExpenseType = {
  username: string,
  email: string,
  expense_id: string,
  amount: number,
  description: string,
  pool_id: string,
  creation_date: string
}

type BorrowerType = {
  username: string,
  share_amount: number
}

const AllExpenses = () => {
  const params = useLocalSearchParams();
  const [totalExpense, setTotalExpense] = useState(0)
  const [isRowModalOpen, setIsRowModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ExpenseType>({
    username: "",
    email: "",
    expense_id: "",
    amount: 0,
    description: "",
    pool_id: "",
    creation_date: ""
  })
  const [allExpenses, setAllExpenses] = useState<ExpenseType[]>()
  const [borrowers, setBorrowers] = useState<BorrowerType[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchAllExpenses = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/expense/fetchall`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pool_id: params.pool_id
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} in fetching all expenses`);
      const json = await res.json() as Array<ExpenseType>;
      const formatted_data = json.map(expense => ({
        ...expense,
        creation_date : expense.creation_date.slice(0,10),
      }))
      setAllExpenses(formatted_data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTotalExpense = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/expense/totalexpense`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pool_id: params.pool_id
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} in fetching total expense`)
      const json = await res.json()
      setTotalExpense(json?.total_expense || 0)
    } catch (error) {
      console.log(error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAllExpenses(), fetchTotalExpense()]);
    setRefreshing(false);
  };

  // Use useFocusEffect to refresh data when tab is focused
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const fetchBorrowers = async (expense_id: string) => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/expense/borrowers`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expense_id: expense_id
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} in fetching borrowers`)
      const json = await res.json()
      setBorrowers(json)
    } catch (error) {
      console.log(error)
    }
  }

  function handleRowPress(item: ExpenseType) {
    console.log(item)
    setModalData(item)
    fetchBorrowers(item.expense_id)
    setIsRowModalOpen(true)
  }

  return (
    <View>
      <ImageBackground source={require("../../assets/images/home-bg.png")} className='h-full py-10'>
        <Text className='text-3xl text-center' style={{ fontFamily: "Montserrat_600SemiBold", color: "white" }}>Total Expense: {`${totalExpense}`}</Text>

        <View>
          <DataTable>
            <DataTable.Header style={{}}>
              <DataTable.Title textStyle={{ color: "white", fontFamily: "Montserrat_600SemiBold" }} style={{ marginRight: 10 }}>Lender</DataTable.Title>
              <DataTable.Title textStyle={{ color: "white", fontFamily: "Montserrat_600SemiBold" }} style={{ minWidth: 90 }}>Expense</DataTable.Title>
              <DataTable.Title textStyle={{ color: "white", fontFamily: "Montserrat_600SemiBold" }} >Amt</DataTable.Title>
              <DataTable.Title textStyle={{ color: "white", fontFamily: "Montserrat_600SemiBold" }} style={{ marginLeft: 10 }}>Date</DataTable.Title>
            </DataTable.Header>
            <FlatList
              style={{ height: "92.5%" }}
              data={allExpenses}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                />
              }
              renderItem={({ item }) => (
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#fff", false)} onPress={handleRowPress.bind(null, item)}>
                  <View>
                    <DataTable.Row>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ marginRight: 10 }}>{item.username}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ minWidth: 90 }}>{item.description}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} >{item.amount}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ marginLeft: 10 }}>{item.creation_date}</DataTable.Cell>
                    </DataTable.Row>
                  </View>
                </TouchableNativeFeedback>
              )}
            />
          </DataTable>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isRowModalOpen}
          >
            <View className='h-full w-full px-10 justify-center'>
              <View style={{ backgroundColor: "black" }} className='rounded-xl border-2 border-white'>
                <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                  <View className='justify-center'>
                    <Entypo name="cross" size={40} color="white" onPress={() => setIsRowModalOpen(false)} />
                  </View>
                </View>
                <View className='border-2 items-center' style={{ gap: 10, paddingVertical: 10 }}>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Lender: {`${modalData.username}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Expense Description: {`${modalData.description}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Amount: {`${modalData.amount}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Date: {`${modalData.creation_date}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Borrowers:</Text>
                  {borrowers.map((borrower, index) => (
                    <Text key={index} style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>
                      {borrower.username}: ₹{borrower.share_amount}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  )
}

export default AllExpenses