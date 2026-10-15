import React from "react";
import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import styles from "./Login.styles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LoginCard from "./components/LoginCard";
import SocialLogin from "./components/SocialLogin";
import BiometricButton from "./components/BiometricButton";
import SecurityBadges from "./components/SecurityBadges";
import Footer from "./components/Footer";

export default function LoginScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaView style={styles.container}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    <Header />

    <Hero />

    <LoginCard />

    <SocialLogin />

    <BiometricButton />

    <SecurityBadges />

    <Footer />
  </ScrollView>
</SafeAreaView>    </>
  );
}
