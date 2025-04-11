// navigation/AppStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TaskScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tasks" component={TaskScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
