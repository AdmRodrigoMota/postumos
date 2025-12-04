CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('profile_created','message_posted','photo_added') NOT NULL,
	`memorialId` int NOT NULL,
	`userId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memorial_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memorialId` int NOT NULL,
	`authorId` int,
	`authorName` varchar(255),
	`content` text NOT NULL,
	`isReported` boolean NOT NULL DEFAULT false,
	`isHidden` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `memorial_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memorial_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memorialId` int NOT NULL,
	`uploadedBy` int NOT NULL,
	`photoUrl` text NOT NULL,
	`photoKey` text NOT NULL,
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `memorial_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memorial_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`photoUrl` text,
	`photoKey` text,
	`birthDate` timestamp,
	`deathDate` timestamp,
	`biography` text,
	`visitCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memorial_profiles_id` PRIMARY KEY(`id`)
);
