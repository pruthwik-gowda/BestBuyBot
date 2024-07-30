const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const levenshtein = require('fast-levenshtein');
const run = require('./runPrompt'); 



const scrapeAmazon = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.amazon.in/');
    await driver.findElement(By.id('twotabsearchtextbox')).sendKeys(productName, Key.RETURN);


    try {
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item .s-card-container')), 20000);
        let products = await driver.findElements(By.css('.s-main-slot .s-result-item .s-card-container'));

        let bestMatch = null;

        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles that i'll send u in this message. These are the titles`

        for (let product of products) {
            try {
                
                let titleElement = await product.findElement(By.css('h2 a span'));
                let title = await titleElement.getText();
                prompt += title + ", "
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        

        prompt += ". Now thats all the product titles. If u dont find the exact product's title, return the most similar product title. I want u to return JUST the product title of the similar product as is. Don't even give me a label...Just the title. No * also"
        bestMatch = await run(prompt)
        bestMatch = bestMatch.trim();
        //console.log(prompt)
        
        //console.log(bestMatch?"yes":"no")

        for (let product of products) {
            let title;
            let titleElement = await product.findElement(By.css('h2 a span'));
            title = await titleElement.getText();
            
            
            // console.log(title);
            // console.log(bestMatch)
            if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
                let priceElement = await product.findElement(By.css('.a-price-whole'));
                let price = await priceElement.getText();
                return `${title} --- ${price}`;
            }else{
                return `product out of stock`
            }
        }
        return null;

        // if (bestMatch) {
        //     let priceElement = await bestMatch.findElement(By.css('.a-price-whole'));
        //     let price = await priceElement.getAttribute("innerHTML");
        //     let titleElement = await bestMatch.findElement(By.css('h2 a span'));
        //     let title = await titleElement.getText();
        //     console.log(title);
        //     return `${title} - ₹${price}`;
        // }
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


    try {
        let products;
        try{
        await driver.wait(until.elementLocated(By.css('.slAVV4')), 1000);
        products = await driver.findElements(By.css('.slAVV4'));
        console.log(products.length)
        }
        catch(err){
            try{
                await driver.wait(until.elementLocated(By.css('._1sdMkc')), 1000);
                products = await driver.findElements(By.css('._1sdMkc'));
                console.log(products.length)
            }
            catch(err){
                await driver.wait(until.elementLocated(By.css('._75nlfW')), 1000);
                products = await driver.findElements(By.css('._75nlfW'));
                console.log(products.length)
            }
            
        }
        

        let bestMatch = null;


        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles that i'll send u in this message. These are the titles`

        for (let product of products) {
            try {
                let title;
                try{
                    let titleElement = await product.findElement(By.css('.KzDlHZ'));
                    title = await titleElement.getText();
                }
                catch(err){
                    try{
                        let titleElement = await product.findElement(By.css('.WKTcLC'));
                        title = await titleElement.getText();
                    }
                    catch(err){
                        let titleElement = await product.findElement(By.css('.wjcEIp'));
                        title = await titleElement.getText();
                    }
                }
                
                prompt += title + ", "
                //console.log(prompt)

            } catch (err) {
                // Ignore products that do not have the necessary elements
         
            }
        }

        prompt += ". Now thats all the product titles. I want u to return JUST the product title  of the similar product as is. You HAVE to return a title. Don't even give me a label...Just the title. No * also"
        bestMatch = await run(prompt)
        bestMatch = bestMatch.trim();
        //console.log(prompt)
        
        //console.log(bestMatch)

        for (let product of products) {
            let title;
            try {
                let titleElement = await product.findElement(By.css('.KzDlHZ'));
                title = await titleElement.getText();
            } catch (err) {
                try {
                    let titleElement = await product.findElement(By.css('.WKTcLC'));
                    title = await titleElement.getText();
                } catch (err) {
                    let titleElement = await product.findElement(By.css('.wjcEIp'));
                    title = await titleElement.getText();
                }
            }
            
            // console.log(title);
            // console.log(bestMatch)
            if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
                let priceElement = await product.findElement(By.css('.Nx9bqj'));
                let price = await priceElement.getText();
                return `${title} --- ${price}`;
            }
        }
        return null;

    } catch (err) {
        console.error('Error finding Flipkart price:', err);
    } finally {
        await driver.quit();
    }

    
}

const main = async () => {
    
    let productName = 'samsung s24 ultra 512 gb'; // Replace with the desired product

    let something = await scrapeAmazon(productName);
    let somethingElse = await scrapeFlipkart(productName);

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