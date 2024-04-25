import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react'; 
import {storage} from './firebase';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';

export default function App() {
  const [imagePath, setImagePath] = useState(null); 

  async function hentBillede() {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    });
    if (!resultat.cancelled) {
      console.log("Fået billede... " + resultat);
      setImagePath(resultat.assets[0].uri);
    } else {
      console.log("Intet billede valgt");
    }
  }

  async function uploadBillede(){
    if (imagePath) {
      try {
        const res = await fetch(imagePath);
        const blob = await res.blob();
        const storageRef = ref(storage, "dog.jpg");
        await uploadBytes(storageRef, blob);
        console.log("Image uploaded...");
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    } else {
      console.log("No image selected");
    }
  }

  async function downloadBillede(){
    await getDownloadURL(ref(storage,"dog.jpg"))
    .then((url)=>{
      setImagePath(url)
    })
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Image source={{ uri: imagePath }} style={{ width: 150, height: 150 }} />
      <Button title='hent billede' onPress={hentBillede} />
      <Button title='Upload billede' onPress={uploadBillede} />
      <Button title='Download billede' onPress={downloadBillede} />
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
  },
});
