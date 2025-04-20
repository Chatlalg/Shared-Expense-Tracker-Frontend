import { FlatList, View, Text, ImageBackground } from 'react-native'
import { GroupOperation } from '@/components/GroupOperations'
import { GroupItem, GroupItemProps } from '@/components/GroupItem';
import { useEffect, useState } from 'react';
import { SearchBar as Search } from '@rneui/themed'
import { SignOutButton } from '@/components/SignOutButton';
import { useUser } from '@clerk/clerk-expo';
import { StatusBar } from 'react-native';

const Home = () => {
  StatusBar.setBackgroundColor("#000")
  const { user } = useUser();
  const [groupData, setGroupData] = useState<GroupItemProps[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [flatlistData, setFlatlistData] = useState<GroupItemProps[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const email = user?.emailAddresses[0].emailAddress
        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/user/home`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email })
        })
        // console.log(res)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json() as Array<{
          pool_id : string,
          pool_name : string,
          creation_date : string,
          total_members: number
        }>
        console.log(json)
        const formatted = json.map((g) => ({
          id: g.pool_id,
          group_name: g.pool_name,
          members: g.total_members,
        }))
        console.log("groups",formatted,email)

        setGroupData(formatted)
        setFlatlistData(formatted)
      } catch (err) {
        console.error('Failed to fetch groups:', err)
      }
    }

    fetchGroups()
  },[]  )

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
    const filtered_data = groupData.filter((group) => {
      const group_name = group.group_name.toUpperCase();
      const query_group = query.toUpperCase();
      return group_name.indexOf(query_group) > -1;
    });
    setFlatlistData(filtered_data)
  }
  console.log("hello")

  return (
    <View>
      <ImageBackground source={require("../assets/images/home-bg.png")} className='gap-6 px-4' style={{ height: "100%" }}>
        <SignOutButton />
        <View style={{ paddingBottom: 10 }}>
          <Search
            platform="android"
            placeholder="Search groups..."
            onChangeText={updateSearchQuery}
            value={searchQuery}
          />
        </View>

        <View className='flex flex-row gap-10'>
          <GroupOperation button_name={"Create Group"} path="create-group" />
          <GroupOperation button_name={"Join Group"} path="join-group" />
        </View>


        <View style={{ height: "56%" }}>
          <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 18 }}>All groups</Text>
          {
            flatlistData.length > 0 ?
              <FlatList
                data={flatlistData}
                renderItem={({ item }) => <GroupItem id={item.id} group_name={item.group_name} members={item.members} />}
              />
              : <Text className='text-white text-center' style={{ fontFamily: "Montserrat_500Medium", padding: 20 }}>Join or Create a group</Text>
          }

        </View>
      </ImageBackground>
    </View>
  )
}

export default Home
