import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type StatusCautela = "pendente" | "concluida" | "cancelada";
export type TipoCabinete = "cheio" | "vazio";

export interface Cautela {
  id: string;
  numeroControle: string;
  dataMov: string;
  origemLocal: string;
  booking: string;
  origemData: string;
  origemHorario: string;
  armador: string;
  pesoLiq: string;
  lacreArmador: string;
  obs: string;
  destinoLocal: string;
  destinoData: string;
  destinoHorario: string;
  placaCavalo: string;
  conteiner: string;
  tara: string;
  notasFiscais: string;
  pesoBruto: string;
  tipoCabinete: TipoCabinete;
  transportador: string;
  motorista: string;
  rg: string;
  recebedor: string;
  status: StatusCautela;
  createdAt: string;
}

interface CautelaContextType {
  cauteias: Cautela[];
  addCautela: (data: Omit<Cautela, "id" | "createdAt" | "status">) => void;
  updateStatus: (id: string, status: StatusCautela) => void;
  getCautela: (id: string) => Cautela | undefined;
  stats: {
    total: number;
    pendentes: number;
    concluidas: number;
    canceladas: number;
  };
}

const STORAGE_KEY = "@cautelas_v1";

const CautelaContext = createContext<CautelaContextType | null>(null);

export function CautelaProvider({ children }: { children: React.ReactNode }) {
  const [cauteias, setCauteias] = useState<Cautela[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setCauteias(JSON.parse(raw));
        } catch {
          setCauteias([]);
        }
      }
    });
  }, []);

  const persist = useCallback((list: Cautela[]) => {
    setCauteias(list);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addCautela = useCallback(
    (data: Omit<Cautela, "id" | "createdAt" | "status">) => {
      const newItem: Cautela = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
        status: "pendente",
        createdAt: new Date().toISOString(),
      };
      persist([newItem, ...cauteias]);
    },
    [cauteias, persist]
  );

  const updateStatus = useCallback(
    (id: string, status: StatusCautela) => {
      persist(cauteias.map((c) => (c.id === id ? { ...c, status } : c)));
    },
    [cauteias, persist]
  );

  const getCautela = useCallback(
    (id: string) => cauteias.find((c) => c.id === id),
    [cauteias]
  );

  const stats = {
    total: cauteias.length,
    pendentes: cauteias.filter((c) => c.status === "pendente").length,
    concluidas: cauteias.filter((c) => c.status === "concluida").length,
    canceladas: cauteias.filter((c) => c.status === "cancelada").length,
  };

  return (
    <CautelaContext.Provider value={{ cauteias, addCautela, updateStatus, getCautela, stats }}>
      {children}
    </CautelaContext.Provider>
  );
}

export function useCautela() {
  const ctx = useContext(CautelaContext);
  if (!ctx) throw new Error("useCautela must be used inside CautelaProvider");
  return ctx;
}
