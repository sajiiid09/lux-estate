# LuxEstate

LuxEstate is a full-stack real-estate booking platform built with:

- **Backend:** Django REST Framework + JWT Authentication  
- **Frontend:** Next.js + React
- **Database:** PostgreSQL  
- **Features:** Property browsing, property detail pages, bookings, payment simulation, user accounts

---

## ✨ Overview

Users can:

- Browse properties by location & category  
- View dynamic property detail pages (`/properties/[slug]`)  
- Book properties (safe, concurrency-protected backend)  
- Manage their bookings  
- Simulate Stripe/bKash payments  
- Register & log in using JWT tokens  
- See username + logout dropdown in navbar when authenticated  
- View clean UI with static images from `public/properties`

---

## 🚀 Running the Project Locally

### 1. Backend (Django)

```bash
cd lux-estate
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
````

Create `.env` in the root:

```
DATABASE_URL=postgres://lux_user:lux_password@localhost:5432/lux_estate_db
DB_NAME=lux_estate_db
DB_USER=lux_user
DB_PASSWORD=lux_password
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://127.0.0.1:6379/1
```

Run migrations & start server:

```bash
python manage.py migrate
python manage.py runserver
```

Backend → [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend → [http://localhost:3000](http://localhost:3000)

---

## ▶️ Usage Flow

1. Register → Login (receives JWT tokens)
2. Browse `/properties`
3. Click a property → opens dynamic detail page
4. Press **Book Now**
5. View bookings at `/bookings`
6. Proceed to payment → simulate success
7. Booking becomes **PAID**

---

## 📌 Notes

* Authentication uses **JWT** (SimpleJWT)
* Payment providers are only **simulated** (Stripe/bKash)
* Backend ensures **no double-booking** using `transaction.atomic()` + `select_for_update()`
* Images load from `public/properties` or backend URLs


<a href="https://github.com/OWNER/REPO/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=OWNER/REPO" />
</a>



