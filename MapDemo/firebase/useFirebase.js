import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { storage, database } from './firebase';


//funktion til at gemme markører i firebase
export const saveMarker = async (markerData) => {
  try {
    const docRef = await addDoc(collection(database, "markers"), markerData);// Tilføj dokument til 'markers' i Firestore
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Returner ID'en for det oprettede dokument
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; //kast fejl hvis dokument ikke bliver gemt
  }
};

// Funktion til at hente markører fra Firebase Firestore
export const fetchMarkers = async () => {
    const markersCollectionRef = collection(database, "markers"); // Reference til 'markers' i Firestore
    const querySnapshot = await getDocs(markersCollectionRef); // Hent dokumenter fra 'markers'
    const markers = querySnapshot.docs.map(doc => { // Konvertere dokumenterne
      return { ...doc.data(), id: doc.id };// Tilføj ID'et for hvert dokument til objektet
    });
    return markers; // Returner markørerne
};

// Funktion til at uploade et billede til Firebase Storage
export const uploadImage = async (imagePath, fileName) => {
  if (imagePath) { // tjekker hvis der er en sti til billedet
    const res = await fetch(imagePath); // Hent billedet fra stien
    const blob = await res.blob(); // Konverter billedet til en blob
    const storageRef = ref(storage, fileName); // Opretter en reference til lagringsstedet og filnavnet i Firebase Storage
    try {
      await uploadBytes(storageRef, blob);// Upload billedet til Firebase Storage
      const downloadUrl = await getDownloadURL(storageRef); // Hent download-URL'en for det uploadede billede
      console.log("Image uploaded:", downloadUrl);
      return downloadUrl; // Returner URL'en for det uploadede billede
    } catch (error) {
      console.error("Upload failed", error);
      throw error;
    }
  } else {
    console.log("No image selected");
    return null;
  }
};