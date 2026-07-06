<?php
declare(strict_types=1);

require __DIR__ . '/config.php';
apply_cors();

$method = $_SERVER['REQUEST_METHOD'];
$path = trim((string) parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$script = trim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/');
$relativePath = $script && strpos($path, $script) === 0 ? trim(substr($path, strlen($script)), '/') : $path;
$segments = array_values(array_filter(explode('/', str_replace('api.php', '', $relativePath))));
$resource = $segments[0] ?? ($_GET['action'] ?? '');

try {
    if ($method === 'GET' && ($resource === 'health' || $resource === '')) {
        json_response(['success' => true, 'message' => 'ORIC Portal API is running.']);
    }

    if ($method === 'GET' && $resource === 'state') {
        $key = $_GET['key'] ?? ($segments[1] ?? null);
        if ($key) {
            $stmt = db()->prepare('SELECT state_json FROM portal_state WHERE state_key = ?');
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            json_response([
                'success' => true,
                'key' => $key,
                'value' => $row ? json_decode((string) $row['state_json'], true) : null,
            ]);
        }

        $rows = db()->query('SELECT state_key, state_json FROM portal_state')->fetchAll();
        $state = [];
        foreach ($rows as $row) {
            $state[$row['state_key']] = json_decode((string) $row['state_json'], true);
        }
        json_response(['success' => true, 'state' => $state]);
    }

    if (($method === 'POST' || $method === 'PUT') && $resource === 'state') {
        $data = request_json();
        require_fields($data, ['key']);

        $stmt = db()->prepare(
            'INSERT INTO portal_state (state_key, state_json)
             VALUES (:state_key, :state_json)
             ON DUPLICATE KEY UPDATE state_json = VALUES(state_json), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([
            ':state_key' => $data['key'],
            ':state_json' => json_encode($data['value'] ?? null, JSON_UNESCAPED_SLASHES),
        ]);

        json_response(['success' => true]);
    }

    if ($method === 'POST' && $resource === 'register') {
        $data = request_json();
        require_fields($data, ['name', 'email', 'password', 'portal_type']);

        if (!in_array($data['portal_type'], ['undergraduate', 'postgraduate', 'faculty'], true)) {
            json_response(['success' => false, 'error' => 'Self-registration is only available for university users.'], 422);
        }

        $exists = db()->prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1');
        $exists->execute([':email' => $data['email']]);
        if ($exists->fetch()) {
            json_response(['success' => false, 'error' => 'An account with this email already exists.'], 409);
        }

        $stmt = db()->prepare(
            'INSERT INTO users (name, email, username, password_hash, portal_type, department, designation, roll_number, employee_id, phone)
             VALUES (:name, :email, :username, :password_hash, :portal_type, :department, :designation, :roll_number, :employee_id, :phone)'
        );

        $stmt->execute([
            ':name' => $data['name'],
            ':email' => strtolower($data['email']),
            ':username' => strtolower($data['email']),
            ':password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            ':portal_type' => $data['portal_type'],
            ':department' => $data['department'] ?? null,
            ':designation' => $data['designation'] ?? null,
            ':roll_number' => $data['roll_number'] ?? null,
            ':employee_id' => $data['employee_id'] ?? null,
            ':phone' => $data['phone'] ?? null,
        ]);

        $userId = (int) db()->lastInsertId();
        $userStmt = db()->prepare(
            'SELECT id, name, email, username, portal_type, department, designation, roll_number, employee_id, phone, status, created_at
             FROM users WHERE id = ?'
        );
        $userStmt->execute([$userId]);

        json_response(['success' => true, 'user' => $userStmt->fetch()], 201);
    }

    if ($method === 'POST' && $resource === 'login') {
        $data = request_json();
        require_fields($data, ['identifier', 'password']);

        $stmt = db()->prepare(
            'SELECT * FROM users
             WHERE (LOWER(email) = LOWER(:identifier) OR LOWER(username) = LOWER(:identifier))
             AND status = "active"
             LIMIT 1'
        );
        $stmt->execute([':identifier' => $data['identifier']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            json_response(['success' => false, 'error' => 'Invalid credentials.'], 401);
        }

        unset($user['password_hash']);
        json_response(['success' => true, 'user' => $user]);
    }

    if ($method === 'GET' && $resource === 'posts') {
        $portalType = $_GET['portal_type'] ?? null;
        if ($portalType) {
            $stmt = db()->prepare(
                'SELECT p.*, p.apply_link AS applyLink, p.image_url AS image FROM portal_posts p
                 INNER JOIN portal_post_audiences a ON a.post_id = p.id
                 WHERE a.portal_type = :portal_type AND p.status = "open"
                 ORDER BY p.created_at DESC'
            );
            $stmt->execute([':portal_type' => $portalType]);
        } else {
            $stmt = db()->query('SELECT *, apply_link AS applyLink, image_url AS image FROM portal_posts ORDER BY created_at DESC');
        }
        json_response(['success' => true, 'posts' => $stmt->fetchAll()]);
    }

    if ($method === 'POST' && $resource === 'upload-image') {
        if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
            json_response(['success' => false, 'error' => 'No image file was uploaded.'], 422);
        }

        $file = $_FILES['image'];
        if ($file['size'] > 3 * 1024 * 1024) {
            json_response(['success' => false, 'error' => 'Image must be smaller than 3 MB.'], 422);
        }

        $mime = mime_content_type($file['tmp_name']);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];
        if (!isset($extensions[$mime])) {
            json_response(['success' => false, 'error' => 'Only JPG, PNG, WEBP, and GIF images are allowed.'], 422);
        }

        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
        $target = $uploadDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            json_response(['success' => false, 'error' => 'Unable to save uploaded image.'], 500);
        }

        json_response(['success' => true, 'url' => 'backend/uploads/' . $filename], 201);
    }

    if ($method === 'POST' && $resource === 'posts') {
        $data = request_json();
        require_fields($data, ['type', 'title', 'body', 'audience']);

        db()->beginTransaction();
        $stmt = db()->prepare('INSERT INTO portal_posts (type, title, body, meta, apply_link, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['type'],
            $data['title'],
            $data['body'],
            $data['meta'] ?? null,
            $data['applyLink'] ?? $data['apply_link'] ?? null,
            $data['image'] ?? $data['imageUrl'] ?? $data['image_url'] ?? null,
            $data['created_by'] ?? null,
        ]);
        $postId = (int) db()->lastInsertId();

        $audienceStmt = db()->prepare('INSERT INTO portal_post_audiences (post_id, portal_type) VALUES (?, ?)');
        foreach ($data['audience'] as $portalType) {
            $audienceStmt->execute([$postId, $portalType]);
        }
        db()->commit();

        json_response(['success' => true, 'id' => $postId], 201);
    }

    if ($method === 'POST' && $resource === 'submissions') {
        $data = request_json();
        require_fields($data, ['user_id', 'feature_key', 'portal_type', 'title']);

        $stmt = db()->prepare(
            'INSERT INTO submissions (user_id, feature_key, portal_type, title, summary, details, image_url)
             VALUES (:user_id, :feature_key, :portal_type, :title, :summary, :details, :image_url)'
        );
        $stmt->execute([
            ':user_id' => $data['user_id'],
            ':feature_key' => $data['feature_key'],
            ':portal_type' => $data['portal_type'],
            ':title' => $data['title'],
            ':summary' => $data['summary'] ?? null,
            ':details' => $data['details'] ?? null,
            ':image_url' => $data['image'] ?? $data['imageUrl'] ?? $data['image_url'] ?? null,
        ]);

        json_response(['success' => true, 'id' => db()->lastInsertId()], 201);
    }

    if ($method === 'PATCH' && $resource === 'submissions') {
        $data = request_json();
        require_fields($data, ['id', 'status']);

        $stmt = db()->prepare(
            'UPDATE submissions
             SET status = :status, remarks = :remarks, reviewed_by = :reviewed_by, reviewed_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute([
            ':id' => $data['id'],
            ':status' => $data['status'],
            ':remarks' => $data['remarks'] ?? null,
            ':reviewed_by' => $data['reviewed_by'] ?? null,
        ]);

        json_response(['success' => true]);
    }

    if ($method === 'GET' && $resource === 'users') {
        $search = '%' . ($_GET['search'] ?? '') . '%';
        $limit = 20;
        $offset = max(0, ((int) ($_GET['page'] ?? 1) - 1) * $limit);
        $stmt = db()->prepare(
            'SELECT id, name, email, username, portal_type, department, designation, status, created_at
             FROM users
             WHERE name LIKE :search OR email LIKE :search OR username LIKE :search
             ORDER BY created_at DESC
             LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':search', $search);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        json_response(['success' => true, 'users' => $stmt->fetchAll()]);
    }

    json_response(['success' => false, 'error' => 'Endpoint not found.'], 404);
} catch (Throwable $error) {
    if (db()->inTransaction()) {
        db()->rollBack();
    }
    json_response(['success' => false, 'error' => $error->getMessage()], 500);
}
