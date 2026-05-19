import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { StatusCautela } from "@/contexts/CautelaContext";
import { useCautela } from "@/contexts/CautelaContext";
import { useColors } from "@/hooks/useColors";

const STATUS_CONFIG: Record<StatusCautela, { label: string; color: string; icon: string }> = {
  pendente: { label: "Pendente", color: "#f59e0b", icon: "clock" },
  concluida: { label: "Concluída", color: "#22c55e", icon: "check-circle" },
  cancelada: { label: "Cancelada", color: "#ef4444", icon: "x-circle" },
};

function InfoRow({ label, value }: { label: string; value?: string }) {
  const colors = useColors();
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.sectionHeader, { backgroundColor: colors.primary }]}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function CautelaDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCautela, updateStatus } = useCautela();
  const cautela = getCautela(id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  if (!cautela) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
          Cautela não encontrada
        </Text>
      </View>
    );
  }

  const { label, color } = STATUS_CONFIG[cautela.status];

  function handleStatus(status: StatusCautela) {
    const msg = status === "concluida" ? "Marcar como concluída?" : "Cancelar esta cautela?";
    Alert.alert("Confirmar", msg, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: status === "cancelada" ? "destructive" : "default",
        onPress: () => {
          updateStatus(cautela!.id, status);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 16 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>#{cautela.numeroControle}</Text>
          <View style={[styles.badge, { backgroundColor: color + "30" }]}>
            <Text style={[styles.badgeText, { color }]}>{label}</Text>
          </View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="IDENTIFICAÇÃO">
          <InfoRow label="Nº de Controle" value={cautela.numeroControle} />
          <InfoRow label="Data da Movimentação" value={cautela.dataMov} />
        </Section>

        <Section title="ORIGEM">
          <InfoRow label="Local" value={cautela.origemLocal} />
          <InfoRow label="Booking" value={cautela.booking} />
          <InfoRow label="Data / Horário" value={[cautela.origemData, cautela.origemHorario].filter(Boolean).join(" às ")} />
          <InfoRow label="Armador" value={cautela.armador} />
          <InfoRow label="Peso Líq." value={cautela.pesoLiq ? cautela.pesoLiq + " kg" : undefined} />
          <InfoRow label="Lacre (Armador)" value={cautela.lacreArmador} />
          <InfoRow label="OBS" value={cautela.obs} />
        </Section>

        <Section title="DESTINO">
          <InfoRow label="Local" value={cautela.destinoLocal} />
          <InfoRow label="Data / Horário" value={[cautela.destinoData, cautela.destinoHorario].filter(Boolean).join(" às ")} />
          <InfoRow label="Placa (Cavalo)" value={cautela.placaCavalo} />
          <InfoRow label="Contêiner" value={cautela.conteiner} />
          <InfoRow label="Tara" value={cautela.tara ? cautela.tara + " kg" : undefined} />
          <InfoRow label="Peso Bruto" value={cautela.pesoBruto ? cautela.pesoBruto + " kg" : undefined} />
          <InfoRow label="Nota(s) Fiscal(is)" value={cautela.notasFiscais} />
          <InfoRow
            label="Tipo de Cabinete"
            value={cautela.tipoCabinete === "cheio" ? "Cheio" : "Vazio"}
          />
        </Section>

        <Section title="TRANSPORTADOR">
          <InfoRow label="Transportador" value={cautela.transportador} />
          <InfoRow label="Motorista" value={cautela.motorista} />
          <InfoRow label="RG" value={cautela.rg} />
          <InfoRow label="Recebedor" value={cautela.recebedor} />
        </Section>

        {cautela.status === "pendente" && (
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#22c55e" }]}
              onPress={() => handleStatus("concluida")}
            >
              <Feather name="check-circle" size={18} color="#fff" />
              <Text style={styles.actionText}>Marcar Concluída</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#ef4444" }]}
              onPress={() => handleStatus("cancelada")}
            >
              <Feather name="x-circle" size={18} color="#fff" />
              <Text style={styles.actionText}>Cancelar</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center", gap: 6 },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  content: { padding: 16, gap: 14 },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.9)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: { padding: 14, gap: 2 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    textAlign: "right",
  },
  actions: { gap: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 13,
  },
  actionText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
