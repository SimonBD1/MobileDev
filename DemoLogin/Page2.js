import { StatusContext } from "./context";
import { useState, useContext } from "react";
import { Text, View } from "react-native";

export default function Page2(navigation) {
  const statusContext = useContext(StatusContext);
  return (
    <View>
      {statusContext.currentUser && 
      <Text>Du er logget på</Text>
      }
      {!statusContext.currentUser && 
      <Text>Du er ikke logget på</Text>
      }
    </View>
  );
}
