
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ebglthtyiwsqxncbkwyt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2x0aHR5aXdzcXhuY2Jrd3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDY2MDgsImV4cCI6MjA4NTg4MjYwOH0.81L9XOBXDDJ2AclPQEy_odsAKSkfB7yOloCsjnaWsZ4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking Supabase Connection...");
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("❌ Connection Failed:", error.message);
        } else {
            console.log("✅ Connection Successful!");
            console.log(`✅ 'profiles' table exists and is accessible. (Count query returned: ${data})`);
        }
    } catch (e: any) {
        console.error("❌ Unexpected Error:", e.message);
    }
}

checkSchema();
