import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 🔧 Define the screen names and their params
type RootStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  TaskScreen: undefined;
};

type WelcomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'WelcomeScreen'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Task Tracker</Text>

      <View style={styles.bulletPoints}>
        <Text style={styles.point}>✅ Organize your tasks efficiently</Text>
        <Text style={styles.point}>📅 Never miss a deadline</Text>
        <Text style={styles.point}>📊 Track daily productivity</Text>
        <Text style={styles.point}>🔔 Get reminders and notifications</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  bulletPoints: {
    marginBottom: 40,
    width: '100%',
  },
  point: {
    fontSize: 16,
    marginVertical: 8,
    color: '#444',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#32CD32',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});