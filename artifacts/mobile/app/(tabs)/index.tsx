import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Inbox, Plus } from "lucide-react-native";
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
import { useCautela } from "@/contexts/CautelaContext";
import { useColors } from "@/hooks/useColors";

function MiniStat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View style={mini.wrap}>
      <Text style={[mini.value, { color: accent }]}>{value}</Text>
      <Text style={mini.label}>{label}</Text>
    </View>
  );
}

const mini = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1 },
  value: { fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 24 },
  label: {
    fontSize: 9, fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
    letterSpacing: 0.5, marginTop: 2,
  },
});

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, cauteias } = useCautela();
  const recent = cauteias.slice(0, 5);
  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      <LinearGradient
        colors={["#0b1340", "#1a2361", "#1e3a8a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        {/* ── Topo: texto esquerda + logo direita ── */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.company}>THIBA LOGÍSTICA</Text>
            <Text style={styles.title}>CONTROLE DE{"\n"}CAUTELAS</Text>
            <Text style={styles.sub}>Movimentação de Contêineres</Text>
          </View>

          <View style={styles.topRight}>
            <View style={styles.logoWrap}>
              <Image
                source={require("@/assets/images/logo-thiba.jpg")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Pressable
              style={styles.addBtn}
              onPress={() => router.push("/(tabs)/nova-cautela")}
            >
              <Plus size={16} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* ── Barra de stats ── */}
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <MiniStat label="Total"      value={stats.total}     accent="#60a5fa" />
          <View style={styles.sep} />
          <MiniStat label="Pendentes"  value={stats.pendentes} accent="#f59e0b" />
          <View style={styles.sep} />
          <MiniStat label="Concluídas" value={stats.concluidas} accent="#22c55e" />
          <View style={styles.sep} />
          <MiniStat label="Canceladas" value={stats.canceladas} accent="#ef4444" />
        </View>
      </LinearGradient>

      {/* ── Lista recente ── */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 16 }]}
        showsVerticalScrollIndicator={false}
      >
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
            <Inbox size={32} color={colors.mutedForeground} />
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
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
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

  /* Header */
  header: { paddingHorizontal: 16, paddingBottom: 14 },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topLeft: { flex: 1, paddingRight: 10 },
  company: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.2,
    lineHeight: 26,
  },
  sub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.45)",
    marginTop: 4,
  },

  topRight: { alignItems: "center", gap: 8 },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: { width: 50, height: 50, borderRadius: 9 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginBottom: 12 },

  statsRow: { flexDirection: "row", alignItems: "center" },
  sep: { width: 1, height: 26, backgroundColor: "rgba(255,255,255,0.15)" },

  /* Content */
  content: { padding: 12 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  verTudo: { fontSize: 12, fontFamily: "Inter_500Medium" },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 6 },
  emptyText: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  emptyBtn: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9 },
});
