# DOM.mk — огласник за недвижности

Проект по Напреден веб дизајн: Django REST backend + React frontend.

## Најбрзо стартување на Windows

Отвори два Terminal прозорци во PyCharm.

### 1. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

API: http://127.0.0.1:8000/api/  
Admin: http://127.0.0.1:8000/admin/  
Демо admin: `admin` / `admin123`

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Отвори http://localhost:5173

Демо корисник: `demo` / `demo1234`

## Функционалности

- Регистрација и најава со token authentication
- Преглед, пребарување и филтрирање огласи
- Категории: станови, куќи, вили и соби
- Детална страница со галерија од повеќе слики
- Додавање оглас со повеќе фотографии
- Менување и бришење само на сопствени огласи
- Django Admin и конфигурирани media датотеки
- SQLite база, подготвена за лесна замена со PostgreSQL

## API endpoints

- `GET/POST /api/listings/`
- `GET/PUT/PATCH/DELETE /api/listings/{id}/`
- `GET /api/categories/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`

