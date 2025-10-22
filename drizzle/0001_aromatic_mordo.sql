CREATE TABLE `dashboards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`datasetId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`config` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dashboards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`fileName` varchar(255) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`columns` json NOT NULL,
	`rowCount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
