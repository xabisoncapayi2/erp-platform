#!/usr/bin/env bash
set -e

echo "1. Fixing prisma.config.ts..."
cat << 'INNER_EOF' > prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/erp_db?schema=public',
  },
});
INNER_EOF

echo "2. Writing updated prisma/schema.prisma..."
cat << 'INNER_EOF' > prisma/schema.prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// ENUMS
// ==========================================

enum PurchaseOrderStatus {
  DRAFT
  SUBMITTED
  PENDING_APPROVAL
  APPROVED
  REJECTED
  RECEIVED
  CANCELLED
}

enum SalesOrderStatus {
  DRAFT
  APPROVED
  FULFILLED
  CANCELLED
}

enum StockTransferStatus {
  PENDING
  COMPLETED
  CANCELLED
}

enum InvoiceStatus {
  UNPAID
  PARTIALLY_PAID
  PAID
  OVERDUE
}

enum AccountType {
  ASSET
  LIABILITY
  EQUITY
  REVENUE
  EXPENSE
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ApprovableEntity {
  PURCHASE_ORDER
  SALES_ORDER
  LEAVE_REQUEST
  GENERAL
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

enum NotificationType {
  LOW_STOCK
  APPROVAL_PENDING
  PO_RECEIVED
  INVOICE_OVERDUE
  GENERAL
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  STATUS_CHANGE
}

enum MovementReason {
  PURCHASE_RECEIPT
  SALES_SHIPMENT
  ADJUSTMENT
  TRANSFER
}

enum SupplierInvoiceStatus {
  DRAFT
  PENDING
  APPROVED
  REJECTED
  PAID
}

enum JournalEntryStatus {
  DRAFT
  POSTED
  CANCELLED
}

// ==========================================
// CORE DOMAIN MODELS
// ==========================================

model Tenant {
  id        String   @id @default(uuid())
  slug      String   @unique
  name      String
  createdAt DateTime @default(now())

  users               User[]
  warehouses          Warehouse[]
  products            Product[]
  suppliers           Supplier[]
  customers           Customer[]
  purchaseOrders      PurchaseOrder[]
  salesOrders         SalesOrder[]
  accounts            Account[]
  approvalConfigs     ApprovalConfig[]
  supplierInvoices    SupplierInvoice[]
  generalLedgerEntries GeneralLedgerEntry[]
  stockTransfers      StockTransfer[]
}

model User {
  id           String   @id @default(uuid())
  tenantId     String
  email        String   @unique
  passwordHash String
  firstName    String   @default("")
  lastName     String   @default("")
  roles        String[] @default([])
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
}

model Warehouse {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  location  String?
  createdAt DateTime @default(now())

  tenant            Tenant          @relation(fields: [tenantId], references: [id])
  inventoryItems    InventoryItem[]
  purchaseOrders    PurchaseOrder[]
  salesOrders       SalesOrder[]
  outgoingTransfers StockTransfer[] @relation("SourceWarehouse")
  incomingTransfers StockTransfer[] @relation("DestWarehouse")

  @@index([tenantId])
}

model Product {
  id          String   @id @default(uuid())
  tenantId    String
  sku         String   @unique
  name        String
  description String?
  unitPrice   Decimal  @db.Decimal(12, 2)
  unitCost    Decimal  @default(0) @db.Decimal(12, 2)
  createdAt   DateTime @default(now())

  tenant               Tenant                @relation(fields: [tenantId], references: [id])
  inventoryItems       InventoryItem[]
  poLines              PurchaseOrderLine[]
  soLines              SalesOrderLine[]
  supplierInvoiceLines SupplierInvoiceLine[]
  stockTransfers       StockTransfer[]

  @@index([tenantId])
}

model InventoryItem {
  id             String   @id @default(uuid())
  tenantId       String
  warehouseId    String
  productId      String
  quantityOnHand Int      @default(0)
  reorderLevel   Int      @default(10)
  unitCost       Decimal  @db.Decimal(12, 2)
  updatedAt      DateTime @updatedAt

  warehouse Warehouse @relation(fields: [warehouseId], references: [id])
  product   Product   @relation(fields: [productId], references: [id])

  movements InventoryMovement[]

  @@unique([warehouseId, productId], name: "productId_warehouseId")
  @@index([tenantId])
}

model InventoryMovement {
  id              String         @id @default(uuid())
  tenantId        String
  inventoryItemId String
  quantityChange  Int
  referenceType   String
  referenceId     String
  reason          MovementReason @default(ADJUSTMENT)
  createdAt       DateTime       @default(now())

  inventoryItem InventoryItem @relation(fields: [inventoryItemId], references: [id])

  @@index([tenantId])
}

model Supplier {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  email     String
  phone     String?
  address   String?
  createdAt DateTime @default(now())

  tenant           Tenant            @relation(fields: [tenantId], references: [id])
  purchaseOrders   PurchaseOrder[]
  supplierInvoices SupplierInvoice[]

  @@index([tenantId])
}

model PurchaseOrder {
  id          String              @id @default(uuid())
  tenantId    String
  supplierId  String
  warehouseId String
  status      PurchaseOrderStatus @default(DRAFT)
  totalAmount Decimal             @db.Decimal(12, 2)
  createdAt   DateTime            @default(now())

  tenant           Tenant              @relation(fields: [tenantId], references: [id])
  supplier         Supplier            @relation(fields: [supplierId], references: [id])
  warehouse        Warehouse           @relation(fields: [warehouseId], references: [id])
  lines            PurchaseOrderLine[]
  supplierInvoices SupplierInvoice[]

  @@index([tenantId])
}

model PurchaseOrderLine {
  id               String  @id @default(uuid())
  purchaseOrderId  String
  productId        String
  quantity         Int     @default(0)
  quantityOrdered  Int     @default(0)
  quantityReceived Int     @default(0)
  unitPrice        Decimal @default(0) @db.Decimal(12, 2)
  unitCost         Decimal @default(0) @db.Decimal(12, 2)

  purchaseOrder        PurchaseOrder         @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product              Product               @relation(fields: [productId], references: [id])
  supplierInvoiceLines SupplierInvoiceLine[]
}

model Customer {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  email     String
  phone     String?
  createdAt DateTime @default(now())

  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  salesOrders SalesOrder[]

  @@index([tenantId])
}

model SalesOrder {
  id          String           @id @default(uuid())
  tenantId    String
  customerId  String
  warehouseId String?
  status      SalesOrderStatus @default(DRAFT)
  totalAmount Decimal          @db.Decimal(12, 2)
  fulfilledAt DateTime?
  createdAt   DateTime         @default(now())

  tenant    Tenant           @relation(fields: [tenantId], references: [id])
  customer  Customer         @relation(fields: [customerId], references: [id])
  warehouse Warehouse?       @relation(fields: [warehouseId], references: [id])
  lines     SalesOrderLine[]
  invoices  Invoice[]

  @@index([tenantId])
}

model SalesOrderLine {
  id           String  @id @default(uuid())
  salesOrderId String
  productId    String
  quantity     Int
  unitPrice    Decimal @db.Decimal(12, 2)

  salesOrder SalesOrder @relation(fields: [salesOrderId], references: [id], onDelete: Cascade)
  product    Product    @relation(fields: [productId], references: [id])
}

model StockTransfer {
  id                String              @id @default(uuid())
  tenantId          String
  sourceWarehouseId String
  destWarehouseId   String
  productId         String
  quantity          Int
  status            StockTransferStatus @default(PENDING)
  completedAt       DateTime?
  createdAt         DateTime            @default(now())

  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  sourceWarehouse Warehouse @relation("SourceWarehouse", fields: [sourceWarehouseId], references: [id])
  destWarehouse   Warehouse @relation("DestWarehouse", fields: [destWarehouseId], references: [id])
  product         Product   @relation(fields: [productId], references: [id])

  @@index([tenantId])
}

model Invoice {
  id           String        @id @default(uuid())
  tenantId     String
  salesOrderId String
  amount       Decimal       @db.Decimal(12, 2)
  status       InvoiceStatus @default(UNPAID)
  dueDate      DateTime
  createdAt    DateTime      @default(now())

  salesOrder SalesOrder @relation(fields: [salesOrderId], references: [id])

  @@index([tenantId])
}

model SupplierInvoice {
  id              String                @id @default(uuid())
  tenantId        String
  supplierId      String
  purchaseOrderId String?
  invoiceNumber   String                @default("")
  status          SupplierInvoiceStatus @default(DRAFT)
  totalAmount     Decimal               @db.Decimal(12, 2)
  createdAt       DateTime              @default(now())

  tenant        Tenant                @relation(fields: [tenantId], references: [id])
  supplier      Supplier              @relation(fields: [supplierId], references: [id])
  purchaseOrder PurchaseOrder?        @relation(fields: [purchaseOrderId], references: [id])
  lines         SupplierInvoiceLine[]

  @@index([tenantId])
}

model SupplierInvoiceLine {
  id                  String  @id @default(uuid())
  supplierInvoiceId   String
  purchaseOrderLineId String?
  productId           String
  quantity            Int
  unitPrice           Decimal @db.Decimal(12, 2)

  supplierInvoice   SupplierInvoice    @relation(fields: [supplierInvoiceId], references: [id], onDelete: Cascade)
  purchaseOrderLine PurchaseOrderLine? @relation(fields: [purchaseOrderLineId], references: [id])
  product           Product            @relation(fields: [productId], references: [id])
}

// ==========================================
// GENERAL LEDGER & APPROVALS
// ==========================================

model Account {
  id        String      @id @default(uuid())
  tenantId  String
  code      String
  name      String
  type      AccountType
  createdAt DateTime    @default(now())

  tenant  Tenant         @relation(fields: [tenantId], references: [id])
  entries JournalEntry[]

  @@unique([tenantId, code])
}

model JournalHeader {
  id          String             @id @default(uuid())
  tenantId    String
  description String
  status      JournalEntryStatus @default(POSTED)
  postedAt    DateTime           @default(now())

  entries JournalEntry[]

  @@index([tenantId])
}

model JournalEntry {
  id              String  @id @default(uuid())
  journalHeaderId String
  accountId       String
  debit           Decimal @default(0) @db.Decimal(12, 2)
  credit          Decimal @default(0) @db.Decimal(12, 2)

  header  JournalHeader @relation(fields: [journalHeaderId], references: [id], onDelete: Cascade)
  account Account       @relation(fields: [accountId], references: [id])
}

model GeneralLedgerEntry {
  id          String              @id @default(uuid())
  tenantId    String
  description String
  postedAt    DateTime            @default(now())

  tenant Tenant              @relation(fields: [tenantId], references: [id])
  lines  GeneralLedgerLine[]

  @@index([tenantId])
}

model GeneralLedgerLine {
  id                   String  @id @default(uuid())
  generalLedgerEntryId String
  accountId            String?
  accountCode          String
  debit                Decimal @default(0) @db.Decimal(12, 2)
  credit               Decimal @default(0) @db.Decimal(12, 2)

  generalLedgerEntry GeneralLedgerEntry @relation(fields: [generalLedgerEntryId], references: [id], onDelete: Cascade)
}

model ApprovalConfig {
  id              String  @id @default(uuid())
  tenantId        String
  entityType      String
  thresholdAmount Decimal @db.Decimal(12, 2)
  requiredRole    String

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
}

model ApprovalRequest {
  id                   String           @id @default(uuid())
  tenantId             String
  entityType           ApprovableEntity
  entityId             String
  requestedById        String
  requesterId          String           @default("")
  approverRoleRequired String           @default("")
  approverRole         String           @default("")
  decidedById          String?
  reason               String?
  status               ApprovalStatus   @default(PENDING)
  decidedAt            DateTime?
  createdAt            DateTime         @default(now())

  @@index([tenantId])
  @@index([entityType, entityId])
  @@index([status])
}

// ==========================================
// EXTENSION MODULES
// ==========================================

model Employee {
  id             String         @id @default(uuid())
  tenantId       String
  firstName      String
  lastName       String
  email          String
  idNumber       String
  employmentType EmploymentType
  grossSalary    Decimal        @db.Decimal(12, 2)
  leaveBalance   Int            @default(20)
  createdAt      DateTime       @default(now())

  leaveRequests LeaveRequest[]
  paySlips      PaySlip[]

  @@index([tenantId])
}

model LeaveRequest {
  id            String      @id @default(uuid())
  tenantId      String
  employeeId    String
  startDate     DateTime
  endDate       DateTime
  days          Int         @default(0)
  daysRequested Int         @default(0)
  leaveType     String      @default("ANNUAL")
  status        LeaveStatus @default(PENDING)
  reason        String?
  approvedById  String?
  processedAt   DateTime?
  createdAt     DateTime    @default(now())

  employee Employee @relation(fields: [employeeId], references: [id])

  @@index([tenantId])
  @@index([employeeId])
}

model PaySlip {
  id          String   @id @default(uuid())
  tenantId    String
  employeeId  String
  period      String
  grossSalary Decimal  @db.Decimal(12, 2)
  payeTax     Decimal  @db.Decimal(12, 2)
  uifEmployee Decimal  @db.Decimal(12, 2)
  uifEmployer Decimal  @db.Decimal(12, 2)
  netSalary   Decimal  @db.Decimal(12, 2)
  createdAt   DateTime @default(now())

  employee Employee @relation(fields: [employeeId], references: [id])

  @@index([tenantId])
}

model AuditLog {
  id         String   @id @default(uuid())
  tenantId   String
  userId     String?
  entityType String
  entityId   String
  action     String
  actorId    String   @default("")
  beforeData Json?
  afterData  Json?
  createdAt  DateTime @default(now())

  @@index([tenantId])
  @@index([createdAt])
}

model Notification {
  id        String           @id @default(uuid())
  tenantId  String
  userId    String?
  type      NotificationType
  message   String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([tenantId])
  @@index([userId])
}
INNER_EOF

echo "3. Regenerating Prisma Client..."
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_db?schema=public"
npx prisma generate

echo "4. Resetting Database Schema..."
npx prisma migrate reset --force

echo "Done! Running dev build check..."
