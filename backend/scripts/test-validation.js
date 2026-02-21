/**
 * Test input validation for pending and reports routes.
 * Run: node scripts/test-validation.js
 *
 * Option 1: Unit test (no server needed) - validates the validation logic
 * Option 2: Integration test - requires backend running on port 5002
 */

const PORT = process.env.PORT || 5002;
const API_BASE = `http://localhost:${PORT}`;

async function curl(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (e) { json = { raw: text }; }
  return { status: res.status, data: json };
}

async function runTests() {
  console.log(`Testing input validation (backend must be running on port ${PORT})\n`);

  let passed = 0;
  let failed = 0;

  // --- Pending POST tests ---

  // 1. Invalid type
  const r1 = await curl('POST', '/api/pending', {
    date: '2025-02-19',
    type: 'invalid_field',
    value: 50
  });
  if (r1.status === 400 && r1.data.message && r1.data.message.toLowerCase().includes('invalid')) {
    console.log('✓ Pending: invalid type → 400');
    passed++;
  } else {
    console.log('✗ Pending: invalid type - expected 400, got', r1.status, r1.data);
    failed++;
  }

  // 2. Value out of range (negative)
  const r2 = await curl('POST', '/api/pending', {
    date: '2025-02-19',
    type: 'largeGroupChurch',
    value: -10
  });
  if (r2.status === 400) {
    console.log('✓ Pending: negative value → 400');
    passed++;
  } else {
    console.log('✗ Pending: negative value - expected 400, got', r2.status, r2.data);
    failed++;
  }

  // 3. Missing date
  const r3 = await curl('POST', '/api/pending', {
    type: 'largeGroupChurch',
    value: 50
  });
  if (r3.status === 400) {
    console.log('✓ Pending: missing date → 400');
    passed++;
  } else {
    console.log('✗ Pending: missing date - expected 400, got', r3.status);
    failed++;
  }

  // 4. Invalid date format
  const r4 = await curl('POST', '/api/pending', {
    date: 'not-a-date',
    type: 'largeGroupChurch',
    value: 50
  });
  if (r4.status === 400) {
    console.log('✓ Pending: invalid date format → 400');
    passed++;
  } else {
    console.log('✗ Pending: invalid date format - expected 400, got', r4.status);
    failed++;
  }

  // --- Reports POST tests ---

  // 5. Missing date
  const r5 = await curl('POST', '/api/reports', {
    largeGroupChurch: 50
  });
  if (r5.status === 400) {
    console.log('✓ Reports: missing date → 400');
    passed++;
  } else {
    console.log('✗ Reports: missing date - expected 400, got', r5.status);
    failed++;
  }

  // 6. Invalid numeric (string instead of number)
  const r6 = await curl('POST', '/api/reports', {
    date: '2025-02-19',
    largeGroupChurch: 'not-a-number'
  });
  if (r6.status === 400) {
    console.log('✓ Reports: invalid numeric → 400');
    passed++;
  } else {
    console.log('✗ Reports: invalid numeric - expected 400, got', r6.status);
    failed++;
  }

  // 7. Comment too long (> 500 chars)
  const r7 = await curl('POST', '/api/reports', {
    date: '2025-02-19',
    largeGroupChurch: 50,
    comment: 'x'.repeat(600)
  });
  if (r7.status === 400) {
    console.log('✓ Reports: comment too long → 400');
    passed++;
  } else {
    console.log('✗ Reports: comment too long - expected 400, got', r7.status);
    failed++;
  }

  console.log('\n--- Result ---');
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Error:', err.message);
  console.log('\nMake sure the backend is running: cd backend && npm run dev');
  process.exit(1);
});
