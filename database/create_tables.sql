CREATE TABLE "Users" (
    "userID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR UNIQUE,
    "hashedMasterKey" VARCHAR,
    "accountCreationDate" TIMESTAMP DEFAULT NOW(),
    "lastLoginDate" TIMESTAMP DEFAULT NOW(),
    "totpKey" VARCHAR DEFAULT ''
);

CREATE TABLE "Folders" (
    "folderID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "folderName" VARCHAR(256),
    "userID" UUID REFERENCES "Users"("userID")
);

CREATE TABLE "Passwords" (
    "passwordID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "websiteName" VARCHAR(100),
    "username" VARCHAR(256),
    "encryptedPassword" VARCHAR(256),
    "folderID" UUID REFERENCES "Folders"("folderID"),
    "trashBin" BOOLEAN DEFAULT FALSE,
    "deletionDateTime" TIMESTAMP
);

CREATE TABLE "CreditCards" (
    "creditcardID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "cardName" VARCHAR(256),
    "cardholderName" VARCHAR(256),
    "number" VARCHAR(256),
    "expiration" VARCHAR(256),
    "csv" VARCHAR(256),
    "folderID" UUID REFERENCES "Folders"("folderID"),
    "trashBin" BOOLEAN DEFAULT FALSE,
    "deletionDateTime" TIMESTAMP
);

CREATE TABLE "Notes" (
    "noteID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "noteName" VARCHAR(256),
    "content" VARCHAR(1024),
    "folderID" UUID REFERENCES "Folders"("folderID"),
    "trashBin" BOOLEAN DEFAULT FALSE,
    "deletionDateTime" TIMESTAMP
);