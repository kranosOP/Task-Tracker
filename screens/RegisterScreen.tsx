import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered!');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Register</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button mode="contained" onPress={handleRegister}>Register</Button>
      <Button onPress={() => navigation.navigate('Login')}>Back to Login</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 10, padding: 20 }
});
