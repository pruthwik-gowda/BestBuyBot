const { Builder, By, Key, until } = require('selenium-webdriver');
var options = new ChromeOptions();

async function collectTestETH() {
    const walletAddress = '0x5670Ecd5D2Cb7c0fA66EEaefc7E0e39c361fbffC';
    const googleEmail = 'pruthwikgowdaa';
    const googlePassword = 'jughead@786';

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://accounts.google.com/signin/v2/identifier');
        
        // Log in to Google
        await driver.findElement(By.id('identifierId')).sendKeys(googleEmail, Key.RETURN);
        await driver.wait(until.elementLocated(By.name('password')), 10000);
        await driver.findElement(By.name('password')).sendKeys(googlePassword, Key.RETURN);

        // Wait until login is completed
        await driver.wait(until.urlContains('myaccount.google.com'), 10000);

        // Navigate to the Sepolia faucet page
        // await driver.get('https://cloud.google.com/application/web3/faucet/ethereum/sepolia');

        // await driver.wait(until.elementLocated(By.xpath('//*[@id="mat-input-0"]')), 10000);
        // let addressInput = await driver.findElement(By.xpath('//*[@id="mat-input-0"]'));
        // await addressInput.sendKeys(walletAddress);

        // let submitButton = await driver.findElement(By.xpath('//*[@id="drip"]/cw3-faucet-drip-form/form/button'));
        // submitButton.click();

        // // Wait for some time to allow the request to process
        // await driver.sleep(30000); // Adjust the time as necessary
    } finally {
        await driver.quit();
    }
}

collectTestETH();
