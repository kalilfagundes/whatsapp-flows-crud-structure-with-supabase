# WhataApp Flows CRUD Using Supabase Database for Services Booking

This project is a generic structure for a WhatsApp Flow Endpoint Server, including a database for services booking.
It was designed using Meta example for [booking-appointment flow](https://github.com/WhatsApp/WhatsApp-Flows-Tools/tree/main/examples/endpoint/nodejs/book-appointment).

## ⚠️ WARNING ⚠️

This project is meant to be an example for prototyping only.
It's not recommended to use this project for any production use.
I live in Brazil, where WhatsApp is widely used and it's a common way to communicate, so I wanted to explore the capabilities of WhatsApp Flows to validate their potential as a basic frontend for CRUD-driven systems.

## Environment Setup

### Database Setup

Create a supabase project and create tables using .sql files in /db-tables folder.

Config the .env file with your supabase url and anon key.

### WhatsApp Flow Endpoint Setup

1. Create a private & public key pair for testing, then follow [these steps to upload the key pair](https://developers.facebook.com/docs/whatsapp/flows/guides/implementingyourflowendpoint#upload_public_key) to your business phone number.
2. Set your environment variables for private key. Make sure a multiline key has correct line breaks.
3. Run the server.

## Create a Whatsapp Flows in your business account using templates on flows-json/admin.json and flows-json/book-appointment.json

1. Go to your Whatsapp Business Account and create flows using the templates on flows-json/admin.json and flows-json/book-appointment.json
2. Set the endpoint of the flows to your servers using the correct routes (/admin for /admin.json and /book-appointment for /book-appointment.json)
3. Test it

## Project Structure

```bash
book-appointment/
├── src/
│   ├── flow.js
│   ├── keyGenerator.js
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── ADD_PROFESSIONAL.js
│   │   │   ├── EDIT_PROFESSIONAL.js
│   │   │   ├── DEFAULT.js
│   │   │   ├── index.js
│   │   │   ├── MANAGE_PROFESSIONAL.js
│   │   │   └── WELCOME.js
│   │   └── book-appointment/
│   │       ├── APPOINTMENT.js
│   │       ├── DEFAULT.js
│   │       └── DETAILS.js
│   │       ├── index.js
│   │       └── SUMMARY.js
│   ├── utils/
│       └── dateHelpers.js
│       └── encryption.js
│       └── scheduleHelpers.js
│   functions/
│       └── professionals.js
│       └── services.js
│       └── appointments.js
│       └── clients.js
│   middleware/
│       └── encryptionMiddleware.js
├── db-tables/
│   └── appointments-table.sql
│   └── professionals-table.sql
│   └── services-table.sql
│   └── professional_schedule-table.sql
├── flows-json/
│   └── admin.json
│   └── book-appointment.json
├── .env
├── package.json
├── server.js
└── README.md
```

## How it works

The server consist of two main flows for now: one for admin and other for user.

- server.js defines the routes for each flow.
- middleware/encryptionMiddleware.js defines the encryption middleware using utils/encryption.js.
- admin/index.js defines the config of the routes for the admin flow.
- user/index.js defines the config of the routes for the user flow.

DEFAULT.js files inside admin and book-appointment folder are responsible for the overall flow logic!

Other files in utils and functions are used to:
- create professionals and services
- edit professionals and services
- delete professionals and services
- create appointments

## What's implemented:

[x] Add, edit and delete professionals
[x] Create appointments
[ ] Visualize schedule
[ ] Add, edit and delete services
