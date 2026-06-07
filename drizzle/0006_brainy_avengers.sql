CREATE TABLE `approval_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`approvalId` int NOT NULL,
	`fieldName` varchar(100) NOT NULL,
	`oldValue` text,
	`newValue` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `approval_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `approvals` ADD `priority` enum('low','medium','high') DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `approvals` ADD `dueDate` timestamp;--> statement-breakpoint
ALTER TABLE `approvals` ADD `rejectionReason` text;--> statement-breakpoint
ALTER TABLE `approval_details` ADD CONSTRAINT `approval_details_approvalId_approvals_id_fk` FOREIGN KEY (`approvalId`) REFERENCES `approvals`(`id`) ON DELETE no action ON UPDATE no action;