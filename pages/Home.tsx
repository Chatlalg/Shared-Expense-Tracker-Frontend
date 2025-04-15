import { FlatList, View, Text, ImageBackground} from 'react-native'
import { GroupOperation } from '@/components/GroupOperations'
import { GroupItem, GroupItemProps } from '@/components/GroupItem';
import { useEffect, useState } from 'react';
import { SearchBar as Search } from '@rneui/themed'


const Home = () => {

  const [groupData, setGroupData] = useState<GroupItemProps[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [flatlistData, setFlatlistData] = useState<GroupItemProps[]>([])

  useEffect(() => {
    const sample_data = [
      {
        id: '1',
        group_name: 'First Item',
        members: 10
      },
      {
        id: '2',
        group_name: 'Second Item',
        members: 10
      },
      {
        id: '3',
        group_name: 'Third Item',
        members: 10
      },
      {
        id: '4',
        group_name: 'Fourth Item',
        members: 10
      },
      {
        id: '5',
        group_name: 'Fifth Item',
        members: 10
      },
      {
        id: '6',
        group_name: 'Sixth Item',
        members: 10
      },
      {
        id: '7',
        group_name: 'Sixth Item',
        members: 10
      },
      {
        id: '8',
        group_name: 'Sixth Item',
        members: 10
      },
      {
        id: '9',
        group_name: 'Sixth Item',
        members: 10
      },
      {
        id: '10',
        group_name: 'Sixth Item',
        members: 10
      },
      {
        id: '11',
        group_name: 'eleeventh Item',
        members: 10
      },
      {
        id: '12',
        group_name: 'twelth item',
        members: 10
      },
      {
        id: '13',
        group_name: 'jamal item',
        members: 10
      },
      {
        id: '14',
        group_name: 'jamal item',
        members: 10
      },
      {
        id: '15',
        group_name: 'jamal item',
        members: 10
      },
    ];
    setGroupData(sample_data)
    setFlatlistData(sample_data)
  },[])

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
    const filtered_data = groupData.filter((group) => {
      const group_name = group.group_name.toUpperCase();
      const query_group = query.toUpperCase();
      return group_name.indexOf(query_group) > -1;
    });
    setFlatlistData(filtered_data)
  }


  return (
    <View>
      <ImageBackground source={require("../assets/images/home-bg.png")} className='gap-6 px-4' style={{ height: "100%" }}>

        <View style={{paddingVertical:10}}>
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


        <View style={{ height: "62%" }}>
          <Text className='text-white' style={{ fontFamily: "Montserrat_600SemiBold", fontSize:18 }}>All groups</Text>
          <FlatList
            data={flatlistData}
            renderItem={({ item }) => <GroupItem id={item.id} group_name={item.group_name} members={item.members} />}
          />
        </View>
      </ImageBackground>
    </View>
  )
}

export default Home
