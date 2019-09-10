const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// let staticUrl = 'https://experts.shopify.com'

let browser;
let page;

(async function main() {

    try {

        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36');


        await page.goto('https://experts.shopify.com/services/expert-guidance');
        await page.waitForSelector('.Zk7Cl');

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);

        // console.log("this is body",bodyHTML)

        let $ = cheerio.load(bodyHTML);
        let firstPageNavigationUrl

        let length = $('.wdH28 > div').find('div._1GdgP').length
        console.log("smeet", length)

        for (i = 0; i < length; i++) {

            await page.goto('https://experts.shopify.com/services/expert-guidance');
            await page.waitForSelector('.Zk7Cl');

            let bodyHTML = await page.evaluate(() => document.body.innerHTML);

            let $ = cheerio.load(bodyHTML);

            let section = $('.wdH28 > div').eq(i).html()
            // console.log("section ",section)
            console.log('i', i)


            let $2 = cheerio.load(section);
            firstPageNavigationUrl = 'https://experts.shopify.com' + $2('._1GdgP > a').attr('href');
            let firstPageImageUrls = 'https://experts.shopify.com' + $2('._28Qfo > img').attr('src');
            let firstPageHeadings = $2('._3igjR > .Polaris-Heading > span');
            let firstPageDescription = $2('._3igjR > ._1c52H > .Polaris-TextContainer > p')

            console.log("first page image urls", firstPageImageUrls);
            console.log("first page heading", firstPageHeadings.text());
            console.log("first page Description", firstPageDescription.text());
            console.log("first page navigation urls", firstPageNavigationUrl);
            console.log('\n')

            await page.goto(firstPageNavigationUrl, { waitUntil: 'networkidle0' });
            await page.waitForSelector('._3EE3N');

            let result = await checkSecondPage(firstPageNavigationUrl);
            console.log("this is result", result);

            //    break;
        }

    } catch (error) {
        console.log("this is dsfdsd error", error)
    }


})()

function checkSecondPage(secondPageUrl) {
    let page_no = 1;
    // let url = `${secondPageUrl}?page=${page_no}`;
    let status = true;
    return new Promise(async (resolve, reject) => {
        while(status){

            console.log("this is while loop ",page_no)
            await page.goto(`${secondPageUrl}?page=${page_no}`, { waitUntil: 'networkidle0' });
            await page.waitForSelector('._3EE3N');

            let $secondPage = cheerio.load(await page.evaluate(() => document.body.innerHTML));

            //  this is the root of second page
            let secondPageRoot = cheerio.load($secondPage('div.Zk7Cl > div:nth-child(2)').html());
            // this is the parent of second page
            let secondPageParent = cheerio.load(secondPageRoot('section.jGIW4 > div:nth-child(2)').html());

            let secondPageLength = secondPageParent('body').find('div.kVWrj').length

            // console.log("this is smeet html",secondPageLength);

            if(secondPageLength === 0){  // this will check if current page has data than only we proceed else we will resolve here
                // console.log("here we will terminate and resolve");
                status = false;
                resolve();
            } else {
                let result = await extractSecondPage();
                if(result){
                    page_no += 1;
                }
               
            }

        }
        
        
    })
}

function extractSecondPage() {

    return new Promise(async (resolve, reject) => {

        try {

            /*------------------------------------Second Page Coding starts from here-----------------------------------------------------------------------------*/

            // this will load second page html, which is fetched with help of puppeeter
            let secondPageBodyHtml = await page.evaluate(() => document.body.innerHTML);
            // this will load all the html with the help of cheerio 
            let $secondPage = cheerio.load(secondPageBodyHtml);

            //  this is the root of second page
            let secondPageRoot = $secondPage('div.Zk7Cl > div:nth-child(2)').html();

            // console.log("this is html data", $secondPage.html())
            let $secondPageP = cheerio.load(secondPageRoot);
            // this is the parent of second page
            let secondPageParent = $secondPageP('section.jGIW4 > div:nth-child(2)').html();

            let $secondPagep1 = cheerio.load(secondPageParent)

            let secondPageLength = $secondPagep1('body').find('div.kVWrj').length

            console.log("this is length", secondPageLength);


            for (let j = 0; j < secondPageLength; j++) {

                console.log("this is second page loop", j)

                let div = $secondPagep1('body > div.kVWrj').eq(j).html();

                let $SecondPage = cheerio.load(div)
                // console.log("this is single div data",$SecondPage.html())

                let secondPageCardChild1 = $SecondPage('._2nijJ').html();

                let secondPageCardChild2 = $SecondPage('._3UNHw').html();

                let $secondPageCardChild1 = cheerio.load(secondPageCardChild1);
                let $secondPageCardChild2 = cheerio.load(secondPageCardChild2);



                let secondPageChidl1 = cheerio.load($secondPageCardChild2('div._3f0Kq > div:nth-child(1)').html());
                let secondPageChidl2 = cheerio.load($secondPageCardChild2('div._3f0Kq > div:nth-child(2)').html());
                let secondPageChild3 = cheerio.load($secondPageCardChild2('div._3f0Kq > div:nth-child(3)').html());

                let secondPageCompanyLogo = $secondPageCardChild1('._1WR9f._1tJOR > span > img').attr('src');
                let secondPageCompanyName = $secondPageCardChild1('div._2dskn > h2').html();
                let secondPageCompanyLocation = $secondPageCardChild1('div._2dskn > div > .Polaris-TextStyle--variationSubdued').html();
                let secondPageStartingPrice = secondPageChidl1('div._3657d').html();
                let secondPageJobsCompleted = secondPageChidl2('div >div >div:nth-child(2)').html();
                let secondPageRating = secondPageChild3('div > div > div:nth-child(2) > div > div:nth-child(1)').html();


                console.log("this is second page logo", secondPageCompanyLogo);
                console.log("this is second page Company Name", secondPageCompanyName);
                console.log("this is second page Company Location", secondPageCompanyLocation);
                console.log("this is second page price", secondPageStartingPrice);
                console.log("this is second page jobs completed", secondPageJobsCompleted);
                console.log("this is second page ratings", secondPageRating);


                console.log('/n');


                let thirdPageUrl = `https://experts.shopify.com${$secondPagep1('body > div.kVWrj > a').eq(j).attr('href')}`;
                console.log('this is third page url************************', thirdPageUrl);
                await extractThirdPage(thirdPageUrl);
                if ((secondPageLength - 1) === j) {
                    resolve(true);
                }
                // break;

            }


        } catch (error) {
            console.log("error", error);
            reject(error)
        }
    })
}


function extractThirdPage(thirdPageUrl) {
    return new Promise(async (resolve, reject) => {

        await page.goto(thirdPageUrl, { waitUntil: 'networkidle0' });
        await page.waitForSelector('._34cm1');
        // this will check if comments present or not (single comment)
        let thirdPageParent = cheerio.load( await page.evaluate(() => document.body.innerHTML) )
        let thirdPageRoot = cheerio.load(thirdPageParent('div.u7SZF').html());
        let length =  thirdPageRoot('div._34cm1').find('._2RRwD').length;
        console.log("length check before scrapping comments",length);
        if(length === 0){ // check if single comment is present, if not it will resolve 
            resolve();
        } else {
            let result = await extractComments();
            if(result){
                resolve();
            }
        }

        
    })

}


function extractComments() {
    return new Promise(async (resolve, reject) => {
        let status = true;
        while(status){
            
            
            let thirdPageParent = cheerio.load( await page.evaluate(() => document.body.innerHTML) )
            let thirdPageRoot = cheerio.load(thirdPageParent('div.u7SZF').html());
            let length =  thirdPageRoot('div._34cm1').find('._2RRwD').length;
            // let props = thirdPageRoot('div._34cm1 > nav > button:nth-child(2)').prop('disabled');
            let element = await page.$('div._34cm1 > nav > button:nth-child(2)');
            let props =  await ( await element.getProperty('disabled') ).jsonValue(); 
            console.log("this is props",props);
            await commentWithDetails(thirdPageRoot,length);
            if(props){
                console.log("breaking it",length);
                resolve(true);
                break;  
            } else {
                console.log("this is total length",length);
                await Promise.all([
                    page.click('div._34cm1 > nav > button:nth-child(2)'),
                    page.waitFor(2000)
                ]);
            }
           
        }

    })



}


function commentWithDetails(thirdPageRoot,length){
    return new Promise((resolve,reject) => {

        for(let i = 0; i < length; i++){
            let article = cheerio.load( thirdPageRoot('div._34cm1 > ._2RRwD').eq(i).html() );
            let childrenRoot1 = cheerio.load( article('div.Polaris-Stack:nth-child(1)').html() );
            let subChildren1 = cheerio.load( childrenRoot1('div:nth-child(1)').html() );
            let companyName = subChildren1('._12oDh').html();
            let commentDate = subChildren1('div >.mXNSP > span').html();
            let subChildren2 = cheerio.load( childrenRoot1('div:nth-child(2)').html() );
            let rating = subChildren2('span._6ymh-').html();
            let childrenRoot2 = cheerio.load( article('div.Polaris-TextContainer:nth-child(2)').html() );
            let comment = childrenRoot2('.mXNSP').html();
            console.log("this is company name",companyName);
            console.log("this is company date", commentDate);
            console.log("this is rating", rating);
            console.log('this is comment', comment);

            if(i === (length - 1)){
                console.log("here we will break");   
                resolve();
            }
        }

    })
}