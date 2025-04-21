import { View, Text, ImageBackground, TouchableNativeFeedback, FlatList } from 'react-native'
import { useState, useEffect } from 'react'
import { SplitItem, SplitItemType } from '@/components/SplitItem';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settlement {
  email: string;
  username: string;
  amount: number;
}

interface AggregatedSettlement {
  [key: string]: SplitItemType;
}

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

const Split = () => {
  const [data, setData] = useState<SplitItemType[]>([])
  const [poolId, setPoolId] = useState<string | null>(null)
  const {user} = useUser()
  const email = user?.emailAddresses[0].emailAddress

  useEffect(() => {
    const getPoolId = async () => {
      try {
        const id = await AsyncStorage.getItem('currentPoolId');
        setPoolId(id);
      } catch (error) {
        console.error('Error getting pool ID:', error);
      }
    };
    getPoolId();
  }, []);

  const fetchSettlements = async () => {
    try {
      console.log('Fetching settlements for email:', email);
      console.log('Server URL:', process.env.EXPO_PUBLIC_SERVER_URL);
      console.log('Pool ID:', poolId);
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/split/settlements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          pool_id: poolId ? parseInt(poolId) : null
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch settlements');
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Aggregate settlements by person
      const aggregatedBorrowings = result.borrowings.reduce((acc: AggregatedSettlement, item: Settlement) => {
        if (!acc[item.email]) {
          acc[item.email] = {
            id: `${item.email}-borrow`,
            username: item.username,
            amount: 0,
            userIsBorrower: true,
            email: item.email
          };
        }
        acc[item.email].amount = parseFloat((Number(acc[item.email].amount) + Number(item.amount)).toFixed(2));
        return acc;
      }, {});

      const aggregatedLendings = result.lendings.reduce((acc: AggregatedSettlement, item: Settlement) => {
        if (!acc[item.email]) {
          acc[item.email] = {
            id: `${item.email}-lend`,
            username: item.username,
            amount: 0,
            userIsBorrower: false,
            email: item.email
          };
        }
        acc[item.email].amount = parseFloat((Number(acc[item.email].amount) + Number(item.amount)).toFixed(2));
        return acc;
      }, {});

      // Convert aggregated objects to arrays
      const transformedData: SplitItemType[] = [
        ...Object.values(aggregatedBorrowings) as SplitItemType[],
        ...Object.values(aggregatedLendings) as SplitItemType[]
      ];

      console.log('Transformed Data:', transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching settlements:', error);
      // Fallback to sample data if API fails
      setData([
        {
          id: "1-borrow",
          username: "Ravi",
          amount: 150,
          userIsBorrower: true,
          email: "ravi@example.com"
        },
        {
          id: "2-lend",
          username: "Megha",
          amount: 200,
          userIsBorrower: false,
          email: "megha@example.com"
        }
      ]);
    }
  };

  useEffect(() => {
    if (email && poolId) {
      fetchSettlements();
    }
  }, [email, poolId]);

  return (
    <View>
      <ImageBackground source={require("../../assets/images/home-bg.png")} className='h-full'>
        <View className='py-10'>
          <Text className='text-white text-center text-3xl' style={{ fontFamily: "Montserrat_600SemiBold" }}>Split</Text>
        </View>
        {data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-lg" style={{ fontFamily: "Montserrat_400Regular" }}>
              No settlements found. Add some expenses to see them here!
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item})=> <SplitItem 
              id={item.id} 
              username={item.username} 
              amount={item.amount} 
              userIsBorrower={item.userIsBorrower}
              email={item.email}
              onPaymentSuccess={fetchSettlements}
            />}
          />
        )}
      </ImageBackground>
    </View>
  )
}

export default Split