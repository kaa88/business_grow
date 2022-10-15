# Project NOTE
New site template v3.02


### TO DO:
- модал
- сделать проверку форм и переходы


= упростить базовый шаблон, редкие вещи (типа animated burger) комментировать, все необходимые эл-ты раскрасить в разные цвета, добавить комментарии что и для чего нужно
= на случай если нет интернета, делать снимок проекта из фигмы


### Template changes: "+" - внесенные изменения в папке TEST
+ чтобы цветовые css переменные закрашивались, создал файл colors.scss... нужно его импортить в каждый модульный файл (@import "../colors";)
+ названия переменных цветов переделать на $color01, т.к. -1 после десятого начинает неправильно закрашивать
+ в разделе цветов сделать переменные градиентов $gradient01
+ main.scss в .main min-height в формуле отнять 1 рх, чтобы не вылезала прокрутка из-за погрешности
+ WordPress admin-bar position fix перенес в reset
+ import globs перенес в _main
+ jsMediaQueries в описании убрать mobile, перенести в mobileswitchwidth
+ header.html подкорректировать описание и исправить ссылки (поменять index.html на /)
+ новый стиль light build
+ в header добавить max-width: $page-max-width+px; так как он fixed и не реагирует на ширину body
+ component-test part для верстки всяких глобалок и тестов (#ct.html)
+ mixins resize-multiplier, text-max-lines
+ templates обновить (scrollbar, svg)
+ scroll-lock.js в строке 43 убрать " + '>*'", чтобы не выбирал всех детей, а добавлял паддинг только мейну и футеру
+ Project NOTE немного переделан
+ svg-sprite переименовать в svg-templates
+ modal изменить строку <p class="test-article" style="font-size: 50px;"> и убрать стили из css (чтобы не забывать про него)
- в header.js вынести настройку hideOnViewChangе
- header menu перенести скроллинг из меню во враппер, чтобы все уровни скролились при маленькой высоте
- неправильная расстановка стилей для :visited, надо проверить
- script.js имена переменных для объектов из конструктора (swiper, select...) именовать наоборот, как slider_имя
- #templates fix in input-radio (и checkbox)... в css изменить flex gap на margin (для старых safari)
- swiper модуль для верстки без интернета (swiper.js, script.js)
- script.js - body em checker (???)
- gulp - убрать css_media_queries
- убрать _icons.scss и работать с svg и спрайтами
- css - убрать _ у названий кусков (+импорты в style, main)
- сделал, чтобы при верстке шрифты не выдавали ошибку в девтулсах (gulpfile, mixins, style)... не сделано в iconfonts
- modal - добавлен расчет z-index, чтобы каждое новое окно открывалось свехру (раньше порядок был как указано в html)
- modal - параметр, который закрывает предыдущие окна при открытии новых
- modal - on-функция теперь может срабатывать на всех окнах (параметр 'any')
- swiper - в оффлайн версии добавлены настройки (overflow hidden) и описание (script.js, swiper.js)
- вынести light build за границы footer (footer.html)
- header.menu - разделены open и close buttons... не знаю добавлять или нет на постоянную основу? позволяет более гибко использовать кнопки (например для закрытия модалок)
- modal - closeAll параметр noScrollLock
- переделать iconfont на svg шаблон
- globs добавить классы desktop-only mobile-only