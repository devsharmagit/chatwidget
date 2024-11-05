/*
  Warnings:

  - You are about to drop the column `chatbotId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `chatbotId` on the `Visitor` table. All the data in the column will be lost.
  - Added the required column `chatwidgetId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatwidgetId` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatbotId_fkey";

-- DropForeignKey
ALTER TABLE "Visitor" DROP CONSTRAINT "Visitor_chatbotId_fkey";

-- AlterTable
ALTER TABLE "Chatwidget" ALTER COLUMN "trustedOrigins" SET DEFAULT ARRAY['http://localhost:3000', 'http://localhost:5173']::TEXT[];

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatbotId",
ADD COLUMN     "chatwidgetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "chatbotId",
ADD COLUMN     "chatwidgetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_chatwidgetId_fkey" FOREIGN KEY ("chatwidgetId") REFERENCES "Chatwidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatwidgetId_fkey" FOREIGN KEY ("chatwidgetId") REFERENCES "Chatwidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
