<?php
// api/save_data.php
// Generic Data Saver for Typing Nexus
// Supports saving specific data types to separate JSON files

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['type']) || !isset($data['data'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid Payload. 'type' and 'data' required."]);
    exit;
}

$type = preg_replace('/[^a-zA-Z0-9_-]/', '', $data['type']); // Sanitize filename
$content = $data['data'];

// Define storage directory (one level up from api, into a 'data' folder for security if possible, but for simple hosting, keep in root or protected folder)
// For Hostinger/Shared Hosting, let's store in a 'data' folder in the root or public_html
$storageDir = __DIR__ . '/../data';

if (!file_exists($storageDir)) {
    mkdir($storageDir, 0755, true);
}

$file = $storageDir . '/' . $type . '.json';
$backupFile = $storageDir . '/' . $type . '_backup.json';

// Create backup of existing file
if (file_exists($file)) {
    copy($file, $backupFile);
}

// Write new data
if (file_put_contents($file, json_encode($content, JSON_PRETTY_PRINT))) {
    echo json_encode([
        "success" => true,
        "message" => "Data saved successfully",
        "file" => $type . '.json',
        "timestamp" => time()
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write data to disk"]);
}
?>