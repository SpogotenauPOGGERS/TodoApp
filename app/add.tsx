import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { Text, View } from '../components/Themed'
import Checkbox from 'expo-checkbox'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { colors } from '../types/colors'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as Location from 'expo-location'

export default function AddTodoScreen() {
  let categoryItems: any[] = []
  const [categories, setCategories] = useState<string[]>([])
  const [value, setValue] = useState<string>(categories[0])
  const [colorValue, setColorValue] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [colorOpen, setColorOpen] = useState<boolean>(false)
  const [items, setItems] = useState(categoryItems)
  const [colorItems, setColorItems] = useState(colors)
  const [isNewSelected, setIsNewSelected] = useState<boolean>(false)
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)
  const [date, setDate] = useState<Date | string>(new Date())
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [deadline, setDeadline] = useState<string>()
  const [location, setLocation] = useState<Location.LocationObject>()
  const [errorMsg, setErrorMsg] = useState('')
  const [city, setCity] = useState<string | null>('')
  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    if (value === 'Add new category') {
      setIsNewSelected(true)
    }
  }, [value])

  useEffect(() => {
    axios.get('http://192.168.1.106:9000/categories').then((res) => {
      const fetchedCategories = res.data

      setCategories((prevCategories) => [
        ...prevCategories,
        ...fetchedCategories,
      ])

      categoryItems = fetchedCategories.map((category: string) => ({
        label: category,
        value: category,
      }))

      categoryItems.push({
        label: 'Add new category',
        value: 'Add new category',
      })

      setItems(categoryItems)
    })
  }, [])

  const toggleDatepicker = () => {
    setShowPicker(!showPicker)
  }

  const onChange = ({ type }, selectedDate: Date) => {
    if (type === 'set') {
      const currentDate = selectedDate || date

      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
      const day = currentDate.getDate().toString().padStart(2, '0')
      let formattedDate: string = `${day}.${month}.${year}`
      setDate(formattedDate)
      setDeadline(formattedDate)
      if (Platform.OS === 'android') {
        toggleDatepicker()
      }
    } else {
      toggleDatepicker()
    }
  }

  const confrimDate = () => {
    setDeadline(date)
    toggleDatepicker()
    console.log(typeof deadline, deadline)
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    setLocation(location)
    console.log(location.coords.longitude, location.coords.latitude)
    const reverseGeocodeLocation = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    })
    console.log(reverseGeocodeLocation)
    setCity(reverseGeocodeLocation[0].city)
  }

  const uploadNewTodo = () => {
    console.log(value)

    // if (toggleCheckBox) {
    //   axios.post('http://192.168.1.106:9000/addTodo', {
    //     title: title,
    //     category: value,
    //     description: description,
    //     deadline: deadline,
    //     color: colorValue,
    //     location: city,
    //   })
    // } else {
    //   axios.post('http://192.168.1.106:9000/addTodo', {
    //     title: title,
    //     category: value,
    //     description: description,
    //     color: colorValue,
    //     location: city,
    //   })
    // }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Title'
        placeholderTextColor={'#575757'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Description'
        placeholderTextColor={'#575757'}
        value={description}
        onChangeText={setDescription}
      />
      {isNewSelected ? (
        <View>
          <View style={{ flexDirection: 'row', marginBottom: 200 }}>
            <TextInput
              style={styles.textInput}
              placeholder='Category'
              placeholderTextColor={'#575757'}
              onChangeText={setValue}
            />
            <View style={{ width: 120 }}>
              <DropDownPicker
                placeholder='Color'
                open={colorOpen}
                value={colorValue}
                items={colorItems}
                setOpen={setColorOpen}
                setValue={setColorValue}
                setItems={setColorItems}
              />
            </View>
          </View>

          <View
            style={{
              margin: 10,
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 10,
              paddingLeft: 10,
              backgroundColor: 'red',
            }}
          >
            <Button
              color={'black'}
              title='Back'
              onPress={() => {
                setIsNewSelected(!isNewSelected)
                setValue(categories[0])
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{ width: 180, marginBottom: 200 }}>
          <DropDownPicker
            placeholder='Select a category'
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>
      )}

      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginTop: 10 }}>Create a deadline: </Text>
          <Checkbox
            style={{ margin: 8 }}
            value={toggleCheckBox}
            onValueChange={setToggleCheckBox}
          />
        </View>
        {!toggleCheckBox ? (
          <Text></Text>
        ) : (
          <View>
            {showPicker && (
              <DateTimePicker
                mode='date'
                display='spinner'
                value={date}
                onChange={onChange}
                style={styles.datePicker}
              />
            )}
            {showPicker && Platform.OS === 'ios' && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={toggleDatepicker}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={confrimDate}
                >
                  <Text>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
            {!showPicker && (
              <Pressable onPress={toggleDatepicker}>
                <TextInput
                  placeholder='Deadline'
                  placeholderTextColor={'#575757'}
                  editable={false}
                  value={deadline ? deadline.toLocaleDateString('de-DE') : ''}
                  onPressIn={toggleDatepicker}
                  style={styles.textInput}
                />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <View
        style={{
          margin: 10,
          paddingTop: 5,
          paddingBottom: 5,
          paddingRight: 10,
          paddingLeft: 10,
          backgroundColor: 'green',
        }}
      >
        <Button
          color={'black'}
          title='Create Todo'
          onPress={async () => {
            setIsNewSelected(!isNewSelected)
            setValue(categories[0])
            await getLocation()
            uploadNewTodo()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'red',
  },
  textInput: {
    backgroundColor: '#d1d1d1',
    fontSize: 20,
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
})
