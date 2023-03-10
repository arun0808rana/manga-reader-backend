// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto('https://ww5.manganelo.tv/chapter/manga-gr983826/chapter-1');

//     // Set screen size
//     await page.setViewport({ width: 1920, height: 119793 });
//     await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36')

//     await page.screenshot({ path: `github-profile.png` });
//     await browser.close();
// })();


// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto('https://v2.mangapark.net/manga/horimiya/i2062081/v1/c1/8?zoom=5');

//     // Set screen size
//     await page.setViewport({width: 1080, height: 1024});

//     // Type into search box
//     await page.type('.search-box__input', 'automate beyond recorder');

//     // Wait and click on first result
//     const searchResultSelector = '.search-box__link';
//     await page.waitForSelector(searchResultSelector);
//     await page.click(searchResultSelector);

//     // Locate the full title with a unique string
//     const textSelector = await page.waitForSelector(
//       'text/Customize and automate'
//     );
//     const fullTitle = await textSelector.evaluate(el => el.textContent);

//     // Print the full title
//     console.log('The title of this blog post is "%s".', fullTitle);

//     await browser.close();
//   })();


const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs');
const url = 'https://v2.mangapark.net/manga/academy-s-undercover-professor'


const getChapters = async (url) => {
    let chapterListArr = []
    await puppeteer.launch().then(async function (browser) {
        await browser.newPage().then(async function (page) {
            await page.goto(url).then(async function () {
                // const output = await page.evaluate(() => {
                //     return document.querySelectorAll('.ml-1.visited.ch');
                // });

                // // console.log('output', output[0])
                // let i = 0;

                // for(let item in output){
                //     console.log(++i, item.text)
                // }
                // browser.close();
                // page.$eval('.volumes li a', function (elm) {
                //     return elm.href;
                // }).then(function (result) {
                //     console.info(result);
                //     browser.close();
                // });

                chaptersList = await page.$$eval('a.ml-1.visited.ch', chapters => chapters.map(chapter => chapter.href));
                browser.close();
                chapterListArr = chaptersList;
            });
        });
    });
    return chapterListArr;
}

const getPanelsFromChapters = async (chapters) => {
    let panelUrlsArr = [];
    // await chapters.map(chapterUrl => {
    //     puppeteer.launch().then(async function (browser) {
    //         await browser.newPage().then(async function (page) {
    //             await page.goto(chapterUrl).then(async function () {
    //                 let tempArr = await page.$$eval('img#img-1', elms => elms.map(panel => panel.src));
    //                 panelUrlsArr.push(tempArr[0]);
    //                 console.log(tempArr[0], 'lol')
    //                 browser.close();
    //             });
    //         });
    //     });
    // })

    let index = 0;
    await puppeteer.launch().then(async function (browser) {
        await browser.newPage().then(async function (page) {
            for (let chapterUrl of chapters) {
                await page.goto(chapterUrl, {timeout: 0}).then(async function () {
                    let tempArr = await page.$$eval('img#img-1', elms => elms.map(panel => panel.src));
                    panelUrlsArr.push(tempArr[0]);
                    console.log(++index, tempArr[0])
                });
            }
            browser.close();
        });
    });

    return panelUrlsArr;
}

const writePanelToDisk = (url, name) => {
    const path = `db/${name}.jpg`; // Replace with the local path where you want to save the image

    axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
        .then(function (response) {
            response.data.pipe(fs.createWriteStream(path));
        });
}

const init = async () => {
    const chapters = await getChapters(url);
    console.log('chapters', chapters)

    const panelUrls = await getPanelsFromChapters(chapters);
    console.log('panelUrls', panelUrls)
    return;
    for (let url in panelUrls) {
        const regex = /[^/]*$/; // Matches the file name at the end of the URL
        const fileName = url.match(regex)[0]; // Extracts the file name from the URL
        writePanelToDisk(url, fileName)
    }
}

init()

