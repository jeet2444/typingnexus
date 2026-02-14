<?php
/**
 * EMERGENCY GIT FIXER
 * Upload this to your Hostinger root directory and visit:
 * https://typingnexus.in/fix_git.php
 */

echo "<h2>Hostinger Git Fixer</h2>";
echo "<pre>";

if (is_dir('.git')) {
    echo "1. Fetching latest changes from GitHub...\n";
    echo shell_exec('git fetch --all 2>&1');

    echo "\n2. Forcing local files to match GitHub (Resetting to origin/main)...\n";
    echo "WARNING: This will overwrite any LOCAL changes on the server.\n";
    echo shell_exec('git reset --hard origin/main 2>&1');

    echo "\n3. Final Pull...\n";
    echo shell_exec('git pull origin main 2>&1');
} else {
    echo "Error: .git directory not found. Are you in the right folder?\n";
}

echo "\nDone. You can delete this file now.";
echo "</pre>";
?>