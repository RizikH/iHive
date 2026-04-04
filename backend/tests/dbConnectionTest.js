require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TABLES = [
  'users',
  'ideas',
  'tags',
  'idea_tags',
  'collaborations',
  'investments',
  'files',
  'chat_rooms',
  'chat_participants',
  'chat_messages',
];

async function test() {
  console.log(`Testing Supabase connection: ${process.env.SUPABASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const table of TABLES) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`  ❌ ${table.padEnd(20)} ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅ ${table}`);
      passed++;
    }
  }

  console.log(`\n${passed}/${TABLES.length} tables OK${failed > 0 ? `, ${failed} failed` : ''}`);
}

test().catch(console.error);
