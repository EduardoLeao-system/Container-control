import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cautelasTable = pgTable("cautelas", {
  id: text("id").primaryKey(),
  numeroControle: text("numero_controle").notNull(),
  dataMov: text("data_mov").notNull(),
  origemLocal: text("origem_local").notNull(),
  booking: text("booking").notNull().default(""),
  origemData: text("origem_data").notNull(),
  origemHorario: text("origem_horario").notNull(),
  armador: text("armador").notNull().default(""),
  pesoLiq: text("peso_liq").notNull().default(""),
  lacreArmador: text("lacre_armador").notNull().default(""),
  obs: text("obs").notNull().default(""),
  destinoLocal: text("destino_local").notNull(),
  destinoData: text("destino_data").notNull(),
  destinoHorario: text("destino_horario").notNull(),
  placaCavalo: text("placa_cavalo").notNull(),
  conteiner: text("conteiner").notNull(),
  tara: text("tara").notNull().default(""),
  notasFiscais: text("notas_fiscais").notNull().default(""),
  pesoBruto: text("peso_bruto").notNull().default(""),
  tipoCabinete: text("tipo_cabinete", { enum: ["cheio", "vazio"] }).notNull().default("cheio"),
  transportador: text("transportador").notNull().default(""),
  motorista: text("motorista").notNull().default(""),
  rg: text("rg").notNull().default(""),
  recebedor: text("recebedor").notNull().default(""),
  status: text("status", { enum: ["pendente", "concluida", "cancelada"] }).notNull().default("pendente"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCautelaSchema = createInsertSchema(cautelasTable).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const selectCautelaSchema = createSelectSchema(cautelasTable);

export const updateStatusSchema = z.object({
  status: z.enum(["pendente", "concluida", "cancelada"]),
});

export type InsertCautela = z.infer<typeof insertCautelaSchema>;
export type Cautela = typeof cautelasTable.$inferSelect;
