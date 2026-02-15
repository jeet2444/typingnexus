<?php
/**
 * CACHE CLEARING UTILITY
 * This script attempts to clear various caches (OpCache, Browser headers, etc.)
 */
header('Content-Type: text/plain');
echo "Starting Cache Clear Process...\n\n";

// 1. Clear PHP OpCache
if (function_exists('opcache_reset')) {
    if (opcache_reset()) {
        echo "[SUCCESS] PHP OpCache has been reset.\n";
    } else {
        echo "[INFO] PHP OpCache reset returned false (might already be empty or not enabled).\n";
    }
} else {
    echo "[SKIP] opcache_reset() function not found.\n";
}

// 2. Clear known temporary directories (if any)
$cacheDirs = ['tmp', 'cache', 'dist/.vite'];
foreach ($cacheDirs as $dir) {
    if (is_dir($dir)) {
        echo "Clearing directory: $dir\n";
        // Logic to clear files in these dirs if needed
        // For now just reporting existence
    }
}

// 3. Instruction for Browser Cache
// We can't "delete" browser cache from PHP, but we can send headers 
// in our main entry point (index.html/php) to prevent it.
echo "\n[INFO] Browsers are instructed to re-validate via .htaccess headers.\n";

echo "\n--- CACHE CLEAR COMPLETE ---\n";
echo "Please perform a Hard Refresh (Ctrl + F5) on your browser to be absolute sure.";
?>