<?php
// api/get_data.php
// Generic Data Retriever for Typing Nexus

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_GET['type'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing 'type' parameter"]);
    exit;
}

$type = preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['type']); // Sanitize
$storageDir = __DIR__ . '/../data';
$file = $storageDir . '/' . $type . '.json';

if (file_exists($file)) {
    $content = file_get_contents($file);
    echo $content; // Return raw JSON content
} else {
    // Return empty array/object or specific error depending on need
    // For React app consistency, returning empty array or null
    echo json_encode([]);
}
?>