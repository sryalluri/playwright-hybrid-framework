import loginSetup from "./global-setup.js";
import allureEnvironmentSetup from "./allureEnvironmentSetup.js";

async function frameworkSetup(config) {

  // Create environment.properties for Allure
  await allureEnvironmentSetup();

  // Run your existing login setup
  await loginSetup(config);

}

export default frameworkSetup;