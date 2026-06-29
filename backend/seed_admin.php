<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

$username = getenv('ORIC_ADMIN_USERNAME') ?: 'oric.admin';
$password = getenv('ORIC_ADMIN_PASSWORD') ?: 'Admin@12345';

$stmt = db()->prepare(
    'INSERT INTO users (name, username, password_hash, portal_type, department, designation, status)
     VALUES (:name, :username, :password_hash, "admin", "ORIC Administration", "Portal Administrator", "active")
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = "active"'
);

$stmt->execute([
    ':name' => 'Admin',
    ':username' => $username,
    ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
]);

json_response([
    'success' => true,
    'message' => 'Admin account is ready. Delete seed_admin.php after running it on the server.',
    'username' => $username,
]);
