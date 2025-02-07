// scripts/start-wiremock.js
const { exec } = require('child_process');
const path = require('path');

const wiremockPath = path.resolve(__dirname, '../node_modules/wiremock-standalone/wiremock-standalone.jar');
const wiremockProcess = exec(`java -jar ${wiremockPath} --port 8080`);

wiremockProcess.stdout.on('data', (data) => {
  console.log(`WireMock: ${data}`);
});

wiremockProcess.stderr.on('data', (data) => {
  console.error(`WireMock Error: ${data}`);
});

process.on('SIGINT', () => {
  wiremockProcess.kill();
  process.exit();
});
