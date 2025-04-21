import { Tabs } from 'expo-router'
import { Image, View, Text } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Layout() {

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 70,
        overflow: "hidden",
        paddingTop: 16,
        backgroundColor:"#f4f4f4",
        borderWidth:0,
        marginTop:0
      }
    }} >
      <Tabs.Screen
        name="all-expenses"
        options={{
          title: "All Expenses",
          tabBarIcon: ({ focused }) => (
            <View className='min-w-[112px] flex items-center'>
              <Image source={require("../../assets/icons/wallet.png")} className='w-10 h-10' />
              
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title:"Add Expense",
          tabBarIcon: ({focused}) => (
            <View className='min-w-[112px] absolute flex items-center'>
              <AntDesign name="pluscircleo" size={52} color="black"/>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="split"
        options={{
          title: "Split",
          tabBarIcon: ({ focused }) => (
            <View className='min-w-[112px] flex items-center'>
              <Image source={require("../../assets/icons/pie-graph-split.png")} className='w-10 h-10' />
            </View>
          )
        }}
      />
    </Tabs>
  )
}