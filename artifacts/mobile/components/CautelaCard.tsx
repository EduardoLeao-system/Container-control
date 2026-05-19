import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Cautela, StatusCautela } from "@/contexts/CautelaContext";
import { useColors } from "@/hooks/useColors";

const STATUS_CONFIG: Record<StatusCautela, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "#f59e0b" },
  concluida: { label: "Concluída", color: "#22c55e" },
  cancelada: { label: "Cancelada", color: "#ef4444" },
};

interface CautelaCardProps {
  cautela: Cautela;
}

export function CautelaCard({ cautela }: CautelaCardProps) {
  const colors = useColors();
  const { label, color } = STATUS_CONFIG[cautela.status];
  const date = new Date(cautela.createdAt).toLocaleDateString("pt-BR");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={() => router.push(`/cautela/${cautela.id}`)}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primary + "14" }]}>
            <Feather name="box" size={20} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.numero, { color: colors.foreground }]}>
              #{cautela.numeroControle}
            </Text>
            <Text style={[styles.container, { color: colors.mutedForeground }]} numberOfLines={1}>
              {cautela.conteiner || "—"} · {cautela.origemLocal || "—"} → {cautela.destinoLocal || "—"}
            </Text>
            <Text style={[styles.date, { color: colors.mutedForeground }]}>{date}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <View style={[styles.badge, { backgroundColor: color + "20" }]}>
            <Text style={[styles.badgeText, { color }]}>{label}</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  numero: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  container: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
