const http = require('http');
const fs = require('fs');
const path = require('path');
const { io } = require('socket.io-client');
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

function sendRequest({ method, path, token, body }) {
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

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      },
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('       STARTING INTEGRATION & SECURITY DEMO TEST    ');
  console.log('====================================================\n');

  const tenant1Token = jwt.sign(
    { sub: 'usr_001', email: 'admin@tenant1.com', tenantId: 'tenant_alpha' },
    JWT_SECRET,
    { expiresIn: '1h' },
  );

  const tenant2Token = jwt.sign(
    { sub: 'usr_002', email: 'admin@tenant2.com', tenantId: 'tenant_beta' },
    JWT_SECRET,
    { expiresIn: '1h' },
  );

  console.log('[TEST 1] Multi-Tenant Security & Guard Enforcement');

  const unauthRes = await sendRequest({ method: 'GET', path: '/hr/employees' });
  if (unauthRes.status === 401) {
    console.log('  [PASS] Missing token correctly rejected with 401 Unauthorized.');
  } else {
    console.log(`  [FAIL] Expected 401, got ${unauthRes.status}`);
  }

  const createEmpRes = await sendRequest({
    method: 'POST',
    path: '/hr/employees',
    token: tenant1Token,
    body: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@tenant1.com',
      salary: 30000,
      department: 'Engineering',
      position: 'Developer',
    },
  });

  let createdEmployeeId = null;
  if (createEmpRes.status === 201 || createEmpRes.status === 200) {
    createdEmployeeId = createEmpRes.body.id;
    console.log(`  [PASS] Employee created for Tenant Alpha (ID: ${createdEmployeeId})`);
  } else {
    console.log('  [FAIL] Employee creation failed:', createEmpRes.body);
  }

  if (createdEmployeeId) {
    const crossTenantRes = await sendRequest({
      method: 'GET',
      path: `/hr/employees/${createdEmployeeId}`,
      token: tenant2Token,
    });

    if (crossTenantRes.status === 404) {
      console.log('  [PASS] Tenant Beta cannot access Tenant Alpha data (Fail-closed isolation verified).');
    } else {
      console.log(`  [FAIL] Cross-tenant response status: ${crossTenantRes.status}`);
    }
  }

  console.log('\n----------------------------------------------------\n');

  console.log('[TEST 2] South African Tax & Payroll Calculation');

  if (createdEmployeeId) {
    const payrollRes = await sendRequest({
      method: 'POST',
      path: '/hr/payroll',
      token: tenant1Token,
      body: {
        employeeId: createdEmployeeId,
        period: '2026-08',
      },
    });

    if (payrollRes.status === 201 || payrollRes.status === 200) {
      const ps = payrollRes.body;
      const payeVal = ps.paye ?? ps.payeTax ?? ps.tax ?? 0;
      const uifVal = ps.uif ?? ps.uifDeduction ?? ps.uifEmployee ?? 0;
      const grossVal = ps.grossSalary ?? ps.salary ?? 0;
      const netVal = ps.netPay ?? ps.netSalary ?? 0;
      const deductionsVal = ps.deductions ?? (payeVal + uifVal);

      console.log('  [INFO] Payslip Generated:', {
        grossSalary: grossVal,
        paye: payeVal,
        uif: uifVal,
        deductions: deductionsVal,
        netPay: netVal,
      });

      const isPayeCorrect = Math.abs(payeVal - 4783.08) < 1.0;
      const isUifCorrect = uifVal === 177.12;

      if (isPayeCorrect && isUifCorrect) {
        console.log('  [PASS] SA Tax (PAYE with Rebate) and UIF (Capped at 177.12) accurately calculated.');
      } else {
        console.log('  [FAIL] Tax calculation mismatch.');
      }
    } else {
      console.log('  [FAIL] Payroll process call failed:', payrollRes.body);
    }
  }

  console.log('\n----------------------------------------------------\n');

  console.log('[TEST 3] WebSocket JWT Handshake Verification');

  await new Promise((resolve) => {
    const unauthSocket = io('http://localhost:3000/ws/notifications', {
      transports: ['websocket'],
      reconnection: false,
    });

    unauthSocket.on('connect_error', () => {
      console.log('  [PASS] Unauthenticated WebSocket connection rejected on handshake.');
      unauthSocket.disconnect();
      resolve();
    });

    unauthSocket.on('disconnect', () => {
      console.log('  [PASS] Unauthenticated WebSocket connection disconnected.');
      resolve();
    });

    setTimeout(() => {
      if (unauthSocket.connected) {
        console.log('  [FAIL] Unauthenticated socket was allowed to connect.');
        unauthSocket.disconnect();
      }
      resolve();
    }, 1000);
  });

  await new Promise((resolve) => {
    const authSocket = io('http://localhost:3000/ws/notifications', {
      transports: ['websocket'],
      auth: { token: tenant1Token },
      reconnection: false,
    });

    authSocket.on('connected', (data) => {
      console.log('  [PASS] Authenticated WebSocket connected successfully.');
      console.log('  [INFO] Connection Payload:', data);
      authSocket.disconnect();
      resolve();
    });

    authSocket.on('connect_error', (err) => {
      console.log('  [FAIL] Authenticated socket failed to connect:', err.message);
      authSocket.disconnect();
      resolve();
    });

    setTimeout(() => {
      authSocket.disconnect();
      resolve();
    }, 2000);
  });

  console.log('\n====================================================');
  console.log('             TEST SUITE COMPLETE                    ');
  console.log('====================================================');
}

runTestSuite().catch(console.error);
