# 📘 Setup And Installation Guide

# run

cp .env.example .env
docker compose -f database/db.docker-compose.yml up -d

npm install
npm install --save-dev @types/multer

npx prisma migrate reset
npx prisma migrate dev --name migrate_db
npx prisma generate
npx prisma db seed

npm run start

-----------------------------------------------------------------------------------

# 📘 API Documentation

Base URL:

```
http://localhost:3111/api/v1
```

-----------------------------------------------------------------------------------

# 🔐 AUTH APIs

## 🔹 Register Inmate

```
POST /auth/register/inmate
```

### 🔐 Auth

* Required: ✅
* Role: ADMIN

### 🧾 Body

```json
{
    "id": "string",
    "name": "string",
    "password": "string",
    "status": "string",
    "cases": number,
    "caseType": "string",
    "sentence": "string",
    "startDate": "DateTime",
    "transferFrom": "string",
    "releaseDate": "DateTime",
    "progressStep": number,
    "profileImage": "file path (string)",
    "detail": {
        "age": "string",
        "nationality": "string",
        "religion": "string",
        "holdType": "string",
        "holdAgency": "string"
    },
    "secret": "super_secret_admin_registration_key"
}

* example *
{
    "id": "1100801249284",
    "name": "สรวิชญ์ ตันติจิตจารุ",
    "password": "20011966",
    "status": "ชั้นดีมาก",
    "cases": 1,
    "caseType": "gay",
    "sentence": "3 ปี 0 เดือน 7 วัน",
    "startDate": "2025-12-29T00:00:00.000Z",
    "transferFrom": "-",
    "releaseDate": "2027-11-21T00:00:00.000Z",
    "progressStep": 4,
    "profileImage": "/uploads/inmate/1774860987066-364149188.jpeg",
    "detail": {
        "age": "28 ปี 8 เดือน",
        "nationality": "ไทย",
        "religion": "พุทธ",
        "holdType": "ดำเนินคดี",
        "holdAgency": "สภ.จอมทอง"
    },
    "secret": "super_secret_admin_registration_key"
}
```

-----------------------------------------------------------------------------------

## 🔹 Register Admin

```
POST /auth/register/admin
```

### 🔐 Auth

* Required: ❌

### 🧾 Body

```json
{
    "username": "username",
    "password": "password",
    "name": "Full name",
    "secret": "super_secret_admin_registration_key"
}
```

-----------------------------------------------------------------------------------

## 🔹 Login

```
POST /auth/login
```

### 🔐 Auth

* Required: ❌

### 🧾 Body

```json
{
  "username": "string",
  "password": "string"
}
```

-----------------------------------------------------------------------------------

## 🔹 Refresh Token

```
PUT /auth/refresh
```

### 🔐 Auth

* Required: ❌

### 🧾 Body

```json
{
  "username": "username",
  "refreshToken": "string"
}
```

-----------------------------------------------------------------------------------

## 🔹 Logout

```
DELETE /auth/logout
```

### 🔐 Auth

* Required: ❌

### 🧾 Body

```json
{
  "username": "username",
}
```

-----------------------------------------------------------------------------------

# 👤 INMATE APIs

## 🔹 Get All Profiles

```
GET /inmate/profile
```

### 🔐 Auth

* Required: ✅
* Role: Admin

-----------------------------------------------------------------------------------

## 🔹 Get Profile by ID

```
GET /inmate/profile/:id
```

### 🔐 Auth

* Required: ✅
* Role: Any (Admin or Owner Id)

-----------------------------------------------------------------------------------

# 📂 MENU APIs (v1)

## 🔹 Main Menu

```
GET /menu/mainMenu
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 Legal Categories

```
GET /menu/legalCategories
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 PR Departments

```
GET /menu/prDepartments
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

# 🎬 MEDIA APIs (v1)

## 🔹 Content List

```
GET /media/contentList
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* department: LEGAL | ANNOUNCEMENT

-----------------------------------------------------------------------------------

# ⚙️ ADMIN APIs

## 🔹 Create Content

```
POST /admin/add/document
```

### 🔐 Auth

* Required: ✅
* Role: ADMIN

### 🧾 Body

```json
{
  "title": "string",
  "type": "IMAGE | VIDEO | PDF",
  "department": "LEGAL | ANNOUNCEMENT",
  "mainId": "string",
  "subId": "string",
  "groupId": "string",
  "file": "string (url)"
}

* example *
{
    "title": "การปฏิบัติงานของบุคลากร พิเศษ",
    "type": "PDF",
    "department": "PR",
    "mainId": "2-main",
    "file": "/pr/2-main/1774865074822-803338712.Pdf"
}
```

-----------------------------------------------------------------------------------

## 🔹 Create Multiple

```
POST /admin/add/multiple
```

### 🔐 Auth

* Required: ✅
* Role: ADMIN

### 🧾 Body

* same as add single, send in array [] instead. 

-----------------------------------------------------------------------------------

## 🔹 Upload Profile Image

```
POST /admin/upload/profileImage
```
### 🔐 Auth

* Required: ✅
* Role: ADMIN

### 📦 Body (form-data)

| key  | type |
| ---- | ---- |
| file | File |

* file: file

-----------------------------------------------------------------------------------

## 🔹 Upload Document

```
POST /admin/upload/document
```

### 📦 Body (form-data)

| key        | type   |
| ---------- | ------ |
| file       | File   |
| department | string |
| mainId     | string |
| subId      | string |
| groupId    | string |

* file: file

* department: LEGAL | ANNOUNCEMENT

* mainId: string

* subId: string

* groupId: string

-----------------------------------------------------------------------------------

# 📌 Notes

* All protected APIs require:

```
Authorization: Bearer <token>
```

* Upload returns:

```json
{
  "url": "/legal/1-main/xxx.pdf"
}
```

* Use that URL in `createContent`

-----------------------------------------------------------------------------------

# 💀 TL;DR

* Auth → login / register
* Menu → categories
* Media → content display
* Admin → upload + create content

-----------------------------------------------------------------------------------
