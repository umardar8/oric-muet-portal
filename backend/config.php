<?php
declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'oric_portal';
const DB_USER = 'root';
const DB_PASS = '';

const ALLOWED_ORIGINS = ['*'];

function apply_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    $allowed = in_array('*', ALLOWED_ORIGINS, true) || in_array($origin, ALLOWED_ORIGINS, true);

    if ($allowed) {
        header('Access-Control-Allow-Origin: ' . ($origin !== '*' ? $origin : '*'));
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_response(array $payload, int $status = 200): void
{
    apply_cors();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['success' => false, 'error' => 'Invalid JSON body.'], 400);
    }

    return $data;
}

function require_fields(array $data, array $fields): void
{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            json_response(['success' => false, 'error' => "Missing field: {$field}"], 422);
        }
    }
}
