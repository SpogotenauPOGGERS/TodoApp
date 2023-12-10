import { StyleSheet } from 'react-native'
import axios from 'axios'

import EditScreenInfo from '../../components/EditScreenInfo'
import { Text, View } from '../../components/Themed'
import { useEffect, useState } from 'react'
import TodoElement from '../../components/TodoElement'

export default function TabOneScreen() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [unsortedDeadlines, setUnsortedDeadlines] = useState<Todo[]>([])
  const [noDeadlineTodos, setNoDeadlineTodos] = useState<Todo[]>([])
  const [allDataFormatted, setAllDataFormatted] = useState<boolean>(false)

  function SortTodos() {
    let sortedTodos: Todo[] = unsortedDeadlines.sort((a, b) => {
      const deadlineA = a.deadline.split('.').reverse().join('')
      const deadlineB = b.deadline.split('.').reverse().join('')
      return deadlineA.localeCompare(deadlineB)
    })
    console.log(sortedTodos)
    sortedTodos = sortedTodos.concat(noDeadlineTodos)
    setTodos(sortedTodos)
    console.log(noDeadlineTodos)
  }

  useEffect(() => {
    axios
      .get('http://192.168.1.106:9000/todos')
      .then((res) => {
        res.data.map((objectTodo: Todo) => {
          if (objectTodo.deadline !== undefined) {
            console.log(objectTodo.deadline)
            const dateString =
              typeof objectTodo.deadline === 'string' ? objectTodo.deadline : ''
            const dateParts = dateString.split('.')
            const formattedDate = new Date(
              parseInt(dateParts[2]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[0])
            )
            const formattedDateString = formattedDate.toLocaleDateString(
              'de-DE',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }
            )
            const todo: Todo = {
              _id: objectTodo._id,
              title: objectTodo.title,
              description: objectTodo.description,
              category: objectTodo.category,
              deadline: formattedDateString,
              color: objectTodo.color,
              location: objectTodo.location,
            }
            console.log(`Todo: ${todo.deadline}`)
            try {
              setUnsortedDeadlines((prevUnsortedDeadlines) => [
                ...prevUnsortedDeadlines,
                todo,
              ])
            } catch {
              return
            }
          } else {
            const todo: Todo = {
              _id: objectTodo._id,
              title: objectTodo.title,
              description: objectTodo.description,
              category: objectTodo.category,
              color: objectTodo.color,
              location: objectTodo.location,
            }
            console.log(`Todo: ${todo.title}`)
            try {
              setNoDeadlineTodos((prevNoDeadlineTodos) => [
                ...prevNoDeadlineTodos,
                todo,
              ])
            } catch {
              return
            }
          }
        })
        setAllDataFormatted(!allDataFormatted)
      })
      .catch((error) => {
        console.error('Error:', error.message)
      })
  }, [])

  useEffect(() => {
    SortTodos()
  }, [allDataFormatted])

  return (
    <View style={styles.container}>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {/* <EditScreenInfo path='app/(tabs)/index.tsx' /> */}
      {todos.map((todo) => (
        <TodoElement key={todo._id} todo={todo} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
