const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function scrapeAmazon(productName) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.amazon.in/');
        await driver.findElement(By.xpath('//*[@id="twotabsearchtextbox"]')).sendKeys(productName, Key.RETURN);
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item')), 10000);
        let priceElement = await driver.findElement(By.css('.s-main-slot .s-result-item .a-price-whole'));
        let price = await priceElement.getAttribute("innerHTML");
        return price;
    } finally {
        await driver.quit();
    }
}

async function scrapeFlipkart(productName) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.flipkart.com/');
        //await driver.findElement(By.xpath('//button[contains(text(),"✕")]')).click(); // Close the login popup
        await driver.findElement(By.name('q')).sendKeys(productName, Key.RETURN);
        
        await driver.wait(until.elementLocated(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[2]/div[1]/div[1]/div')), 10000);
        let priceElement = await driver.findElement(By.xpath('.//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[2]/div[1]/div[1]/div'));
        let price = await priceElement.getAttribute("innerHTML");
        return price;
    } finally {
        await driver.quit();
    }
}

(async function() {
    let productName = 'samsung A14 128GB'; // Replace with the desired product

    let flipkartPrice = await scrapeFlipkart(productName);

    let amazonPrice = await scrapeAmazon(productName);

    console.log(`Amazon Price for ${productName}: ₹${amazonPrice}`);
    console.log(`Flipkart Price for ${productName}: ${flipkartPrice}`);
})();


//--------------BUGS--------------
//->Different Ui for "iphone 15 pro max 512 gb" and "caps"
//->product not found(get the title of the first product and check if the title contains productName)