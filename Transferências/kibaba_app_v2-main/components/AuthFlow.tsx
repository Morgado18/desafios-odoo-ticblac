"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import LoginScreen from "./login-screen"
import RegisterScreen from "./register-screen"
import { useAuth } from "../contexts/AuthContext"

const AuthFlow = (/* { onAuthenticate } */) => {
  const [showLogin, setShowLogin] = useState(true)
  const { login } = useAuth();

  const handleLoginSuccess = async (email: string, password: string, rememberMe: boolean) => {
    try {
      await login(email, password, rememberMe);
    } catch (error: any) {
      throw error;
    }
  };

  const handleToggleAuthMode = () => {
    setShowLogin(!showLogin)
  }


  const handleRegisterSuccess = () => {
    setShowLogin(true); // Redireciona para a tela de login após o registro
  };

  return (
    <View style={styles.container}>
      {showLogin ? (
        <LoginScreen 
          onRegisterPress={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterScreen onLoginPress={() => setShowLogin(true)} onRegisterSuccess={handleRegisterSuccess} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default AuthFlow
