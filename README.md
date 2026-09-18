DOM.mk — Огласник за недвижности

DOM.mk е full-stack веб-апликација за објавување и пребарување огласи за недвижности. Платформата е фокусирана на станови, куќи, вили и соби и овозможува едноставно пребарување, детални огласи и директен контакт со огласувачот.

Технологии

Backend

Python

Django

Django REST Framework

Token Authentication

SQLite

Pillow

django-cors-headers

Frontend

React

Vite

React Router

Lucide React

CSS3 и responsive design

Функционалности

регистрација и најава на корисници;

token authentication;

преглед на сите огласи;

пребарување според град, населба или адреса;

филтрирање според категорија и тип на трансакција;

категории: стан, куќа, вила и соба;

продажба и изнајмување недвижности;

детална страница за секој оглас;

повеќе фотографии за еден оглас;

објавување нов оглас;

бришење само на сопствен оглас;

контакт со огласувачот;

Django Admin панел;

responsive приказ за desktop, tablet и mobile.

Архитектура

Frontend-от и backend-от се одделни апликации и комуницираат преку REST API.

SQLite → Django ORM → Django REST API → React → кориснички интерфејс

Податоците се чуваат во SQLite база. Django ги чита и запишува преку ORM, serializer-ите ги претвораат во JSON, а React ги презема преку HTTP барања.

Модели

User — корисник на апликацијата;

Category — категорија на недвижност;

Listing — главни информации за огласот;

ListingImage — фотографии поврзани со огласот.

Релацијата меѓу Listing и ListingImage е one-to-many: еден оглас може да има повеќе фотографии.

API endpoints

Method

Endpoint

Опис

GET

/api/listings/

Листа на огласи

POST

/api/listings/

Креирање оглас

GET

/api/listings/{id}/

Детали за оглас

PUT/PATCH

/api/listings/{id}/

Измена на сопствен оглас

DELETE

/api/listings/{id}/

Бришење сопствен оглас

GET

/api/categories/

Листа на категории

POST

/api/auth/register/

Регистрација

POST

/api/auth/login/

Најава

GET

/api/auth/me/

Податоци за најавениот корисник

Локално стартување

Потребни се Python и Node.js.

1. Backend

cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver

Backend API: http://127.0.0.1:8000/api/

Django Admin: http://127.0.0.1:8000/admin/

2. Frontend

Во нов Terminal:

cd frontend
npm install
npm run dev

Frontend: http://localhost:5173/

Демо корисници

Обичен корисник:

username: demo
password: demo1234

Администратор:

username: admin
password: admin123
