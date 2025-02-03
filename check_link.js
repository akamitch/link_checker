// check_link.js
const puppeteer = require('puppeteer');

async function checkLink(postUrl, url, anchor) {
    const result = {
        is_page_available: 0,
        is_url_found: 0,
        is_anchor_found: 0
    };
    
    try {
        // Запускаем браузер с настройками, имитирующими реального пользователя
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"'
            ]
        });

        const page = await browser.newPage();
        
        // Устанавливаем размер viewport как у обычного десктопного браузера
        await page.setViewport({
            width: 1920,
            height: 1080
        });

        // Переходим на страницу
        await page.goto(postUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        result.is_page_available = 1;

        // Ищем все ссылки на странице
        const links = await page.evaluate((searchUrl, searchAnchor) => {
            const allLinks = Array.from(document.getElementsByTagName('a'));
            const foundLinks = allLinks.map(link => ({
                href: link.href,
                text: link.textContent.trim()
            }));
            return foundLinks;
        }, url, anchor);

        // Проверяем наличие указанного URL и анкора
        links.forEach(link => {
            if (link.href === url) {
                result.is_url_found = 1;
            }
            if (link.text === anchor) {
                result.is_anchor_found = 1;
            }
        });

        await browser.close();
    } catch (error) {
        console.error('Error occurred:', error);
    }

    return result;
}

module.exports = { checkLink };