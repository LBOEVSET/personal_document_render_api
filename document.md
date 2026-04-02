# 📘 Setup And Installation Guide

# run

cp .env.example .env
docker compose -f database/db.docker-compose.yml up -d

npm install
npm install --save-dev @types/multer

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
    "daysLeft": number,
    "totalDays": number,
    "cases": number,
    "caseType": "string",
    "sentence": "string",
    "startDate": "string",
    "transferFrom": "string",
    "releaseDate": "string",
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
    "daysLeft": 12,
    "totalDays": 18,
    "cases": 1,
    "caseType": "gay",
    "sentence": "3 ปี 0 เดือน 7 วัน",
    "startDate": "29 ธันวาคม 2568",
    "transferFrom": "-",
    "releaseDate": "21 พฤศจิกายน 2570",
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
* Role: Any

-----------------------------------------------------------------------------------

## 🔹 Get Profile by ID

```
GET /inmate/profile/:id
```

### 🔐 Auth

* Required: ✅
* Role: Any

-----------------------------------------------------------------------------------

## 🔹 Get All Details

```
GET /inmate/detail
```

### 🔐 Auth

* Required: ✅
* Role: Any

-----------------------------------------------------------------------------------

## 🔹 Get Detail by ID

```
GET /inmate/detail/:id
```

### 🔐 Auth

* Required: ✅
* Role: Any

-----------------------------------------------------------------------------------

# 🛠 ADMIN INMATE APIs

### 🔐 Auth

* Required: ✅
* Role: ADMIN

Same endpoints as above:

```
GET /inmate/admin/profile
GET /inmate/admin/profile/:id
GET /inmate/admin/detail
GET /inmate/admin/detail/:id
```

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

## 🔹 Legal Sub Items

```
GET /menu/legalSubItem
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 Legal Group Items

```
GET /menu/legalGroupItem
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

* subId: string

-----------------------------------------------------------------------------------

## 🔹 PR Departments

```
GET /menu/prDepartments
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 PR Sub Items

```
GET /menu/prSubItem
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 PR Group Items

```
GET /menu/prGroupItem
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

* subId: string

-----------------------------------------------------------------------------------

# 📂 MENU APIs (v2)

Same as v1 but cleaner naming:

```

GET /menu/legalSubCategories

GET /menu/legalGroupCategories

GET /menu/prSubCategories

GET /menu/prGroupCategories

```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

# 🎬 MEDIA APIs (v1)

## 🔹 Info Graphics

```

GET /media/infoGraphics

```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 Legal Content

```
GET /media/legalContentItems
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 Standard Shelf

```
GET /media/getStandardShelfItems
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 Images

```
GET /media/shelfRow1Images
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 Videos

```
GET /media/shelfRow2Videos
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 PDFs

```
GET /media/shelfRow3PDFs
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* mainId: string

-----------------------------------------------------------------------------------

## 🔹 Content List

```
GET /media/contentList
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* department: LEGAL | ANNOUNCEMENT

-----------------------------------------------------------------------------------

## 🔹 Content Registry

```
GET /media/contentRegistry
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

# 🎬 MEDIA APIs (v2)

## 🔹 Content List

```
GET /media/contentList
```

### 🔐 Auth

* Required: ❌

-----------------------------------------------------------------------------------

## 🔹 Content By Layer

```
GET /media/contentListByLayer
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* department: LEGAL | ANNOUNCEMENT

* mainId: string

* subId: string

* groupId: string

-----------------------------------------------------------------------------------

## 🔹 Strict Layer (No fallback)

```
GET /media/getContentBySensitiveLayer
```

### 🔐 Auth

* Required: ❌

### 📌 Query

* department: LEGAL | ANNOUNCEMENT

* mainId: string

* subId: string

* groupId: string

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
* Layer API → strict filtering (main/sub/group)

-----------------------------------------------------------------------------------
