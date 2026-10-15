import React from "react";
import {SafeAreaView,Text} from "react-native";
import OTPInput from "./components/OTPInput";
import ResendTimer from "./components/ResendTimer";
import VerifyButton from "./components/VerifyButton";
export default function OTPScreen(){return <SafeAreaView style={{flex:1,backgroundColor:"#F8FAFC",padding:24,justifyContent:"center"}}><Text style={{fontSize:30,fontWeight:"800"}}>OTP Verification</Text><Text style={{marginTop:8,color:"#64748B"}}>Enter the 6-digit code sent to your mobile number.</Text><OTPInput/><ResendTimer/><VerifyButton/></SafeAreaView>}