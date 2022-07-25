Used: New site template v3.02

# Project NOTE

### TO DO:
- из-за чего-то виснет дев тулс браузера
- неправильная расстановка стилей для :visited, надо проверить

!!! синхронизировать контейнеры в хедере и контенте


### Template changes:
- чтобы цветовые css переменные закрашивались, создал файл colors.scss... нужно его импортить в каждый модульный файл (@import "../colors";)
- в разделе цветов сделать переменные градиентов $gradient-1
- main.scss в .main min-height в формуле отнять 1 рх, чтобы не вылезала прокрутка из-за погрешности
- WordPress admin-bar position fix перенес в reset
- import globs перенес в _main
- jsMediaQueries в описании убрать mobile, перенести в mobileswitchwidth
- в header.js вынести настройку hideOnViewChangе
- header.html подкорректировать описание и исправить ссылки (поменять index.html на /)
- новый стиль light build
- в header добавить max-width: $page-max-width+px; так как он fixed и не реагирует на ширину body