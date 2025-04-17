import { Modal, View, Text, ImageBackground, FlatList, TouchableNativeFeedback } from 'react-native'
import { useState } from 'react'
import { DataTable } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';

type ExpenseType = {
  id: string,
  lender: string,
  expense: string,
  amount: Number,
  date: string
}

const sample_data = [
  {
    id: "1",
    lender: "Anooska",
    expense: "Dosa",
    amount: 100,
    date: "24/4/25"
  },
  {
    id: "2",
    lender: "Ravi",
    expense: "Pizza",
    amount: 250,
    date: "23/4/25"
  },
  {
    id: "3",
    lender: "Megha",
    expense: "Movie Tickets",
    amount: 600,
    date: "22/4/25"
  },
  {
    id: "4",
    lender: "Karan",
    expense: "Groceries",
    amount: 1200,
    date: "21/4/25"
  },
  {
    id: "5",
    lender: "Sneha",
    expense: "Uber",
    amount: 340,
    date: "20/4/25"
  },
  {
    id: "6",
    lender: "Tanya",
    expense: "Lunch",
    amount: 430,
    date: "19/4/25"
  },
  {
    id: "7",
    lender: "Aman",
    expense: "Snacks",
    amount: 150,
    date: "18/4/25"
  },
  {
    id: "8",
    lender: "Neha",
    expense: "Coffee",
    amount: 90,
    date: "17/4/25"
  },
  {
    id: "9",
    lender: "Ritik",
    expense: "Metro Card",
    amount: 200,
    date: "16/4/25"
  },
  {
    id: "10",
    lender: "Zoya",
    expense: "Dinner",
    amount: 800,
    date: "15/4/25"
  },
  {
    id: "11",
    lender: "Laksh",
    expense: "Milk",
    amount: 60,
    date: "14/4/25"
  },
  {
    id: "12",
    lender: "Priya",
    expense: "Electricity Bill",
    amount: 1500,
    date: "13/4/25"
  },
  {
    id: "13",
    lender: "Manav",
    expense: "WiFi Bill",
    amount: 999,
    date: "12/4/25"
  },
  {
    id: "14",
    lender: "Ishaan",
    expense: "Burger",
    amount: 180,
    date: "11/4/25"
  },
  {
    id: "15",
    lender: "Divya",
    expense: "Stationery",
    amount: 220,
    date: "10/4/25"
  },
  {
    id: "16",
    lender: "Kabir",
    expense: "Laundry",
    amount: 300,
    date: "9/4/25"
  },
  {
    id: "17",
    lender: "Ayesha",
    expense: "Subscription",
    amount: 499,
    date: "8/4/25"
  },
  {
    id: "18",
    lender: "Nikhil",
    expense: "Ice Cream",
    amount: 110,
    date: "7/4/25"
  },
  {
    id: "19",
    lender: "Sana",
    expense: "Books",
    amount: 870,
    date: "6/4/25"
  },
  {
    id: "20",
    lender: "Harsh",
    expense: "Tea",
    amount: 70,
    date: "5/4/25"
  },
  {
    id: "21",
    lender: "Diya",
    expense: "Medicine",
    amount: 350,
    date: "4/4/25"
  }
];


const Index = () => {
  const [totalExpense, setTotalExpense] = useState(0)
  const [isRowModalOpen, setIsRowModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ExpenseType>({
    id: "",
    lender: "",
    expense: "",
    amount: 0,
    date: ""
  })
  function handleRowPress(item: ExpenseType) {
    console.log(item)
    setModalData(item)
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
              data={sample_data}
              renderItem={({ item }) => (
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#fff", false)} onPress={handleRowPress.bind(null, item)}>
                  <View>
                    <DataTable.Row>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ marginRight: 10 }}>{item.lender}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ minWidth: 90 }}>{item.expense}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} >{item.amount}</DataTable.Cell>
                      <DataTable.Cell textStyle={{ color: "white", fontFamily: "Montserrat_500Medium" }} style={{ marginLeft: 10 }}>{item.date}</DataTable.Cell>
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
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Lender: {`${modalData.lender}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Expense Description: {`${modalData.expense}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Amount: {`${modalData.amount}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Date: {`${modalData.date}`}</Text>
                  <Text style={{ color: "white", fontFamily: "Montserrat_500Medium" }}>Borrowers: Aditya, Shukla, Atharva</Text>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  )
}


export default Index