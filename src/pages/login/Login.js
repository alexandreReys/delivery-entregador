import React, { useEffect, useState, useCallback } from "react";
import {useFocusEffect} from '@react-navigation/native';
import { KeyboardAvoidingView, View, TextInput, Text, 
  StyleSheet, TouchableOpacity, Animated, Keyboard
} from "react-native";

import Loader from "../../components/Loader";

import * as loginService from "../../services/loginService";

const login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 95 }));
  const [opacity] = useState(new Animated.Value(0));
  const [logo] = useState(new Animated.ValueXY({ x: 230, y: 255 }));

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      return ()=>{setLoading(false)};  // unFocus
    }, [])
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setUser("ale");
      setPassword("1133");
    };
    
    keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow", keyboardDidShow
    );

    keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide", keyboardDidHide
    );

    Animated.parallel([
      Animated.spring(offset.y, {toValue: 0,speed: 4,bounciness: 20,useNativeDriver: false}),
      Animated.timing(opacity, {toValue: 1,duration: 1500,useNativeDriver: false}),
    ]).start();
  }, []);

  function keyboardDidShow() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: 85,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 95,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: 230,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 255,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  async function onPressBtnSubmit() {
    setLoading(true);
    const ok = await loginService.login(user, password, navigation);
    if (!ok) setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.background}>

      {/* Logotipo */}
      <View style={styles.containerLogo}>
        <Animated.Image
          style={{ width: logo.x, height: logo.y }}
          source={require("../../../assets/logo.png")}
        />
      </View>

      {/* Form Usuario e Senha */}
      {!loading &&
        <Animated.View
          style={[
            styles.container, {
              opacity: opacity, transform: [{ translateY: offset.y }]
            }]}
        >
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            autoCorrect={false}
            value={user}
            onChangeText={(text) => { setUser(text) }}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            autoCorrect={false}
            value={password}
            onChangeText={(text) => { setPassword(text) }}
          />

          <TouchableOpacity style={styles.btnSubmit} onPress={onPressBtnSubmit}>
            <Text style={styles.SubmitText}>Acessar</Text>
          </TouchableOpacity>

        </Animated.View>
      }

      {loading &&
        <Loader />
        // <View style={styles.loadingContainer}>
        //   <Text style={styles.loadingText}>Loading ...</Text>
        // </View>
      }

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 50,
  },
  loadingText: {
    fontSize: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    width: "90%",
    marginBottom: 15,
    color: "#000",
    fontSize: 17,
    borderRadius: 7,
    padding: 10,
  },
  btnSubmit: {
    backgroundColor: "#35AAFF",
    width: "90%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  SubmitText: {
    color: "#FFF",
    fontSize: 18,
  },
});

export default login;
