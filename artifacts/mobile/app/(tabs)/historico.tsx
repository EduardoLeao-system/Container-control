import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CautelaCard } from "@/components/CautelaCard";
import type { StatusCautela } from "@/contexts/CautelaContext";
import { useCautela } from "@/contexts/CautelaContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { label: string; value: StatusCautela | "todos" }[] = [
  { label: "Todas", value: "todos" },
  { label: "Pendentes", value: "pendente" },
  { label: "Concluídas", value: "concluida" },
  { label: "Canceladas", value: "cancelada" },
];

export default function HistoricoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cauteias } = useCautela();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusCautela | "todos">("todos");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const filtered = cauteias.filter((c) => {
    const matchStatus = filter === "todos" || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.numeroControle.toLowerCase().includes(q) ||
      c.conteiner.toLowerCase().includes(q) ||
      c.motorista.toLowerCase().includes(q) ||
      c.transportador.toLowerCase().includes(q) ||
      c.origemLocal.toLowerCase().includes(q) ||
      c.destinoLocal.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>HISTÓRICO</Text>
          <Text style={styles.headerSub}>Todas as movimentações</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/(tabs)/nova-cautela")}
        >
          <Feather name="plus" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Pesquisar cautela..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[
              styles.filterBtn,
              {
                backgroundColor: filter === f.value ? colors.primary : colors.card,
                borderColor: filter === f.value ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(f.value)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.value ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        renderItem={({ item }) => <CautelaCard cautela={item} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="inbox" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {search || filter !== "todos" ? "Nenhum resultado" : "Sem movimentações"}
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {search || filter !== "todos"
                ? "Tente outros filtros ou termos"
                : "Registre sua primeira cautela"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
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
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  list: { padding: 16, paddingTop: 12 },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
    gap: 8,
    marginTop: 20,
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
});
