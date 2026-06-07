CREATE TABLE `employee_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`documentType` varchar(100) NOT NULL,
	`documentNumber` varchar(100),
	`imageUrl` varchar(500) NOT NULL,
	`expiryDate` date,
	`uploadedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_documents_id` PRIMARY KEY(`id`)
);
