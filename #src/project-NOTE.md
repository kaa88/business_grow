Used: New site template v3.02

# Project NOTE

### TO DO:
- из-за чего-то виснет дев тулс браузера
- неправильная расстановка стилей для :visited, надо проверить


### Template changes:
- чтобы цветовые css переменные закрашивались, создал файл colors.scss... нужно его импортить в каждый модульный файл (@import "../colors";)
- названия переменных цветов переделать на $color01, т.к. -1 после десятого начинает неправильно закрашивать
- в разделе цветов сделать переменные градиентов $gradient01
- main.scss в .main min-height в формуле отнять 1 рх, чтобы не вылезала прокрутка из-за погрешности
- WordPress admin-bar position fix перенес в reset
- import globs перенес в _main
- jsMediaQueries в описании убрать mobile, перенести в mobileswitchwidth
- в header.js вынести настройку hideOnViewChangе
- header.html подкорректировать описание и исправить ссылки (поменять index.html на /)
- новый стиль light build
- в header добавить max-width: $page-max-width+px; так как он fixed и не реагирует на ширину body
- component-test part для верстки всяких глобалок и тестов
- mixins resize-multiplier
- templates обновить (scrollbar, svg)
- scroll-lock.js в строке 43 убрать " + '>*'", чтобы не выбирал всех детей, а добавлял паддинг только мейну и футеру