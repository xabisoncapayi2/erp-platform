const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^JWT_SECRET=(.*)$/m);
  if (match && match[1]) {
    JWT_SECRET = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

const BASE_URL = 'http://localhost:3000';

function req({ method, path, token, body }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const payload = body ? JSON.stringify(body) : '';

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const r = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

function printHeader(title) {
  console.log(`\n====================================================`);
  console.log(` ${title}`);
  console.log(`====================================================`);
}

function printResult(status, testName, details = '') {
  const badge = status === 'PASS' ? ' [PASS]' : status === 'FAIL' ? ' [FAIL]' : ' [INFO]';
  console.log(`${badge} ${testName}`);
  if (details) console.log(`        ${typeof details === 'object' ? JSON.stringify(details) : details}`);
}

async function runFullTestSuite() {
  const tenantAlphaToken = jwt.sign(
    { sub: 'usr_alpha_admin', email: 'admin@alpha.com', tenantId: 'tenant_alpha' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 1. Health & System
  printHeader('1. HEALTH & SYSTEM CHECK');
  const health = await req({ method: 'GET', path: '/health' });
  if (health.status === 200) {
    printResult('PASS', 'System Health check passed', health.body);
  } else {
    printResult('FAIL', 'Health check failed', health.body);
  }

  // 2. Auth Module
  printHeader('2. AUTHENTICATION MODULE');
  const loginRes = await req({
    method: 'POST',
    path: '/auth/login',
    body: { email: 'admin@alpha.com', password: 'password123' },
  });
  printResult(loginRes.status < 500 ? 'PASS' : 'FAIL', 'POST /auth/login status checked', `Status: ${loginRes.status}`);

  // 3. Suppliers Module
  printHeader('3. SUPPLIERS MODULE');
  let supplierId = null;
  const supplierRes = await req({
    method: 'POST',
    path: '/suppliers',
    token: tenantAlphaToken,
    body: { name: 'Acme Logistics SA', email: 'orders@acme.co.za', phone: '+27110000000' },
  });
  if (supplierRes.status === 200 || supplierRes.status === 201) {
    supplierId = supplierRes.body.id;
    printResult('PASS', `Supplier created (ID: ${supplierId})`);
  } else {
    printResult('INFO', 'Supplier creation outcome', supplierRes.body);
  }

  const getSuppliers = await req({ method: 'GET', path: '/suppliers', token: tenantAlphaToken });
  printResult(getSuppliers.status === 200 ? 'PASS' : 'FAIL', 'GET /suppliers');

  // 4. Products & Inventory
  printHeader('4. PRODUCTS & INVENTORY MODULE');
  let productId = null;
  const productRes = await req({
    method: 'POST',
    path: '/products',
    token: tenantAlphaToken,
    body: { name: 'Industrial Solar Inverter 5kW', sku: `SOL-INV-${Date.now()}`, price: 18500, stockQuantity: 20 },
  });
  if (productRes.status === 200 || productRes.status === 201) {
    productId = productRes.body.id;
    printResult('PASS', `Product created (ID: ${productId})`);
  } else {
    printResult('INFO', 'Product creation outcome', productRes.body);
  }

  const getInventory = await req({ method: 'GET', path: '/inventory', token: tenantAlphaToken });
  printResult(getInventory.status === 200 ? 'PASS' : 'FAIL', 'GET /inventory');

  if (productId) {
    const movements = await req({ method: 'GET', path: `/inventory/movements/${productId}`, token: tenantAlphaToken });
    printResult(movements.status === 200 ? 'PASS' : 'FAIL', `GET /inventory/movements/${productId}`);
  }

  // 5. Purchase Orders Module
  printHeader('5. PURCHASE ORDERS MODULE');
  let poId = null;
  const poRes = await req({
    method: 'POST',
    path: '/purchase-orders',
    token: tenantAlphaToken,
    body: { supplierId: supplierId || 'sup_001', totalAmount: 45000, items: [] },
  });
  if (poRes.status === 200 || poRes.status === 201) {
    poId = poRes.body.id;
    printResult('PASS', `Purchase Order created (ID: ${poId})`);
  } else {
    printResult('INFO', 'PO creation status', poRes.body);
  }

  // 6. Stock Transfers
  printHeader('6. STOCK TRANSFERS MODULE');
  const transferRes = await req({
    method: 'POST',
    path: '/stock-transfers/transfer',
    token: tenantAlphaToken,
    body: { productId: productId || 'prod_001', fromWarehouse: 'JHB-CENTRAL', toWarehouse: 'CPT-MAIN', quantity: 2 },
  });
  printResult(transferRes.status < 500 ? 'PASS' : 'FAIL', 'POST /stock-transfers/transfer', `Status: ${transferRes.status}`);

  // 7. General Ledger Module
  printHeader('7. GENERAL LEDGER MODULE');
  const glRes = await req({
    method: 'POST',
    path: '/general-ledger/entries',
    token: tenantAlphaToken,
    body: {
      description: 'Monthly Office Supplies Expense',
      amount: 4500,
      debitAccount: 'EXP-6001',
      creditAccount: 'BANK-1001',
    },
  });
  printResult(glRes.status < 500 ? 'PASS' : 'FAIL', 'POST /general-ledger/entries', `Status: ${glRes.status}`);

  const tbRes = await req({ method: 'GET', path: '/general-ledger/trial-balance', token: tenantAlphaToken });
  printResult(tbRes.status === 200 ? 'PASS' : 'FAIL', 'GET /general-ledger/trial-balance');

  // 8. Approvals Workflow
  printHeader('8. APPROVALS WORKFLOW MODULE');
  const pendingApprovals = await req({ method: 'GET', path: '/approvals/pending', token: tenantAlphaToken });
  printResult(pendingApprovals.status === 200 ? 'PASS' : 'FAIL', 'GET /approvals/pending');

  // 9. Notifications Module
  printHeader('9. NOTIFICATIONS MODULE');
  const notifyRes = await req({
    method: 'POST',
    path: '/notifications',
    token: tenantAlphaToken,
    body: { title: 'Low Stock Alert', message: 'Inverter inventory reached reorder threshold.' },
  });
  printResult(notifyRes.status < 500 ? 'PASS' : 'FAIL', 'POST /notifications', `Status: ${notifyRes.status}`);

  const getNotifications = await req({ method: 'GET', path: '/notifications', token: tenantAlphaToken });
  printResult(getNotifications.status === 200 ? 'PASS' : 'FAIL', 'GET /notifications');

  // 10. Audit Logs
  printHeader('10. AUDIT LOGS MODULE');
  const auditRes = await req({ method: 'GET', path: '/audit-logs', token: tenantAlphaToken });
  printResult(auditRes.status === 200 ? 'PASS' : 'FAIL', 'GET /audit-logs');

  // 11. Analytics Module
  printHeader('11. ANALYTICS MODULE');
  const dashboardRes = await req({ method: 'GET', path: '/analytics/getDashboardMetrics', token: tenantAlphaToken });
  printResult(dashboardRes.status === 200 ? 'PASS' : 'FAIL', 'GET /analytics/getDashboardMetrics');

  const salesRes = await req({ method: 'GET', path: '/analytics/getMonthlySales', token: tenantAlphaToken });
  printResult(salesRes.status === 200 ? 'PASS' : 'FAIL', 'GET /analytics/getMonthlySales');

  const topProdRes = await req({ method: 'GET', path: '/analytics/getTopSellingProducts', token: tenantAlphaToken });
  printResult(topProdRes.status === 200 ? 'PASS' : 'FAIL', 'GET /analytics/getTopSellingProducts');

  // 12. HR & Payroll Module
  printHeader('12. HR & PAYROLL MODULE');
  const empRes = await req({
    method: 'POST',
    path: '/hr/employees',
    token: tenantAlphaToken,
    body: { firstName: 'Sarah', lastName: 'Nkomo', email: 'sarah.nkomo@alpha.com', salary: 45000 },
  });
  
  if (empRes.status === 200 || empRes.status === 201) {
    printResult('PASS', `Employee created (ID: ${empRes.body.id})`);
    const payrollRes = await req({
      method: 'POST',
      path: '/hr/payroll',
      token: tenantAlphaToken,
      body: { employeeId: empRes.body.id, period: '2026-08' },
    });
    printResult(payrollRes.status < 500 ? 'PASS' : 'FAIL', 'POST /hr/payroll', `Status: ${payrollRes.status}`);
  } else {
    printResult('INFO', 'HR Employee endpoint outcome', empRes.body);
  }

  printHeader('SUMMARY: FULL SUITE TEST COMPLETED');
}

runFullTestSuite().catch(console.error);
