const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const run = require('./runPrompt'); 



const scrapeAmazon = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.amazon.in/');
    await driver.findElement(By.id('twotabsearchtextbox')).sendKeys(productName, Key.RETURN);


    try {
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item .s-card-container')), 20000);
        let products = await driver.findElements(By.css('.s-main-slot .s-result-item .s-card-container'));

        let bestMatch = null;

        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles and corresponding price that i'll send u in this message. The products are will be seperated by "------" and the title has with it it's price which his seperated from the title by "---". Here's an example pf how this looks ------ product1-title --- product1-price ------ product2-title --- product2-price ------ . Anthing (other than the price) between these lines (------ and ---) is a title....be it characters, be it anything. Even trailing "..." is considered a title, so return that as well. These are the titles ------ `

        for (let product of products) {
            try {
                
                let titleElement = await product.findElement(By.css('h2 a span'));
                let title = await titleElement.getText();

                let priceElement = await product.findElement(By.css('.a-price-whole'));
                let price = await priceElement.getText();

                prompt += title + " --- " + price
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        

        prompt += ". Now thats all the product titles and corresponding prices. I want u to return JUST the product title (as title) the most similar product as is. So you have to return one variable, title. Don't return the price. The product most be chosen such that if there are multiple similar products, chose the one with the lowest price. You HAVE to return a title. Don't even give me a label...Just the title. No * also."
        //console.log(prompt)
        title = await run(prompt)
        
        let promptPrice = `this is the previous query - "${prompt}" . You returned the title as "${title}". Now i want you to return the PRICE of the the product you returned as the answer for the previous query. Not the title.`
        price = await run(promptPrice);

        return `${title} --- ${price}`


        
        // console.log(bestMatch)
        // //
        // bestMatch = bestMatch.trim();
        // //console.log(prompt)
        
        // //console.log(bestMatch?"yes":"no")

        // for (let product of products) {
        //     let title;
        //     let titleElement = await product.findElement(By.css('h2 a span'));
        //     title = await titleElement.getText();
            
            
        //     // console.log(title);
        //     // console.log(bestMatch)
        //     if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
        //         console.log(bestMatch)
        //         let priceElement = await product.findElement(By.css('.a-price-whole'));
        //         let price = await priceElement.getText();
        //         return `${title} --- ${price}`;
        //     }
        // }
        // return null;
        

    } catch (err) {
        console.error('Error finding Amazon price:', err);
    } finally {
        await driver.quit();
    }
}

const scrapeCroma = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.croma.com/');
    await driver.findElement(By.xpath('//*[@id="searchV2"]')).sendKeys(productName, Key.RETURN);


    try {
        await driver.wait(until.elementLocated(By.css('.product-item')), 1000);
        let products = await driver.findElements(By.css('.product-item'));

        let bestMatch = null;

        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles and corresponding price that i'll send u in this message. The products are will be seperated by "------" and the title has with it it's price which his seperated from the title by "---". Here's an example pf how this looks ------ product1-title --- product1-price ------ product2-title --- product2-price ------ . Anthing (other than the price) between these lines (------ and ---) is a title....be it characters, be it anything. Even trailing "..." is considered a title, so return that as well. These are the titles ------ `

        for (let product of products) {
            try {
                
                let titleElement = await product.findElement(By.css('.product-title'));
                let title = await titleElement.getText();

                let priceElement = await product.findElement(By.css('.amount'));
                let price = await priceElement.getText();

                prompt += title + " --- " + price
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        

        prompt += ". Now thats all the product titles and corresponding prices. I want u to return JUST the product title (as title) and the corresponding price of the most similar product (as price) as is. So you have to return two variables, title and price. The product most be chosen such that if there are multiple similar products, chose the one with the lowest price. You HAVE to return a title. Don't even give me a label...Just the title. No * also."
        bestMatch = await run(prompt)
        return `${bestMatch}`

        // bestMatch = bestMatch.trim();
        // //console.log(prompt)
        
        // //console.log(bestMatch?"yes":"no")

        // for (let product of products) {
        //     let title;
        //     let titleElement = await product.findElement(By.css('.product-title'));
        //     title = await titleElement.getText();
            
            
        //     // console.log(title);
        //     // console.log(bestMatch)
        //     if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
        //         let priceElement = await product.findElement(By.css('.amount'));
        //         let price = await priceElement.getText();
        //         return `${title} --- ${price}`;
        //     }
        // }
        return null;

    } catch (err) {
        console.error('Error finding Croma price:', err);
    } finally {
        await driver.quit();
    }
}

const scrapeReliance = async (productName) => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://www.reliancedigital.in/');
    await driver.findElement(By.xpath('//*[@id="suggestionBoxEle"]')).sendKeys(productName, Key.RETURN);


    try {
        await driver.wait(until.elementLocated(By.css('.pl__container__sp')), 20000);
        let products = await driver.findElements(By.css('.pl__container__sp'));

        let bestMatch = null;

        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles that i'll send u in this message. These are the titles`

        for (let product of products) {
            try {
                
                let titleElement = await product.findElement(By.css('.sp__name'));
                let title = await titleElement.getText();
                prompt += title + ", "
            } catch (err) {
                // Ignore products that do not have the necessary elements
            }
        }

        

        prompt += ". Now thats all the product titles and corresponding prices. I want u to return JUST the product title (as title) and the corresponding price of the most similar product (as price) as is. So you have to return two variables, title and price. The product most be chosen such that if there are multiple similar products, chose the one with the lowest price. You HAVE to return a title. Don't even give me a label...Just the title. No * also."
        bestMatch = await run(prompt)
        bestMatch = bestMatch.trim();
        //console.log(prompt)
        
        //console.log(bestMatch?"yes":"no")

        for (let product of products) {
            let title;
            let titleElement = await product.findElement(By.css('.sp__name'));
            title = await titleElement.getText();
            
            
            // console.log(title);
            // console.log(bestMatch)
            if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
                let priceElement = await product.findElement(By.css('.gimCrs'));
                let price = await priceElement.getText();
                return `${title} --- ${price}`;
            }else{
                return `product out of stock`
            }
        }
        return null;

    } catch (err) {
        console.error('Error finding reliance digital price:', err);
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


        let prompt = `I have searched for a product in the search bar using the keys "${productName}". I want you to return the most similar product's title of all the product titles and corresponding price that i'll send u in this message. The products are will be seperated by "------" and the title has with it it's price which his seperated from the title by "---". Here's an example pf how this looks ------ product1-title --- product1-price ------ product2-title --- product2-price ------ . Anthing (other than the price) between these lines (------ and ---) is a title....be it characters, be it anything. Even trailing "..." is considered a title, so return that as well. These are the titles ------ `

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

                let priceElement = await product.findElement(By.css('.Nx9bqj'));
                let price = await priceElement.getText();
                
                prompt += title + " --- " + price
                //console.log(prompt)

            } catch (err) {
                // Ignore products that do not have the necessary elements
         
            }
        }

        prompt += ". Now thats all the product titles and corresponding prices. I want u to return JUST the product title (as title) the most similar product as is. So you have to return one variable, title. Don't return the price. The product most be chosen such that if there are multiple similar products, chose the one with the lowest price. You HAVE to return a title. Don't even give me a label...Just the title. No * also."
        title = await run(prompt)
        let promptPrice = `this is the previous query - "${prompt}" . You returned the title as "${title}". Now i want you to return the PRICE of the the product you returned as the answer for the previous query. Not the title.`
        price = await run(promptPrice);
        return `${title} --- ${price}`
        console.log(`${title} --- ${price}`)


        // bestMatch = bestMatch.trim();
        // //console.log(prompt)
        
        // console.log(bestMatch)

        // for (let product of products) {
        //     let title;
        //     try {
        //         let titleElement = await product.findElement(By.css('.KzDlHZ'));
        //         title = await titleElement.getText();
        //     } catch (err) {
        //         try {
        //             let titleElement = await product.findElement(By.css('.WKTcLC'));
        //             title = await titleElement.getText();
        //         } catch (err) {
        //             let titleElement = await product.findElement(By.css('.wjcEIp'));
        //             title = await titleElement.getText();
        //         }
        //     }
            
        //      console.log(title);
        //     // console.log(bestMatch)
        //     if (title.trim().toLowerCase() == bestMatch.toLowerCase()) {
        //         console.log("here")
        //         let priceElement = await product.findElement(By.css('.Nx9bqj'));
        //         let price = await priceElement.getText();
        //         return `${title} --- ${price}`;
        //     }
        // }
        return null;

    } catch (err) {
        console.error('Error finding Flipkart price:', err);
    } finally {
        await driver.quit();
    }    
}

const main = async () => {
    
    let productName = 'iphone 15 pro max 512 gb'; // Replace with the desired product

    //let amazon = await scrapeAmazon(productName);
    let flipkart = await scrapeFlipkart(productName);
    //let croma = await scrapeCroma(productName);
    // let reliance = await scrapeReliance(productName);

    //console.log(`Amazon Price for ${amazon}`);
    console.log(`flipkart Price for ${flipkart}`);
    //console.log(`Croma Price for ${croma}`);
    //console.log(`Reliance Digital Price for ${reliance}`);
};

main()


//--------------BUGS--------------
//->Different Ui for "iphone 15 pro max 512 gb" and "caps" (FIXED - used classes instead of xpath)
//->flipkart has a third UI...for "nintendo switch oled" (FIXED - used classes instead of xpath)
//->give a avg price (or price range) for the product as well
//->product not found (partially fixed)
//->in amazon the sponsored product is showed first, fix that (partially fixed)
//->in flipkart, there are some hoax listings of products....if u select the ratings as 4 star and above...it'll be removed