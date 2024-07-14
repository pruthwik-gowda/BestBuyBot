const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const scrapeAmazon = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.amazon.in/');
    await driver.findElement(By.xpath('//*[@id="twotabsearchtextbox"]')).sendKeys(productName, Key.RETURN);

    try {
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item')), 10000);
        let priceElement = await driver.findElement(By.css('.s-main-slot .s-result-item .a-price-whole'));
        let price = await priceElement.getAttribute("innerHTML");
        return price;
    } 
    catch(err){
        await driver.wait(until.elementLocated(By.xpath('.//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[2]/div[3]/div/div[1]/a/span/span[1]')), 10000);
        let priceElement = await driver.findElement(By.xpath('//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[2]/div[3]/div/div[1]/a/span/span[1]'));
        let price = await priceElement.getAttribute("innerHTML");
        return price;
    }
    finally {
        await driver.quit();
    }
}

const scrapeFlipkart = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.flipkart.com/');
    //await driver.findElement(By.xpath('//button[contains(text(),"✕")]')).click(); // Close the login popup
    await driver.findElement(By.name('q')).sendKeys(productName, Key.RETURN);

    let price;

    try {
        await driver.wait(until.elementLocated(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[2]/div[1]/div[1]/div')), 10000);
        let priceElement = await driver.findElement(By.xpath('.//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[2]/div[1]/div[1]/div'));
        price = await priceElement.getAttribute("innerHTML");
        return price;
    } 
    catch(err){
        await driver.wait(until.elementLocated(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/div/a[2]/div[1]/div[1]')), 10000);
        let priceElement = await driver.findElement(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/div/a[2]/div[1]/div[1]'));
        price = await priceElement.getAttribute("innerHTML");
        return price;
    }
    finally {
        await driver.quit();
    }
}

const main = async () => {
    let productName = '15 pro max 512 gb'; // Replace with the desired product

    let flipkartPrice = await scrapeFlipkart(productName);

    let amazonPrice = await scrapeAmazon(productName);

    console.log(`Amazon Price for ${productName}: ₹${amazonPrice}`);
    console.log(`Flipkart Price for ${productName}: ${flipkartPrice}`);
};

main()


//--------------BUGS--------------
//->Different Ui for "iphone 15 pro max 512 gb" and "caps"
//->product not found(get the title of the first product and check if the title contains productName)
//->in amazon the sponsored product is showed first, fix that
//->in flipkart, there are some hoax listings of products....if u select the ratings as 4 star and above...it'll be removed