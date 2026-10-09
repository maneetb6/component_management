import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const componentStatus = pgEnum("component_status", [
  "available",
  "in_use",
  "ordered",
  "broken",
]);

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  partNumber: text("part_number"),
  subsystem: text("subsystem"),
  quantity: integer("quantity").notNull().default(0),
  location: text("location"),
  status: componentStatus("status").notNull().default("available"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
