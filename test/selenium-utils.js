/**
 * [selenium-utils.js]
 */

import { Builder, Browser } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import { Options as EdgeOptions } from 'selenium-webdriver/edge.js';

const _buildDriverOptions = (browserOptions, {
    isHeadless = true,
    windowSizeText,
    proxyText,
    versionText
} = {}) => {
    if (windowSizeText) {
        browserOptions.addArguments(`--window-size=${windowSizeText}`); // "Width,Hieght", Ex: 1280,960 
    }
    if (proxyText) {
        browserOptions.addArguments(`--proxy-server=${proxyText}`); // "http://proxyServerAddress:portNumber"
    }
    if (isHeadless) {
        browserOptions.addArguments('--headless');
    }
    if (versionText) {
        browserOptions.setBrowserVersion(versionText);
    }
    return browserOptions;
};

/**
 * @param {object} options
 * options = {
 *   versionText,
 *   isHeadless,
 *   proxyText,
 *   windowSizeText
 * };
 */
const buildChromeDriverPromise = function (options) {
    const browserOptions = _buildDriverOptions(
        new ChromeOptions(), 
        options
    )

    return new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(browserOptions)
        .build();
};
const buildEdgeDriverPromise = function (options) {
    const browserOptions = _buildDriverOptions(
        new EdgeOptions(), 
        options
    )

    return new Builder()
        .forBrowser(Browser.EDGE) 
        .setEdgeOptions(browserOptions)
        .build();
};


import fs from 'fs';
import { promisify } from 'util';
const takeScreenshotAndSavePromise = async function (driver, targetDir, fileName) {
    // スクリーンショット画像をbase64でエンコードしたもの
    // ref. takeScreenshot - https://webdriver.io/docs/api/webdriver#takescreenshot
    let base64 = await driver.takeScreenshot();
    // bufferに変換
    let buffer = Buffer.from(base64, 'base64');
    // bufferを保存
    return promisify(fs.writeFile)(targetDir + '/' + fileName, buffer);
}
const isElementByIdDisplayPromise = async function (driver, By, targetId) {
    const element = await driver.findElement(By.id(targetId));
    const targetState = await element.isDisplayed();
    return targetState;
};


export{ 
    buildChromeDriverPromise, buildEdgeDriverPromise,
    takeScreenshotAndSavePromise, isElementByIdDisplayPromise
}
