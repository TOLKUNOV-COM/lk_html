import {defineConfig} from 'vite'
import pugPlugin from 'vite-plugin-pug';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import {viteStaticCopy} from 'vite-plugin-static-copy';
// import tailwindcss from '@tailwindcss/vite'

const pugOptions = { pretty: true } // FIXME: pug pretty is deprecated!

// Чтение и парсинг YAML файла
const pugLocalsFilePath = path.resolve(__dirname, './src/template_locals.yml');

function getPugLocals() {
    const yamlContent = fs.readFileSync(pugLocalsFilePath, 'utf8');
    return yaml.load(yamlContent);
}

let currentLocals = getPugLocals();

export default defineConfig({
    server: {
        host: 'localhost',
        port: 3000,
    },
    root: './src', // Указываем корневую директорию для исходных файлов
    build: {
        outDir: '../dist', // Указываем директорию для сборки
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, './src/index.html'),
                components: path.resolve(__dirname, './src/components.html'),
                login: path.resolve(__dirname, './src/login.html'),
                view: path.resolve(__dirname, './src/view.html'),
                projects_list: path.resolve(__dirname, './src/projects_list.html'),
                empty_search: path.resolve(__dirname, './src/empty_search.html'),
                empty_favorites: path.resolve(__dirname, './src/empty_favorites.html'),

                test: path.resolve(__dirname, './src/js/test.js'),
            },
            output: {
                entryFileNames: '[name].js', // Имена файлов без хэша для JS
                chunkFileNames: '[name].js', // Имена чанков без хэша для JS
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return '[name].css'; // Имена файлов без хэша для CSS
                    }
                    return 'assets/[name].[ext]'; // Имена файлов без хэша для остальных ассетов
                }
            },
        },
        assetsInlineLimit: 8192, // Порог в байтах, например, 8 КБ
    },
    base: '',
    plugins: [
		// tailwindcss(),
        pugPlugin(pugOptions, currentLocals),
        {
            name: 'watch-yaml',
            configureServer(server) {
                chokidar.watch(pugLocalsFilePath).on('change', () => {
                    console.log('template_local.yml changed, reloading Pug templates...');
                    currentLocals = getPugLocals();

                    // Пересобрать все Pug-шаблоны
                    server.restart();
                });
            },
        },
        viteStaticCopy({
            targets: [
                {
                    src: 'data/*', // Путь к вашим изображениям
                    dest: 'data' // Директория назначения
                }
            ],
            verbose: true // Включение подробного логирования
        }),
        {
            name: 'lock-file-plugin',
            configureServer(server) {
                const lockFilePath = path.resolve(__dirname, './dist/vite-dev.lock');

                // Создание lock-файла при запуске dev-сервера
                server.httpServer.once('listening', () => {
                    fs.writeFileSync(lockFilePath, 'Vite Dev Server is running');
                });

                // Удаление lock-файла при завершении сервера
                const removeLockFile = () => {
                    if (fs.existsSync(lockFilePath)) {
                        fs.unlinkSync(lockFilePath);
                        console.log('Lock file removed.');
                    }
                };

                // Обработка стандартного завершения сервера
                server.httpServer.once('close', removeLockFile);

                // Обработка сигналов завершения процесса (Ctrl + C и другие)
                process.on('SIGINT', () => {
                    console.log('Received SIGINT. Removing lock file...');
                    removeLockFile();
                    process.exit(); // Завершение процесса
                });

                process.on('SIGTERM', () => {
                    console.log('Received SIGTERM. Removing lock file...');
                    removeLockFile();
                    process.exit(); // Завершение процесса
                });
            },
        },
    ],
    define: {}
});
