import { View, Text, ImageBackground, TouchableNativeFeedback, FlatList } from 'react-native'
import { useState } from 'react'
import { SplitItem, SplitItemType } from '@/components/SplitItem';

const sample_data = [
  {
    id: "1",
    username: "Ravi",
    amount: 150,
    userIsBorrower: true
  },
  {
    id: "2",
    username: "Megha",
    amount: 200,
    userIsBorrower: false
  },
  {
    id: "3",
    username: "Karan",
    amount: 100,
    userIsBorrower: true
  },
  {
    id: "4",
    username: "Sneha",
    amount: 250,
    userIsBorrower: false
  },
  {
    id: "5",
    username: "Tanya",
    amount: 300,
    userIsBorrower: true
  },
  {
    id: "6",
    username: "Aman",
    amount: 180,
    userIsBorrower: false
  },
  {
    id: "7",
    username: "Neha",
    amount: 220,
    userIsBorrower: true
  },
  {
    id: "8",
    username: "Ritik",
    amount: 400,
    userIsBorrower: false
  },
  {
    id: "9",
    username: "Zoya",
    amount: 90,
    userIsBorrower: true
  },
  {
    id: "10",
    username: "Laksh",
    amount: 500,
    userIsBorrower: false
  }
];

// borrower -> username owes you amount
// lender -> you owe username amount (pay)

const Split = () => {
  const [data, setData] = useState<SplitItemType[]>(sample_data)
  return (
    <View>
      <ImageBackground source={require("../../assets/images/home-bg.png")} className='h-full'>
        <View className='py-10'>
          <Text className='text-white text-center text-3xl' style={{ fontFamily: "Montserrat_600SemiBold" }}>Split</Text>
        </View>

        <FlatList
          data={data}
          renderItem={({item})=> <SplitItem id={item.id} username={item.username} amount={item.amount} userIsBorrower={item.userIsBorrower} />}
        />
      </ImageBackground>
    </View>
  )
}

export default Split