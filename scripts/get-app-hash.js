const { execSync } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

async function collectInputs() {
  const res = await prompt([
    {
      message: 'What is the package name?',
      name: 'packageName',
      default: 'some.package.name',
      type: 'input',
      required: true,
    },
    {
      message: 'Where is the keystore file?',
      name: 'keystore',
      default: './android/app/debug.keystore',
      type: 'input',
      required: true,
    },
    {
      message: 'What is the keystore password',
      name: 'keystorePassword',
      default: 'android',
      type: 'input',
      required: true,
    },
  ]);
  return {
    packageName: res.packageName,
    keystore: res.keystore,
    keystorePassword: res.keystorePassword,
  };
}

async function main() {
  const inputs = await collectInputs();
  if (!fs.existsSync(inputs.keystore)) {
    console.log(`keystore file at ${inputs.keystore} not found`);
    return;
  }
  const cert = execSync(
    `keytool -list -rfc -keystore ${inputs.keystore} -storepass ${inputs.keystorePassword} | sed  -e '1,/BEGIN/d' | sed -e '/END/,$d' | tr -d ' \n' | base64 --decode | xxd -p | tr -d ' \n'`,
    { encoding: 'utf8' }
  )
    .toString()
    .trim();
  console.log(`\ncertificate in hex: ${cert}`);

  const input = `${inputs.packageName} ${cert}`;

  let output = execSync(`printf "${input}" | shasum -a 256 | cut -c1-64`)
    .toString()
    .trim();
  console.log(`\nSHA-256 output in hex: ${output}`);

  output = execSync(`printf ${output} | cut -c1-18`).toString().trim();
  const base64output = execSync(
    `printf ${output} | xxd -r -p | base64 | cut -c1-11`
  );
  console.log(`\nFirst 8 bytes encoded by base64: ${base64output}`);
  console.log(`\nSMS Retriever hash code: ${base64output}`);
}

main();
