# 本サンプルが提供する内容

* Seleniumを用いたブラウザーの自動操作に置いて、Webドライバーのインストール管理を不要とする実装方法（Selenium公式が**webDriverの実装の自動取得に対応**したので、その機能を利用）
* ブラウザー自体が無い環境で、ブラウザーも含めて自動取得してSeleniumによるブラウザーを介したE2Eテストをする方法

* 合わせて、GitHub Actionsで実行して撮影したスクリーンショットをArtifactに格納するワークフローも実装してある



# USAGE

* Node.jsをインストールする。
    * https://nodejs.org/en/download/prebuilt-installer
* E2Eテストを実行する。
    * `npm run test`


## サンプル実装の内容

* `https://www.google.co.jp/` に対してChromeとEdgeでページを開き、検索ボックスのテストコードで存在検証し、参考にスクリーンショットを取得する
* その際に、Selenium Managerがその環境にインストールされているChromeとEdgeのバージョンに応じたWebDriverを自動取得して動作する
* ChromeとEdgeがインストールされていない環境の場合は、その時点の`stable`バージョンのブラウザ自体も自動取得とインストールを行ったうえで、続けて対応するWebDriverを自動取得して動作する
  * 従って、GitHub ActionsのHosted Runnerなどの「標準ではブラウザーがインストールされていない環境」であってもブラウザーのインストールを利用者が意識すること無く、本コードを実行可能
* ヘッドレスモードで動作し、指定のウィンドウサイズでブラウザーを起動する
  * オプションで、通常のブラウザー表示モードでの動作もサポート済み
  * その他、オプションで「プロキシ設定」、「起動時の画面サイズの設定」も行っている
  * これらはSelenium本来の機能だが、今回のWebDriverの自動取得と併用する場合の例、として実装してある



# 実装内容の解説

Chromeの場合を例にとる。

WebDriverの実装を自動取得するには、実はとくに特別な記法をする必要はない。
「WebDriver（の実装であるChromeDriver）のファイルを配置せずに」
いつものDriverインスタンスを作成すればよい。

```
new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(browserOptions)
    .build();
```

ブラウザーバージョンなどは上述のコード中の`browserOptions`で指定する。
例として、プロキシ設定の有無、ブラウザーバージョン指定の有無、ヘッドレスブラウザーモードの有無、画面サイズ、を指定する場合は次のように構成する。
ここで、バージョン指定しない場合（インストールのブラウザーに合わせる）場合は、`browserOptions.setBrowserVersion()`の**設定skip**すればよい。

```
browserOptions = new ChromeOptions();

browserOptions.addArguments(`--proxy-server=${proxyText}`); // Ex: proxyText="http://proxyServerAddress:portNumber"
browserOptions.setBrowserVersion(versionText);
browserOptions.addArguments('--headless');
browserOptions.addArguments(`--window-size=${windowSizeText}`); // Ex: windowSizeText="Width,Hieght", Ex: 1280,960 
```

より具体的な実装は、[selenium-utils.js](./test/selenium-utils.js)を参照のこと。
作成したdriverインスタンスを用いたブラウザーの自動操作例は、[sample-auto-webdriver.spec.js](./test/sample-auto-webdriver.spec.js)を参照のこと。

なお、上記のサンプルコードは、GitHub Actionsでの動作を考慮して、ヘッドレスモードを有効としている。`"isHeadless": false,`に変更してその部分のコメントアウトを外してから実行すると、ブラウザーが起動する様子を確認できる。

GitHub Actionsでのワークフローの実装は、[node.js.yml](./..github/workflows/node.js.yml)を参照のこと。




# Background

* 用語の定義として、以下とする。
  * `WebDriver`は正式名称が`Seleniumu WebDriver`であって、ブラウザーを自動制御するためのAPI仕様（規格）であり、つまりI/Fである
  * `browser driver`とは、ブラウザー毎の`WebDriver`の実装のことである
  * `browser driver`は具体的には、ChromeならばChromeドライバーであり、FireFoxならFireFoxドライバー、となる
  * 一般に「ブラウザーごとの`WebDriver`を準備する」と言った場合は、これは「ブラウザーごとのWebDriverを実装した`browser driver`を準備する」を意味する
* Selenium 4.6以降（November 04, 2022）、対象ブラウザーのバージョンに合わせて、必要なWebDriverを自動取得する機能が追加された（Seleniumｎ同梱されるSelenium Managerの機能）
  * `Selenium Manager is a new tool that helps to get a working environment to run Selenium out of the box. Beta 1 of Selenium Manager will configure the browser drivers for Chrome, Firefox, and Edge if they are not present on the PATH.To run a Selenium test with Selenium 4.6, you only need to have Chrome, Firefox, or Edge installed.`
  * https://www.selenium.dev/blog/2022/introducing-selenium-manager/
* Selenium 4.11.0以降（July 31, 2023）、WebDriverだけでなく、ブラウザー自体も自動取得する機能が追加された
  * `As of Selenium 4.11.0, Selenium Manager also implements automated browser management. With this feature, Selenium Manager allows us to discover, download, and cache the different browser releases, making them seamlessly available for Selenium.`
  * https://www.selenium.dev/documentation/selenium_manager/
* インストールされるWebDriverのバージョンは、指定が無い場合は「インストールされているブラウザーのバージョン」が選択される。ブラウザーがインストールされていない場合は、ブラウザーはstableバージョンが選択される。
  * `Chrome is not installed on the local machine when starting a new session). In that case, the current stable CfT release will be discovered, downloaded, and cached (in ~/.cache/selenium/chrome) by Selenium Manager.`
  * https://www.selenium.dev/documentation/selenium_manager/
* 自動ダウンロードされたBrowser Driverは、 `a local cache folder (~/.cache/selenium)` に保管される
  * `4. Driver cache. Uncompressed driver binaries are stored in a local cache folder (~/.cache/selenium). The next time the same driver is required, if the driver is already in the cache, it will be used from there.`
  * https://www.selenium.dev/blog/2023/whats-new-in-selenium-manager-with-selenium-4.11.0/
    * なお、保管先は先の `https://www.selenium.dev/documentation/selenium_manager/` 出も同様の記載あり
  * Windowsであれば `%USERPROFILE%\.cache\selenium` になる
* 上記に関する、より分かりやすい記事
  * 「SeleniumにChrome WebDriverの事前準備はもう必要ない _ すぺきよのしくはっくブログ」
    * https://spekiyoblog.com/no-more-preparing-chrome-webdriver-for-selenium/
* イントラ環境などのProxy配下においては、ヘッドレスブラザー動作時に明示的にProxy情報を与える必要がある
  * 「【Python】selenium-webdriverをヘッドレスモードで起動させる（Edge） #スクレイピング - Qiita」
    * https://qiita.com/Z-A-K-I/items/d30ed5417ec45cfe3ad0


