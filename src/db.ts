import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { contacts } from "./schema";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export type Contact = typeof contacts.$inferSelect;

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

export const getAllContacts = () => {
  return db.select().from(contacts);
};

export const getContactById = (id: number) => {
  return db.query.contacts.findFirst({ where: eq(contacts.id, id) });
};

export const editContact = (id: number, updatedContact: Partial<Contact>) => {
  return db.update(contacts).set(updatedContact).where(eq(contacts.id, id));
};

export const deleteContactById = (id: number) => {
  return db.delete(contacts).where(eq(contacts.id, id));
};
