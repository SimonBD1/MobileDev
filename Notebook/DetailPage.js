import React from 'react';
import { View, Text } from 'react-native';

const DetailPage = ({ route }) => {
  const { noteID, noteText } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Note Detail: </Text>
      <Text style={styles.noteId}>Note ID: {noteID}</Text>
      <Text style={styles.noteText}>Note Text: {noteText}</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteId: {
    fontSize: 18,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 18,
    marginBottom: 10,
  },
};

// export default DetailPage;
