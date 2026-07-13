-- CreateTable
CREATE TABLE "CliTokenBlocklist" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CliTokenBlocklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceCode" (
    "id" TEXT NOT NULL,
    "deviceCode" TEXT NOT NULL,
    "userCode" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "authorizedAt" TIMESTAMP(3),

    CONSTRAINT "DeviceCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CliTokenBlocklist_jti_key" ON "CliTokenBlocklist"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceCode_deviceCode_key" ON "DeviceCode"("deviceCode");

-- AddForeignKey
ALTER TABLE "DeviceCode" ADD CONSTRAINT "DeviceCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
