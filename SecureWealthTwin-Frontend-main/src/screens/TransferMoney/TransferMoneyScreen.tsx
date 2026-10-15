import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import { router } from "expo-router";
import {
  useBeneficiaries,
} from "@/context/BeneficiaryContext";

import styles from "./styles";

const quickAmounts = [
  500,
  1000,
  2500,
  5000,
];

export default function TransferMoneyScreen() {
  const {
    beneficiaries,
    selectedBeneficiary,
    selectBeneficiary,
  } = useBeneficiaries();

  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const numericAmount =
    Number(amount || 0);

  const canContinue = useMemo(() => {
    return (
      numericAmount > 0 &&
      selectedBeneficiary !== null
    );
  }, [
    numericAmount,
    selectedBeneficiary,
  ]);

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setAmount(cleaned);
  };

  const handleContinue = () => {
    if (!canContinue || !selectedBeneficiary) {
      return;
    }

    /*
      Part 2:
      This will navigate to Review Transfer and pass:
      - amount
      - beneficiary
      - note
      - source account
    */

      router.push({
    pathname: "/transfer/review",
    params: {
      amount: numericAmount.toString(),

      beneficiaryName:
        selectedBeneficiary.name,

      beneficiaryBank:
        selectedBeneficiary.bank,

      beneficiaryAccount:
        selectedBeneficiary.account,

      note: note,
    },
  } as any);
};

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <SafeAreaView
        style={styles.container}
        edges={["top"]}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={
            Platform.OS === "ios" ? "padding" : undefined
          }
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* =========================================
                            HEADER
            ========================================= */}

            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={23}
                  color="#0F172A"
                />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>
                  Transfer Money
                </Text>

                <Text style={styles.headerSubtitle}>
                  Secure payment
                </Text>
              </View>

              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={22}
                  color="#16A34A"
                />
              </TouchableOpacity>
            </View>

            {/* =========================================
                        SECURITY INDICATOR
            ========================================= */}

            <View style={styles.securityStrip}>
              <View style={styles.securityIcon}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={19}
                  color="#16A34A"
                />
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>
                  Twin Shield Active
                </Text>

                <Text style={styles.securitySubtitle}>
                  This transfer will be verified by AI
                  before payment.
                </Text>
              </View>

              <View style={styles.activeDot} />
            </View>

            {/* =========================================
                        SOURCE ACCOUNT
            ========================================= */}

            <Text style={styles.sectionLabel}>
              PAY FROM
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.accountCard}
            >
              <View style={styles.bankIcon}>
                <MaterialCommunityIcons
                  name="bank-outline"
                  size={24}
                  color="#2563EB"
                />
              </View>

              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>
                  SecureWealth Account
                </Text>

                <Text style={styles.accountNumber}>
                  Savings •••• 8294
                </Text>
              </View>

              <View style={styles.accountBalanceContainer}>
                <Text style={styles.balanceLabel}>
                  AVAILABLE
                </Text>

                <Text style={styles.accountBalance}>
                  ₹2,84,500
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={18}
                color="#64748B"
                style={styles.accountChevron}
              />
            </TouchableOpacity>

            {/* =========================================
                           AMOUNT
            ========================================= */}

            <Text style={styles.sectionLabel}>
              ENTER AMOUNT
            </Text>

            <LinearGradient
              colors={["#EEF4FF", "#F8FAFF"]}
              style={styles.amountCard}
            >
              <Text style={styles.amountHelper}>
                How much would you like to send?
              </Text>

              <View style={styles.amountInputRow}>
                <Text style={styles.currencySymbol}>
                  ₹
                </Text>

                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={8}
                  style={styles.amountInput}
                />
              </View>

              <Text style={styles.availableBalance}>
                Available balance ₹2,84,500
              </Text>

              <View style={styles.quickAmountRow}>
                {quickAmounts.map((value) => {
                  const active =
                    numericAmount === value;

                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() =>
                        setAmount(value.toString())
                      }
                      style={[
                        styles.quickAmountButton,
                        active &&
                          styles.quickAmountButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickAmountText,
                          active &&
                            styles.quickAmountTextActive,
                        ]}
                      >
                        +₹{value.toLocaleString("en-IN")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>

            {/* =========================================
                        BENEFICIARY
            ========================================= */}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabelNoMargin}>
                SEND TO
              </Text>

              <TouchableOpacity
  activeOpacity={0.75}
  style={styles.addBeneficiaryButton}
  onPress={() =>
    router.push("/beneficiaries" as any)
  }
>
                <Ionicons
                  name="add"
                  size={16}
                  color="#2563EB"
                />

                <Text style={styles.addBeneficiaryText}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.beneficiaryContainer
              }
            >
              {beneficiaries.map((beneficiary) => {
                const selected =
                  selectedBeneficiary?.id ===
                  beneficiary.id;

                return (
                  <TouchableOpacity
                    key={beneficiary.id}
                    activeOpacity={0.8}
                    onPress={() =>
  selectBeneficiary(
    beneficiary
  )
}
                    style={[
                      styles.beneficiaryCard,
                      selected &&
                        styles.beneficiaryCardSelected,
                    ]}
                  >
                    {selected && (
                      <View style={styles.selectedCheck}>
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color="#FFFFFF"
                        />
                      </View>
                    )}

                    <View
                      style={[
                        styles.avatar,
                        {
                          backgroundColor:
                            beneficiary.color,
                        },
                      ]}
                    >
                      <Text style={styles.avatarText}>
                        {beneficiary.initials}
                      </Text>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={styles.beneficiaryName}
                    >
                      {beneficiary.name}
                    </Text>

                    <Text style={styles.beneficiaryBank}>
                      {beneficiary.bank}
                    </Text>

                    <Text
                      style={styles.beneficiaryAccount}
                    >
                      {beneficiary.account}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* =========================================
                            NOTE
            ========================================= */}

            <Text style={styles.sectionLabel}>
              PAYMENT NOTE
            </Text>

            <View style={styles.noteContainer}>
              <MaterialCommunityIcons
                name="message-text-outline"
                size={21}
                color="#64748B"
              />

              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note (optional)"
                placeholderTextColor="#94A3B8"
                maxLength={80}
                style={styles.noteInput}
              />

              <Text style={styles.noteCounter}>
                {note.length}/80
              </Text>
            </View>

            {/* =========================================
                       TRANSFER SUMMARY
            ========================================= */}

            {canContinue && selectedBeneficiary && (
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={18}
                    color="#2563EB"
                  />

                  <Text style={styles.previewTitle}>
                    Transfer Preview
                  </Text>
                </View>

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    Recipient
                  </Text>

                  <Text style={styles.previewValue}>
                    {selectedBeneficiary.name}
                  </Text>
                </View>

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    Amount
                  </Text>

                  <Text style={styles.previewAmount}>
                    ₹
                    {numericAmount.toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </View>

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    Transfer Fee
                  </Text>

                  <Text style={styles.freeText}>
                    FREE
                  </Text>
                </View>
              </View>
            )}

            {/* =========================================
                          CONTINUE
            ========================================= */}

            <TouchableOpacity
              disabled={!canContinue}
              activeOpacity={0.85}
              onPress={handleContinue}
              style={[
                styles.continueButton,
                !canContinue &&
                  styles.continueButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.continueText,
                  !canContinue &&
                    styles.continueTextDisabled,
                ]}
              >
                Continue Securely
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={
                  canContinue
                    ? "#FFFFFF"
                    : "#94A3B8"
                }
              />
            </TouchableOpacity>

            <View style={styles.footerSecurity}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={14}
                color="#64748B"
              />

              <Text style={styles.footerSecurityText}>
                End-to-end encrypted • Protected by
                Twin Shield
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}