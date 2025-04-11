import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Checkbox, Text } from 'react-native-paper';
import { collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function TaskScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const userID = auth.currentUser?.uid;

  // Add task
  const handleAddTask = async () => {
    if (task.trim().length === 0 || !userID) return;

    await addDoc(collection(db, 'users', userID, 'tasks'), {
      text: task,
      completed: false,
      createdAt: new Date(),
    });

    setTask('');
  };

  // Real-time fetch
  useEffect(() => {
    if (!userID) return;

    const unsub = onSnapshot(collection(db, 'users', userID, 'tasks'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return unsub;
  }, [userID]);

  const toggleCheckbox = async (id: string, current: boolean) => {
    const taskRef = doc(db, 'users', userID!, 'tasks', id);
    await updateDoc(taskRef, { completed: !current });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Daily Tasks</Text>
      <TextInput
        label="Add new task"
        value={task}
        onChangeText={setTask}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleAddTask} style={{ marginTop: 10 }}>
        Add Task
      </Button>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckbox(item.id, item.completed)}
            />
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 5 },
});
