CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer,
	`book_title` text,
	`content` text,
	`volume_title` text,
	`chapter_title` text,
	`chapter_transliteration` text,
	`chapter_metadata` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
