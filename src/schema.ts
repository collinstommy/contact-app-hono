import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").notNull(),
  phone: text("phone"),
});
