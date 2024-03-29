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
  // const [logo] = useState(new Animated.ValueXY({ x: 230, y: 255 }));
  const [logo] = useState(new Animated.ValueXY({ x: 250, y: 250 }));

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      return ()=>{
        setLoading(false);
        setUser("");
        setPassword("");
      };  // unFocus
    }, [])
  );
  
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setUser("ale");
      setPassword("1111");
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
        toValue: 200,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 200,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: 300,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 300,
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
      <View style={[styles.containerLogo]}>
        <Animated.Image
          style={{ width: logo.x, height: logo.y }}
          source={require("../../../assets/motoboy.png")}
        />
      </View>

      {/* Form Usuario e Senha */}
      {!loading &&
        <Animated.View
          style={[
            styles.container, {
              opacity: opacity, 
              marginTop: 40,
              // transform: [{ translateY: offset.y }]
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
            secureTextEntry={true}
            autoCorrect={false}
            value={password}
            onChangeText={(text) => { setPassword(text) }}
          />

          <TouchableOpacity style={styles.btnSubmit} onPress={onPressBtnSubmit}>
            <Text style={styles.SubmitText}>Acessar</Text>
          </TouchableOpacity>

        </Animated.View>
      }

      {loading && <Loader />}

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
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 50,
  },
  input: {
    backgroundColor: "#fff",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000",
    width: "90%",
    marginBottom: 10,
    color: "#000",
    fontSize: 17,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  btnSubmit: {
    backgroundColor: "#35AAFF",
    elevation: 5,
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
