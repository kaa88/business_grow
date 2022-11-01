# Project NOTE
New site template v3.02


### TO DO:

= научить transition lock разпознавать модули, чтобы не было отказов при нескольких действиях сразу... и scrolllock по идее тоже (хотя лучше сделать noTransLock более удобным)
= если один модуль ссылается на другой, надо сделать внутреннюю функцию типа onmenuclose (например в script.js после объявления модуля), а выполнение вывести в отдельный блок, в котором 1 раз прописывается что делать... чтобы не рыться в коде одного модуля при изменении в другом... или наоборот в текущем модуле сделать блок для обработки входящих запросов... цель - избавиться от записей такого типа "this.refs.header.close(false, true)"
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
- modal - параметр, который закрывает предыдущие окна при открытии новых (closeOldIfNew)
- modal - on-функция теперь может срабатывать на всех окнах (параметр 'any')
- modal и header - параметр noTransLock
- modal - переделана логика closeOldIfNew для правильной работы с on-functions и проверки наличия открытых окон
- modal - вынесена функция check для использования в других модулях
- swiper - в оффлайн версии добавлены настройки (overflow hidden) и описание (script.js, swiper.js)
- вынести light build за границы footer (footer.html)
- header.menu - разделены open и close buttons... не знаю добавлять или нет на постоянную основу? позволяет более гибко использовать кнопки (например для закрытия модалок)
- переделать iconfont на svg шаблон
- globs - добавить классы desktop-only, mobile-only, nowrap
- form-to-email - добавлен скрипт для чекбоксов (вписывает value, чтобы делать проверки и вписывать в formdata) (formtoemail.js, script.js) - добавить описание
- form-to-email - обновлена очистка формы - чекбоксы и радио чистит особым образом (formtoemail.js) - добавить описание... только time-select убрать
- form-to-email - функции onsend, onerror (formtoemail.js, script.js) - добавить описание
- select - добавлена функция reset (нужна???) (select.js) - добавить описание
- шаблон формы - поменять название прогресс-бокса и переделать размеры точек (templates, form.scss)
- header - button-box для open/close btns
- mixins.scss - добавлено описание к em
- colors.scss - заменить название переменных на c01 - устал вписывать 'color' постоянно
- перенести класс page-home в @include ... 'bodyclass': 'page-home',
- цвета в main - чтобы не глючили, перенести body в globs, a инклуды в style (глючит, когда происходит двойное подключение файла colors)
- style.scss - переменные типа $mobile переименовать в $media-mobile (для удобства сниппетов)
- aspectRatioCalculator... и developer panel (script.js, dev_panel.js)
- header - mobileViewService сделать проверки на наличие частей, чтобы не лазить вручную не отключать
- header - если выключен scroll header, то при нажатии появляется разрыв, надо сделать scroll header всегда
- header - ссылки на index.html оставить в случае, если страницы не в корне сайта (сделать коммент)
- 404.scss - не выделять в отдельный файл, а просто писать в main ?
- form - добавил проверку через класс _req-one (надо нет?)
- папка img - _DUMMY@2x.jpg (так же добавлено в сниппеты)
- select - добавлен пересчет высоты враппера и сворачивание при ресайзе (select.js)
- no script alert в footer ?
- body - стили скроллбаров засунуть в media desktop, чтобы на мобиле не путались
- aspect ratio переменные и миксин (style, mixins)
- rotation alert (index.html, footer.html, globs)
- #templates - input number
- style - убрать переменные типа modal-header2, а использовать везде modal-mobile-xs... попробовать переделать цветовые переменные так же, типа c-main c-accent c-text
- print - настроить хедер, чтобы адрес и qr смотрелись... сделать заготовку для свайпера, чтобы перебивать враппер в грид с расстановкой auto-fit
- header menu - для FF у враппера заменить в height в формуле 100% на 100vh ? лечится отключением эмуляции сенсорного ввода
- сохранить mob-bg-calc (css js)