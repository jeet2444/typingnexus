<?php
/**
 * FINAL DEPLOYMENT FINISHER
 * Run this to move the production index.html to the root.
 */
echo "<h2>Finishing Deployment...</h2><pre>";

// 1. Backup and Swap index.html
if (file_exists('index.html')) {
    echo "Backing up root index.html...\n";
    rename('index.html', 'index-source.bak_' . time());
}

if (file_exists('dist/index.html')) {
    echo "Copying dist/index.html to root...\n";
    copy('dist/index.html', 'index.html');
    echo "Successfully updated root index.html with production build.\n";
} else {
    echo "Error: dist/index.html not found. Did the build finish?\n";
}

// 2. Create the data directory if missing
if (!is_dir('data')) {
    echo "Creating data directory...\n";
    mkdir('data', 0755, true);
}

echo "\n--- SUCCESS ---\n";
echo "Your website should now be showing the NEW version at https://typingnexus.in/";
echo "\nIf it's still white, please clear your browser cache (Ctrl+F5).";
echo "</pre>";
?>