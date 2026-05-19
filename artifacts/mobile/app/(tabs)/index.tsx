import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CautelaCard } from "@/components/CautelaCard";
import { StatCard } from "@/components/StatCard";
import { useCautela } from "@/contexts/CautelaContext";
import { useColors } from "@/hooks/useColors";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, cauteias } = useCautela();
  const recent = cauteias.slice(0, 5);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 16 }]}>
        <View>
          <Text style={styles.headerWelcome}>Bem-vindo(a)</Text>
          <Text style={styles.headerTitle}>DASHBOARD</Text>
          <Text style={styles.headerSub}>Movimentação de Contêineres</Text>
        </View>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.push("/(tabs)/nova-cautela")}
        >
          <Feather name="plus" size={22} color={colors.primaryForeground} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          RESUMO GERAL
        </Text>
        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} icon="box" color={colors.primary} />
          <StatCard label="Pendentes" value={stats.pendentes} icon="clock" color="#f59e0b" />
        </View>
        <View style={[styles.statsRow, { marginTop: 10 }]}>
          <StatCard label="Concluídas" value={stats.concluidas} icon="check-circle" color="#22c55e" />
          <StatCard label="Canceladas" value={stats.canceladas} icon="x-circle" color="#ef4444" />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            MOVIMENTAÇÕES RECENTES
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/historico")}>
            <Text style={[styles.verTudo, { color: colors.secondary }]}>Ver tudo</Text>
          </Pressable>
        </View>

        {recent.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="inbox" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhuma cautela registrada
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Toque em + para registrar a primeira movimentação
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/nova-cautela")}
            >
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                Nova Cautela
              </Text>
            </Pressable>
          </View>
        ) : (
          recent.map((c) => <CautelaCard key={c.id} cautela={c} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerWelcome: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 16 },
  statsRow: { flexDirection: "row", gap: 10 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  verTudo: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 20 },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
