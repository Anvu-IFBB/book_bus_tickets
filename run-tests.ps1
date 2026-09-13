npm run test:phase1
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase4
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase5
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase6
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase7
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase8
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase9
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase10
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:phase11
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npx tsx scripts/test-phase12.1.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npx tsx scripts/test-phase12.2.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
