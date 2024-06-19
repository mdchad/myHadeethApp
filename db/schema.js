import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  number: integer("number"),
  bookTitle: text("book_title"),
  content: text("content", { mode: "json" }),
  volumeTitle: text("volume_title", { mode: "json" }),
  chapterTitle: text("chapter_title", { mode: "json" }),
  chapterTransliteration: text("chapter_transliteration", { mode: "json" }),
  chapterMetaData: text("chapter_metadata", { mode: "json" }),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at"),
})