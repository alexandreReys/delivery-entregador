import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Login from "./pages/login/Login";
import OrderSelect from "./pages/order-select/OrderSelect";
import OrderToDeliver from "./pages/order-to-deliver/OrderToDeliver";
import OrderOnTheWay from "./pages/order-on-the-way/OrderOnTheWay";
import SeeMore from "./pages/see-more/SeeMore";
import Map from "./pages/map/Map";
import WentWrong from "./pages/went-wrong/WentWrong";

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderSelect"
        component={OrderSelect}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderToDeliver"
        component={OrderToDeliver}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeMore"
        component={SeeMore}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderOnTheWay"
        component={OrderOnTheWay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ title: "Voltar" }}
      />
      <Stack.Screen
        name="WentWrong"
        component={WentWrong}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default Routes;


// import { createAppContainer } from "react-navigation";
// import { createStackNavigator } from "react-navigation-stack";
//
// const Routes = createAppContainer(
//   createStackNavigator(
//     {
//       Login: {
//         screen: Login,
//         navigationOptions: { headerShown: false },
//       },
//       OrderSelect: {
//         screen: OrderSelect,
//         navigationOptions: { headerShown: false },
//       },
//       OrderToDeliver: {
//         screen: OrderToDeliver,
//         navigationOptions: { headerShown: false },
//       },
//       OrderOnTheWay: {
//         screen: OrderOnTheWay,
//         navigationOptions: { headerShown: false },
//       },
//       Map: {
//         screen: Map,
//         navigationOptions: {
//           title: "Voltar",
//           headerStyle: { backgroundColor: "#d7ccc8" },
//           headerTitleStyle: { color: '#283593' },
//           headerTintColor: '#283593',
//         },
//       },
//     },
//   )
// );
//
// export default Routes;
