import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { app, database } from "../firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [values, loading, error] = useCollection(collection(database, "Notebook"));
  const data =
    values?.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })) || [];
  const auth = getAuth(app);

  useEffect(() => {
    const auth_ = getAuth();
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      if (currentUser) {
        console.log("lytter: du er logget ind som " + currentUser.uid);
      } else {
        console.log("lytter: Ikke logget ind");
      }
    });
    return () => unsubscribe(); // når component unmountes, sluk for listener.
  }, []); //tomt array = kun en gang

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("logget ind som " + userCredential.user.uid);
    } catch (error) {
      console.log("fejl i login " + error);
    }
  };

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("signet up " + userCredential.user.uid);
    } catch (error) {
      console.log("fejl i signup " + error);
    }
  };

  const handleLogin = () => {
    login();
  };

  const handleSignUp = () => {
    signUp();
  };

  const addNote = async () => {
    if (text.trim()) {
      try {
        await addDoc(collection(database, "Notebook"), { text });
        setText("");
      } catch (error) {
        console.error("Fejl: kunne ikke tilføje dit dokument", error);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  function goToDetailPage(noteId, noteText) {
    navigation.navigate("Details", { noteId, noteText });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setText}
        value={text}
        placeholder="Skriv note her..."
        multiline
        verticalAlign="top"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
        placeholder="Adgangskode"
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>Tilføj note</Text>
        </Pressable>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log ind</Text>
        </Pressable>
        <Pressable style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Opret konto</Text>
        </Pressable>
        <Pressable style={styles.signoutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Log ud</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.notesContainer}>
        {data.map(({ id, text }) => (
          <Pressable
            key={id}
            style={styles.noteButtonContainer}
            onPress={() => goToDetailPage(id, text)}
          >
            <Text style={styles.noteButtonText}>
              {(text ?? "").substring(0, 30) +
                ((text ?? "").length > 30 ? "..." : "")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "80%",
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  signoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notesContainer: {
    width: "80%",
  },
  noteButtonContainer: {
    marginBottom: 10,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  noteButtonText: {
    fontSize: 16,
  },
});
