CREATE TABLE `psychological_test_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320),
	`psychologicalType` varchar(4) NOT NULL,
	`answers` json NOT NULL,
	`scores` json NOT NULL,
	`ipAddress` varchar(45),
	`sentToUserEmail` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `psychological_test_results_id` PRIMARY KEY(`id`)
);
