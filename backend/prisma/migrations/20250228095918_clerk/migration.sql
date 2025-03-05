-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkuserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkuserId_key" ON "User"("clerkuserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
