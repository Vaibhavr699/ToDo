import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Tasks collection reference
const tasksCollection = collection(db, 'tasks');

// Create a new task
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(tasksCollection, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

// Get all tasks for a user
export const getTasks = async (userId) => {
  try {
    const q = query(
      tasksCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

// Update a task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: taskId, ...updates };
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    return taskId;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

// Get tasks by status
export const getTasksByStatus = async (userId, status) => {
  try {
    const q = query(
      tasksCollection,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting tasks by status:', error);
    throw new Error('Failed to fetch tasks');
  }
};

// Get tasks by priority
export const getTasksByPriority = async (userId, priority) => {
  try {
    const q = query(
      tasksCollection,
      where('userId', '==', userId),
      where('priority', '==', priority),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting tasks by priority:', error);
    console.error('Error deleting attachment:', error);
    throw error;
  }
};

// Upload user profile image
export const uploadProfileImage = async (userId, file) => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Delete user profile image
export const deleteProfileImage = async (userId, fileName) => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile image:', error);
    throw error;
  }
}; 