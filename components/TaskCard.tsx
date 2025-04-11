import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Instead of MaterialIcons, let's use the built-in icons from react-native
import { format } from 'date-fns';

// Define the Task interface here since it's not being found
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: string | null;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return '#FF6B6B';
      case 'Medium':
        return '#FFD166';
      case 'Low':
        return '#06D6A0';
      default:
        return '#A5A5A5';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => onToggleComplete(task.id)}
      >
        {/* Use text symbols instead of icons */}
        <Text style={[
          styles.checkIcon,
          {color: task.completed ? '#4CAF50' : '#757575'}
        ]}>
          {task.completed ? '✓' : '○'}
        </Text>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text style={[
          styles.taskTitle,
          task.completed && styles.completedText
        ]}>{task.title}</Text>
        
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.taskMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          
          <Text style={styles.categoryText}>{task.category}</Text>
          
          {task.dueDate && (
            <Text style={styles.dateText}>
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  completeButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  }
});

export default TaskCard;