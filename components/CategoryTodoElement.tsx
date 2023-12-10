import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import React from 'react'

interface TodoProps {
  todo: {
    _id: string
    title: string
    category: string
    deadline?: Date
    color: string
    location: string
  }
}

const CategoryTodoElement: React.FC<TodoProps> = ({ todo }) => {
  const todoStyle = StyleSheet.create({
    container: {
      width: 370,
      height: 80,
      backgroundColor: `#${todo.color}`,
      paddingTop: 8,
      paddingLeft: 20,
      paddingRight: 24,
      marginBottom: 12,
      borderRadius: 8,
      borderColor: 'black',
      borderWidth: 2,
    },
  })
  console.log(todo._id)

  return (
    <View style={todoStyle.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{todo.title}</Text>
        <Text style={{ fontSize: 16 }}>
          {todo.deadline !== undefined &&
            `Deadline: ${todo.deadline.toLocaleString('de-DE')}`}
        </Text>
      </View>
      <Text>{todo.location}</Text>
    </View>
  )
}

export default CategoryTodoElement
