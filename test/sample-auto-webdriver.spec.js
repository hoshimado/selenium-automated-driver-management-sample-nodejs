/**
 * [change-screen-size.spec.js]
 */
import { expect /*, assert */ } from 'chai';
// import sinon from 'sinon';

// import target from '../src/target.js'


import { By } from 'selenium-webdriver';
import { buildChromeDriverPromise, buildEdgeDriverPromise, takeScreenshotAndSavePromise, isElementByIdDisplayPromise } from './selenium-utils.js';


describe('sample.js', () => {

    describe('e2e_sample()', ()=>{
        //beforeEach(()=>{
        //});
        //afterEach(()=>{
        //});


        it('exec in Chrome, and then a element is exist.', async ()=>{
            const ID_SEARCH_TEXTBOX = 'APjFqb'; // ToDo: 検索ボックスのID。即値は良くないので要修正。
            const driverPromise = await buildChromeDriverPromise({
                /* 
                "versionText" : "stable",
                "isHeadless": true,
                "proxyText" : "http://proxyServerAddress:portNumber",
                */
               "windowSizeText" : "1280,960"
            });
            let element;
            var isTargetDisplayed;

            await driverPromise.get('https://www.google.co.jp/');
            await takeScreenshotAndSavePromise(driverPromise, './screenshots', 'browserShowed_chrome1.jpg');

            isTargetDisplayed = await isElementByIdDisplayPromise( driverPromise, By, ID_SEARCH_TEXTBOX ); 
            expect(isTargetDisplayed, '画面に検索ボックスが存在すること').to.be.true;

            element = await driverPromise.findElement(By.id(ID_SEARCH_TEXTBOX))
            await element.sendKeys('Selenium経由でのUI操作エミュレーション');
            await takeScreenshotAndSavePromise(driverPromise, './screenshots', 'browserShowed_chrome2_set_text.jpg');

            // 窓サイズを変更例
            await driverPromise.manage().window().setRect({width: 960, height: 480}); // この数字は適当
            await takeScreenshotAndSavePromise(driverPromise, './screenshots', 'browserShowed_chrome3_960x480.jpg');

            await driverPromise.quit(); // Close the driver after use
        });

        it('exec in Edge', async ()=>{
            const driverPromise = await buildEdgeDriverPromise({
                /* 
                "versionText" : "stable",
                "isHeadless": true,
                "proxyText" : "http://proxyServerAddress:portNumber",
                "windowSizeText" : "1280,960"
                */
            });
            // イントラ内などProxy環境下でのアクセス時は、明示的にプロキシを設定する必要がある。

            await driverPromise.get('https://www.google.co.jp/');
            // こちらの例は、開いたページに対する検証系は省略
            
            await takeScreenshotAndSavePromise(driverPromise, './screenshots', 'browserShowed_edge.jpg');

            await driverPromise.quit(); // Close the driver after use
        });

    });
});




