import { Tabs } from 'expo-router'
import { StatusBar, Image, View, Text } from 'react-native'
export default function Layout() {
  StatusBar.setBackgroundColor("#000")
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 70,
        overflow: "hidden",
        paddingTop: 16,
        backgroundColor:"#3c3d3c",
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
              <Text style={{ fontFamily: focused? "Montserrat_700Bold":"Montserrat_400Medium", fontSize: 12 }}>All Expenses</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="split"
        options={{
          title: "Split",
          tabBarIcon: ({ focused }) => (
            <View className='min-w-[112px] flex items-center'>
              <Image source={require("../../assets/icons/pie-graph-split.png")} className='w-10 h-10' />
              <Text style={{ fontFamily: focused? "Montserrat_700Bold":"Montserrat_400Medium", fontSize: 12 }}>Split</Text>
            </View>
          )
        }}
      />
    </Tabs>
  )
}