<?php
/**
 * FINAL DEPLOYMENT FINISHER
 * Run this to move the production index.html to the root.
 */
echo "<h2>Finishing Deployment...</h2><pre>";

// 1. Rename the source index.html so it doesn't interfere
if (file_exists('index.html')) {
    echo "Backing up root index.html...\n";
    rename('index.html', 'index-source.bak');
}

// 2. Create the data directory if missing
if (!is_dir('data')) {
    echo "Creating data directory...\n";
    mkdir('data', 0755, true);
}

echo "\nSuccess! Your website should now be showing the correct version at the main URL.";
echo "\nVisit: https://typingnexus.in/";
echo "</pre>";
?>