import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, FlatList, Button, View, TextInput, Text } from 'react-native';

export default function App() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState([])
  const [editObj, setEditObj] = useState(null)

  
 function buttonHandler(){
    setNotes([...notes, {key:notes.length, name:text}])   
  }

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      { editObj && 
        <View>
          <TextInput defaultValue={editObj.text} onChangeText={(txt) => setText(txt)} />
          <Text onPress={saveUpdate}>Save</Text>
        </View> 
      }

      <TextInput style={styles.textInput}  onChangeText={(txt) => setText(txt)} />
      <Button title='Press Me' onPress={buttonHandler} ></Button>
      <FlatList
        data={notes}
        renderItem={(note) => 
          <View>
            <Text>{note.item.name}</Text>
          </View>
      }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:200
  },
  textInput:{
    backgroundColor:'lightblue',
    minWidth: 200
  }
});