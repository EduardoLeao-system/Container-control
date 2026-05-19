import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface FormFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
}

export function FormField({ label, required, style, ...props }: FormFieldProps) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        {label}
        {required && <Text style={{ color: colors.destructive }}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
