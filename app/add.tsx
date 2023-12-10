import { StatusBar } from 'expo-status-bar'
import { Modal, Platform, StyleSheet, TextInput } from 'react-native'
import { Text, View } from '../components/Themed'
import { useNavigation } from 'expo-router'

export default function AddTodoScreen() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} placeholder='Title' />
      <TextInput style={styles.textInput} placeholder='Description' />
      <Text style={{ color: 'red' }}>Hallo</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'red',
  },
  textInput: {
    backgroundColor: '#d1d1d1',
  },
})
