const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const levenshtein = require('fast-levenshtein');

function extractNumbersToSet(inputString) {
    // Use a regular expression to match all sequences of digits
    const numbers = inputString.match(/\d+/g);
    
    // Create a Set from the matched numbers (this automatically removes duplicates)
    const numberSet = new Set(numbers);
    
    return numberSet;
}

function isSetContained(mainSet, subset) {
    // Ensure subset is a Set before proceeding
    if (!(subset instanceof Set)) {
      subset = new Set(subset); // Convert subset to Set if it's not already
    }
  
    for (let elem of subset) {
      if (!mainSet.has(elem)) {
        return false;
      }
    }
    return true;
  }

const scrapeAmazon = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.amazon.in/');
    await driver.findElement(By.id('twotabsearchtextbox')).sendKeys(productName, Key.RETURN);

    // try {
    //     await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item .s-card-container')), 20000);
    //     let products = await driver.findElements(By.css('.s-main-slot .s-result-item .s-card-container'));

    //     for (let product of products) {
    //         try {
    //             let titleElement = await product.findElement(By.css('h2 a span'));
    //             let title = await titleElement.getText();
    //             console.log("checking");
    //             if (title.toLowerCase().contains(productName.toLowerCase())) {
    //                 console.log("got in");
    //                 let priceElement = await product.findElement(By.css('.a-price-whole'));
    //                 let price = await priceElement.getText();
    //                 return `${price}`;
    //             }
    //         } catch (err) {
    //             console.log("here");
    //         }
    //     }
    // } catch (err) {
    //     console.error('Error finding Amazon price:', err);
    // } finally {
    //     await driver.quit();
    // }

    try {
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item .s-card-container')), 20000);
        let products = await driver.findElements(By.css('.s-main-slot .s-result-item .s-card-container'));

        let bestMatch = null;
        let minDistance = Infinity;

        for (let product of products) {
            try {
                
                let titleElement = await product.findElement(By.css('h2 a span'));
                let title = await titleElement.getText();
                //console.log("checking");
                if(isSetContained(extractNumbersToSet(title), extractNumbersToSet(productName))){
                    let distance = levenshtein.get(productName.toLowerCase(), title.toLowerCase());
                    console.log(`Title: ${title}`);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMatch = product;
                    }
                }
                //else return `Product details are not clear enough or the product is out of stock`
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        if (bestMatch) {
            let priceElement = await bestMatch.findElement(By.css('.a-price-whole'));
            let price = await priceElement.getAttribute("innerHTML");
            let titleElement = await bestMatch.findElement(By.css('h2 a span'));
            let title = await titleElement.getText();
            return `${title} - ₹${price}`;
        }
    } catch (err) {
        console.error('Error finding Amazon price:', err);
    } finally {
        await driver.quit();
    }
}

const scrapeFlipkart = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.flipkart.com/');
    //await driver.findElement(By.xpath('//button[contains(text(),"✕")]')).click(); // Close the login popup
    await driver.findElement(By.name('q')).sendKeys(productName, Key.RETURN);

    //let price;

    // try {
    //     await driver.wait(until.elementLocated(By.xpath('_75nlfW')), 100);
    //     let priceElement = await driver.findElement(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[2]/div[1]/div[1]/div[1]'));

    //     price = await priceElement.getAttribute("innerHTML");
    //     return price;
    // } 
    // catch(err){
    //     try{
    //         await driver.wait(until.elementLocated(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/div/a[2]/div[1]/div[1]')), 100);
    //         let priceElement = await driver.findElement(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/div/a[2]/div[1]/div[1]'));
    //         price = await priceElement.getAttribute("innerHTML");
    //         return price;
    //     }
    //     catch(err2){
    //         await driver.wait(until.elementLocated(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/a[3]/div[1]/div[1]')), 100);
    //         let priceElement = await driver.findElement(By.xpath('//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/div/a[3]/div[1]/div[1]'));
    //         price = await priceElement.getAttribute("innerHTML");
    //         return price;
    //     }
    // }
    // finally {
    //     await driver.quit();
    // }


    try {
        // slAVV4
        let products;
        try{
        await driver.wait(until.elementLocated(By.css('.slAVV4')), 1000);
        products = await driver.findElements(By.css('.slAVV4'));
        console.log(products.length)
        }
        catch(err){
            await driver.wait(until.elementLocated(By.css('._75nlfW')), 1000);
            products = await driver.findElements(By.css('._75nlfW'));
            console.log(products.length)
        }
        

        let bestMatch = null;
        let minDistance = Infinity;

        for (let product of products) {
            try {
                let title;
                try{
                    let titleElement = await product.findElement(By.css('.KzDlHZ'));
                    title = await titleElement.getText();
                }
                catch(err){
                    let titleElement = await product.findElement(By.css('.wjcEIp'));
                    title = await titleElement.getText();
                }
                console.log("checking");
                console.log(`Title: ${title} - productName: ${productName}`);
                if(isSetContained(extractNumbersToSet(title), extractNumbersToSet(productName))){
                    let distance = levenshtein.get(productName.toLowerCase(), title.toLowerCase());
                    console.log(`Title: ${title} - ${distance}`);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMatch = product;
                    }
                }
                //else return `Product details are not clear enough or the product is out of stock`
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        if (bestMatch) {
            let priceElement = await bestMatch.findElement(By.css('.Nx9bqj'));
            let price = await priceElement.getAttribute("innerHTML");
            let title;
            try{
                let titleElement = await bestMatch.findElement(By.css('.KzDlHZ'));
                title = await titleElement.getText();
            }
            catch(err){
                let titleElement = await bestMatch.findElement(By.css('.wjcEIp'));
                title = await titleElement.getText();
            }
            
            return `${title} - ₹${price}`;
        }
    } catch (err) {
        console.error('Error finding Flipkart price:', err);
    } finally {
        await driver.quit();
    }

    
}

const main = async () => {
    let productName = 'apple iphone 15 pro max 256 gb titanium'; // Replace with the desired product

    let somethingElse = await scrapeFlipkart(productName);

    let something = await scrapeAmazon(productName);

    console.log(`Amazon Price for ${something}`);
    console.log(`flipkart Price for ${somethingElse}`);
};

main()


//--------------BUGS--------------
//->Different Ui for "iphone 15 pro max 512 gb" and "caps" (FIXED - used classes instead of xpath)
//->flipkart has a third UI...for "nintendo switch oled" (FIXED - used classes instead of xpath)
//->give a avg price (or price range) for the product as well
//->product not found (partially fixed)
//->in amazon the sponsored product is showed first, fix that (partially fixed)
//->in flipkart, there are some hoax listings of products....if u select the ratings as 4 star and above...it'll be removed