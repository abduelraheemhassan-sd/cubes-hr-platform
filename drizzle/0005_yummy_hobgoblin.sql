CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`module` varchar(50) NOT NULL,
	`targetId` int,
	`targetType` varchar(50),
	`oldValues` text,
	`newValues` text,
	`details` text,
	`ipAddress` varchar(50),
	`userAgent` text,
	`status` enum('success','failure') DEFAULT 'success',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
