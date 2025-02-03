// test_check_link.js
const { checkLink } = require('./check_link');

async function testCheckLink() {
    const postUrl = 'https://lifeisfeudal.com/Discussions/question/is-it-possible-to-write-an-essay-quickly-and-cheaply';  // URL страницы для проверки
    const url = 'https://googlesss.com/';    // Искомый URL
    const anchor = 'https://www.bbessays.com/';              // Искомый анкор

    try {
        const result = await checkLink(postUrl, url, anchor);
        console.log('Результат проверки:', result);
    } catch (error) {
        console.error('Ошибка при проверке:', error);
    }
}

testCheckLink();