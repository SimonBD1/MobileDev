import { useState, useRef, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MapView , {Marker} from 'react-native-maps'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'
import { saveMarker, fetchMarkers, uploadImage } from './firebase/useFirebase'; 


export default function App() {
  const [markers, setMarkers] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  const [region, setRegion] = useState({ //Sætter koordinaterne til Danmark, som vi bruger når appen startes
    latitude:55,
    longitude:10,
    latitudeDelta:20,
    longitudeDelta: 20,
  })

  useEffect(() => { // useEffect der kører ved start for at hente markører
    const getMarkers = async () => {
      try {
        const fetchedMarkers = await fetchMarkers(); // Henter markører fra Firebase
        const markersToDisplay = fetchedMarkers.map(marker => ({// Konverter markører til formattet vi har bestemt for visning på kortet
          coordinate: {
            latitude: marker.latitude,
            longitude: marker.longitude,
            
          },
          key: marker.id, 
          imageUrl: marker.imageUrl
           
          
        }));
        setMarkers(markersToDisplay); // Opdater med fetched markøre så de bliver vist på kortet
      } catch (error) {
        console.error("Fejl ved hentning af markører:", error);
      }
    };
  
    getMarkers();
  }, []); // Tomt array som sørger for at dette kun køre én gang
  

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Du skal give adgang for at bruge dine medier!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    
    });

   
  
    if (!result.canceled && result.assets && result.assets.length > 0) {// Hvis et billede blev valgt
      const imageUri = result.assets[0].uri; // Få URI'en for det valgte billede
      console.log(imageUri);
      const fileName = `markers/${Date.now()}.jpg`; // Opret filnavn for det uploadede billede
      try {
        const imageUrl = await uploadImage(imageUri, fileName); // Upload billedet til Firebase Storage
        const markerId = await saveMarker({ latitude, longitude, imageUrl }); // Gem markørens oplysninger i Firebase Firestore
        setMarkers(prevMarkers => [...prevMarkers, { coordinate: { latitude, longitude }, key: markerId, imageUrl }]);  // Tilføjer den nye markør til kortet
      } catch (error) {
        console.error("Fejl i tilføjelse af din satte markør og billede:", error);
      }
    }
  }
  

  return (
    <View style={styles.container}>

      <MapView 
        style={styles.map}
        region={region} 
        onLongPress={addMarker} //ved lang tryk tilføj markør
      >
        {markers.map(marker => ( //går igennem markørene og viser dem på map
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            onPress={() => { // ved tryk på markør
              setSelectedImage(marker.imageUrl); // Indstil det valgte billede
              setModalVisible(true);
            }}
          />
        ))}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Luk</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 300, height: 300 }} />} 
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});