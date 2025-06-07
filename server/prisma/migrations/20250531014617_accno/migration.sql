/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `BankDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_accountNumber_key" ON "BankDetails"("accountNumber");
