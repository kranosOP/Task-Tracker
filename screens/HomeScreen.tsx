import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const userEmail = auth.currentUser?.email || '';

  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;

  const handleAddOrUpdateTask = () => {
    if (!task.trim()) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId ? { ...t, text: task.trim() } : t
        )
      );
      setEditingTaskId(null);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        text: task.trim(),
        completed: false,
        date: formatDate(new Date()),
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setTask('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleEditTask = (task: Task) => {
    setTask(task.text);
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          setTasks((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (tasks.length === 0) {
      Alert.alert('No Data', 'No tasks available to generate report.');
      return;
    }

    const csvHeader = 'Task,Completed,Date\n';
    const csvRows = tasks.map((task) => {
      const taskText = `"${task.text.replace(/"/g, '""')}"`; // Escape quotes
      const completed = task.completed ? 'Yes' : 'No';
      return `${taskText},${completed},${task.date}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    const fileUri = FileSystem.documentDirectory + 'MonthlyTaskReport.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userEmail}</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter new task"
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddOrUpdateTask}>
            <Text style={styles.addButtonText}>
              {editingTaskId ? 'UPDATE' : 'ADD'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity
                onPress={() => handleToggleComplete(item.id)}
                style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.completedTask,
                  ]}>
                  {item.text}
                </Text>
                <Text style={styles.dateText}>📅 {item.date}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTask(item)}>
                <Text style={styles.editText}>✏</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteText}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks yet</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
          <Text style={styles.reportText}>📄 Download Monthly Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskList: {
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskText: {
    fontSize: 16,
    color: '#333333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  editButton: {
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  editText: {
    fontSize: 18,
  },
  deleteText: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  reportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});