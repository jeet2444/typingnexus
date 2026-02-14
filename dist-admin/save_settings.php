<?php
// save_settings.php
// Handles saving settings.json on the server

// CORS headers to allow access from subdomains
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

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Path to settings.json (in the parent directory or same directory depending on structure)
// Since this is likely in /api/ or root, let's assume root for simplicity or adjustable logic.
// If this file is at public/save_settings.php, then settings.json is at public/settings.json
$file = __DIR__ . '/settings.json';

// Validate permissions (basic)
// Use __DIR__ to ensure we write to the same folder as the script
if (!is_writable($file) && !is_writable(__DIR__)) {
    // Attempt to create if not exists
    if (!file_exists($file) && !file_put_contents($file, '{}')) {
        http_response_code(500);
        echo json_encode(["error" => "Server permission denied. Cannot write to file.", "path" => $file]);
        exit;
    }
}

// Write Data
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true, "message" => "Settings saved successfully", "path" => $file]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write data"]);
}
?>