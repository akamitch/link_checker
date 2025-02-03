// test_list.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { checkLink } = require('./check_link');

// Получаем названия колонок из .env файла
const POST_URL_COLUMN = process.env.POST_URL_COLUMN;
const URL_COLUMN = process.env.URL_COLUMN;
const ANCHOR_COLUMN = process.env.ANCHOR_COLUMN;

// Функция для получения текущей даты в формате YYYY-MM-DD
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Функция для создания имени выходного файла
function getOutputFileName(inputFileName) {
    const parsedPath = path.parse(inputFileName);
    const date = getCurrentDate();
    return `${parsedPath.name}_processed_${date}${parsedPath.ext}`;
}

// Основная функция обработки
async function processCSV(inputFilePath) {
    try {
        // Читаем входной файл
        const fileContent = fs.readFileSync(inputFilePath, 'utf8');
        
        // Парсим CSV
        const results = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true
        });

        // Массив для хранения результатов
        const processedRows = [];

        // Обрабатываем каждую строку
        for (const row of results.data) {
            const postUrl = row[POST_URL_COLUMN];
            const url = row[URL_COLUMN];
            const anchor = row[ANCHOR_COLUMN];

            // Проверяем наличие всех необходимых значений
            if (postUrl && url && anchor) {
                console.log('\nПроверяем ссылку:');
                console.log('Post URL:', postUrl);
                console.log('Target URL:', url);
                console.log('Anchor:', anchor);

                // Вызываем функцию проверки
                const result = await checkLink(postUrl, url, anchor);
                console.log('Результат:', result);

                // Добавляем результаты к исходной строке
                const processedRow = {
                    ...row,
                    is_page_available: result.is_page_available,
                    is_url_found: result.is_url_found,
                    is_anchor_found: result.is_anchor_found
                };
                processedRows.push(processedRow);
            } else {
                console.error('\nОшибка: Не все требуемые поля заполнены в строке:', row);
                // Добавляем строку с пустыми результатами
                const processedRow = {
                    ...row,
                    is_page_available: '',
                    is_url_found: '',
                    is_anchor_found: ''
                };
                processedRows.push(processedRow);
            }
        }

        // Создаем выходной файл
        const outputFilePath = getOutputFileName(inputFilePath);
        const csv = Papa.unparse(processedRows);
        fs.writeFileSync(outputFilePath, csv);

        console.log(`\nРезультаты сохранены в файл: ${outputFilePath}`);

    } catch (error) {
        console.error('Ошибка при обработке файла:', error);
    }
}

// Получаем путь к входному файлу из аргументов командной строки
const inputFilePath = process.argv[2];

if (!inputFilePath) {
    console.error('Ошибка: Не указан путь к входному файлу');
    console.log('Использование: node test_list.js input.csv');
    process.exit(1);
}

// Запускаем обработку
processCSV(inputFilePath);