import { StyleSheet } from 'react-native'
import { Text, View } from '../../components/Themed'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'expo-router'

export default function Page() {
  const [categories, setCategories] = useState<string[]>([])

  function createSlug(str: string) {
    return str.toLowerCase().replaceAll(' ', '-')
  }

  useEffect(() => {
    axios.get('http://192.168.1.106:9000/categories').then((res) => {
      res.data.map((fetchedCategory: string) => {
        console.log(fetchedCategory)
        setCategories((prevCategories) => [...prevCategories, fetchedCategory])
      })
    })
  }, [])

  const splitArray = (arr: string[]) => {
    const midIndex = Math.ceil(arr.length / 2)
    const firstHalf = arr.slice(0, midIndex)
    const secondHalf = arr.slice(midIndex)
    return [firstHalf, secondHalf]
  }

  const [column1Data, column2Data] = splitArray(categories)

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {column1Data.map((category) => (
          <Link key={category} href={`/${category}`}>
            <View style={styles.categories}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </Link>
        ))}
      </View>
      <View style={styles.column}>
        {column2Data.map((category) => (
          <Link key={category} href={`/${category}`}>
            <View style={styles.categories}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </Link>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  column: {
    alignItems: 'center',
    gap: 20,
  },
  categories: {
    width: 150,
    height: 100,
    backgroundColor: '#97a3b8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
})
