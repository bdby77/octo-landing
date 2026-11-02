# Бесплатное восстановление статического сайта Octo

## Граница

GitHub Pages обслуживает только статические страницы. Он не заменяет FastAPI, Telegram polling, платёжные webhooks, SQLite, UDID или zsign. Пока Timeweb VPS заблокирован, установка/активация не работают; Pages-копия явно сообщает об этом и не принимает коды активации.

## Локальная подготовка

Исходники — `deploy/landing/`; каталог-копия — `server/data/catalog.json`. В публичный `public/` входят только HTML/JSON, иконки, CNAME, robots/sitemap и 404. Пароли, токены, сертификаты, БД и IPA не копировать.

`catalog.html` не обращается к приватному API и отключённому CDN. Удалённые изображения не являются доказательством актуальной доступности IPA. После восстановления сервера проверить каталог и включать установку только по проверенным app ID.

## Публикация

Отдельный репозиторий `bdby77/octo-landing` публикуется GitHub Actions из `public/`, без build-команды и секретов в Pages. `CNAME` задаёт `octostore.space`. DNS меняется отдельно после проверки `https://bdby77.github.io/octo-landing/`.

Для `www.octostore.space` нужен отдельный CNAME на `bdby77.github.io` и проверка HTTPS в GitHub Pages. `api`, `pay`, `cdn` не переносятся в Pages.

## Проверка

```powershell
# Из octo/
.\.venv\Scripts\python.exe -m pytest -q
node --check hosting/github-pages/check-static.cjs
node hosting/github-pages/check-static.cjs
```

После DNS: проверить `/`, `/catalog.html`, `/terms.html`, `/privacy.html`, `/catalog.json`, иконки и произвольный 404. Проверить iPhone Safari отдельно. Проверка Pages не означает восстановление платежей/бота/IPA.
