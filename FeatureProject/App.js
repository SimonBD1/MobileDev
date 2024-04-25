import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [permission, setPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState();
  const [recordedUri, setRecordedUri] = useState("");

  useEffect(() => {
    (async () => {
      const audioPermission = await Audio.requestPermissionsAsync();
      setPermission(audioPermission.status === 'granted');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
      // Hent den senest gemte optagelses URI ved app start
      const uri = await AsyncStorage.getItem('lastRecordingUri');
      if (uri) {
        setRecordedUri(uri);
      }
    })();
  }, []);

  const startRecording = async () => {
    if (!permission) {
      console.log('Audio permission is required.');
      return;
    }
    setIsRecording(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const newRecording = new Audio.Recording();
    await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await newRecording.startAsync();
    setRecording(newRecording);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri);
    await AsyncStorage.setItem('lastRecordingUri', uri); // Gem optagelsens URI
    console.log('Recording stopped and stored at', uri);
  };

  const playRecording = async () => {
    console.log('Playing from', recordedUri);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
    const { sound } = await Audio.Sound.createAsync(
      { uri: recordedUri },
      { shouldPlay: true }
    );
    setIsPlaying(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isPlaying) {
        setIsPlaying(false);
      }
    });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Sound Recorder App!</Text>
      {permission ? (
        <>
          <Button
            title={isRecording ? "Stop Recording" : "Start Recording"}
            onPress={isRecording ? stopRecording : startRecording}
          />
          <Button
            title="Play Recording"
            onPress={playRecording}
            disabled={!recordedUri || isRecording}
          />
        </>
      ) : (
        <Text>No access to microphone.</Text>
      )}
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
