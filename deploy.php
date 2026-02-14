<?php
/**
 * Simple Deployment Script for Hostinger / Shared Hosting
 * This script can be used as a GitHub Webhook endpoint or called manually
 * to trigger a 'git pull' and verify the deployment.
 */

// --- CONFIGURATION ---
// Set a secret key to prevent unauthorized access. 
// Add ?key=YOUR_SECRET to the URL to run the script.
$secret_key = 'nexus_deploy_2026';

// --- SECURITY CHECK ---
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    header('HTTP/1.1 403 Forbidden');
    die('403 Forbidden: Invalid or missing secret key.');
}

echo "<h2>Typing Nexus Deployment Status</h2>";
echo "<pre>";

// 1. Current Working Directory
echo "Current Directory: " . getcwd() . "\n";

// 2. Check if .git exists
if (file_exists('.git')) {
    echo "Git repository detected.\n";

    // 3. Attempt Git Pull
    if (function_exists('shell_exec')) {
        echo "Updating known_hosts to trust github.com...\n";
        shell_exec('mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts 2>&1');

        echo "Current Remotes:\n" . shell_exec('git remote -v 2>&1') . "\n";

        echo "Attempting git pull...\n";
        $output = shell_exec('git pull origin main 2>&1');
        echo "Output:\n" . ($output ?: "No output (maybe git pull failed silently)") . "\n";

        echo "\nLast Commit:\n" . shell_exec('git log -1 --pretty=format:"%h - %s (%cr)" 2>&1') . "\n";
    } else {
        echo "Error: shell_exec is disabled on this server. Please use Hostinger's built-in Git 'Auto Deployment' feature.\n";
    }
} else {
    echo "Warning: .git directory not found in the current folder.\n";
}

// 4. Verify dist folder
if (is_dir('dist')) {
    echo "dist/ folder exists.\n";
    $files = scandir('dist');
    echo "Files in dist/: " . count($files) . " items found.\n";
} else {
    echo "Error: dist/ folder NOT found. Please ensure your React build is uploaded.\n";
}

// 5. Check Root Content
echo "\n--- Root Directory Listing ---\n";
$rootFiles = scandir('.');
foreach ($rootFiles as $rf) {
    if ($rf === '.' || $rf === '..')
        continue;
    $type = is_dir($rf) ? '[DIR]' : '[FILE]';
    echo "$type $rf\n";
}

// 6. Check 'data' folder
echo "\n--- Data Folder Check ---\n";
$dataFolders = ['data', 'public/data', 'dist/data'];
foreach ($dataFolders as $df) {
    if (is_dir($df)) {
        echo "Found directory: $df\n";
        $dfiles = scandir($df);
        foreach ($dfiles as $dfile) {
            if ($dfile === '.' || $dfile === '..')
                continue;
            echo "  - $dfile\n";
        }
    } else {
        echo "Directory NOT found: $df\n";
    }
}

echo "\nDeployment check finished at: " . date('Y-m-d H:i:s') . "\n";
echo "</pre>";
?>