# ORIC Portal Backend Deployment

1. Create a MySQL database in cPanel.
2. Import `backend/schema.sql` into that database with phpMyAdmin.
3. Edit `backend/config.php` and set `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS`.
4. Upload the `backend/` folder to the same public site that serves the React app.
5. Visit `/backend/seed_admin.php` once to create the admin login, then delete `seed_admin.php`.
6. Build the frontend with `VITE_API_BASE_URL=/backend/api.php`.

Default admin seed values:

```text
username: oric.admin
password: Admin@12345
```

For production, change the seed password before running `seed_admin.php` or set environment variables:

```text
ORIC_ADMIN_USERNAME
ORIC_ADMIN_PASSWORD
```

Registered university users are stored in MySQL and will persist after closing the browser.
