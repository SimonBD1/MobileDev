import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StatusContextProvider from "./context";
import LoginPage from "./LoginPage";
import Page2 from "./Page2";

export default function App() {
    const Stack = createNativeStackNavigator()
        return (
            <StatusContextProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="LoginPage">
                        <Stack.Screen name="LoginPage" component={LoginPage}/>
                        <Stack.Screen name="Page2" component={Page2} />
                    </Stack.Navigator>
                </NavigationContainer>
            </StatusContextProvider>
        )
}