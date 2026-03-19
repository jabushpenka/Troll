CREATE TABLE IF NOT EXISTS "user" (
    "user_id"   SERIAL NOT NULL,
	"name"  varchar(40) NOT NULL UNIQUE,
	"password"	varchar(40) NOT NULL,
	"email"	varchar(40) NOT NULL UNIQUE,
	"photo"	varchar(40),
	PRIMARY KEY("user_id")
);

CREATE TABLE IF NOT EXISTS "board" (
	"board_id"	SERIAL NOT NULL,
	"name"	varchar(40) NOT NULL,
	"address"	varchar(10) NOT NULL UNIQUE,
	"about"	TEXT,
	PRIMARY KEY("board_id")
);

CREATE TABLE IF NOT EXISTS "link" (
	"user_id"	INTEGER NOT NULL,
	"board_id"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","board_id"),
	CONSTRAINT "K2" FOREIGN KEY("board_id") REFERENCES "board"("board_id"),
	CONSTRAINT "K1" FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);