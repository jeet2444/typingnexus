<?php
// save_settings.php
// Handles saving JSON data to the server (Settings, Content, Secure Data)

// CORS headers to allow access from subdomains (admin.typingnexus.in -> typingnexus.in)
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
$requestData = json_decode($input, true);

if (!$requestData || !isset($requestData['type']) || !isset($requestData['data'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON structure. Expected 'type' and 'data'."]);
    exit;
}

$type = $requestData['type'];
$dataToSave = $requestData['data'];

// Determine file path based on type
$filename = '';
switch ($type) {
    case 'settings':
        $filename = 'settings.json';
        break;
    case 'content':
        $filename = 'content.json';
        break;
    case 'secure_data':
        $filename = 'secure_data.json'; // Users, History, Invoices
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid data type provided."]);
        exit;
}

// Define the absolute path to the data directory
$targetDir = __DIR__ . '/data';

if (!is_dir($targetDir)) {
    // Attempt to create data directory if it doesn't exist
    if (!mkdir($targetDir, 0755, true)) {
        // Log error if mkdir fails
        http_response_code(500);
        echo json_encode(["error" => "Failed to create data directory at $targetDir. Please check server permissions."]);
        exit;
    }
}

// Ensure the directory is writable
if (!is_writable($targetDir)) {
    http_response_code(500);
    echo json_encode(["error" => "Data directory is not writable at $targetDir. Please check server permissions."]);
    exit;
}

$file = $targetDir . '/' . $filename;

// Security check: Ensure we are writing valid JSON
$jsonContent = json_encode($dataToSave, JSON_PRETTY_PRINT);
if ($jsonContent === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to encode data to JSON"]);
    exit;
}

// Write Data (with backup)
if (file_exists($file)) {
    copy($file, $file . '.bak');
}

if (file_put_contents($file, $jsonContent)) {
    echo json_encode([
        "success" => true,
        "message" => "Saved successfully",
        "type" => $type,
        "file" => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write data to file", "path" => $file]);
}
?>