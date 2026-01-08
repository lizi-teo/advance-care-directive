import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read .env.local manually
const envFile = readFileSync(join(__dirname, '.env.local'), 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.+)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyTables() {
  console.log('🔍 Verifying Supabase tables...\n')

  try {
    // Check questions table (lowercase)
    console.log('📋 Checking "questions" table...')
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .limit(5)

    if (questionsError) {
      console.error('❌ Error accessing Questions table:', questionsError.message)
    } else {
      console.log('✅ Questions table found!')
      if (questions && questions.length > 0) {
        console.log('   Sample row columns:', Object.keys(questions[0]))
        console.log(`   Found ${questions.length} sample row(s):`)
        questions.forEach((q, i) => {
          console.log(`   ${i + 1}.`, q)
        })
      } else {
        console.log('   Table is empty - please add some questions first')
      }
    }

    console.log()

    // Check answer_options table
    console.log('📋 Checking "answer_options" table...')
    const { data: answerOptions, error: optionsError } = await supabase
      .from('answer_options')
      .select('*')
      .limit(10)

    if (optionsError) {
      console.error('❌ Error accessing answer_options table:', optionsError.message)
    } else {
      console.log('✅ answer_options table found!')
      if (answerOptions && answerOptions.length > 0) {
        console.log('   Sample row columns:', Object.keys(answerOptions[0]))
        console.log(`   Found ${answerOptions.length} sample row(s):`)
        answerOptions.forEach((opt, i) => {
          console.log(`   ${i + 1}.`, opt)
        })
      } else {
        console.log('   Table is empty - please add some answer options first')
      }
    }

    console.log()

    // Check user_responses table
    console.log('📋 Checking "user_responses" table...')
    const { data: responses, error: responsesError } = await supabase
      .from('user_responses')
      .select('*')
      .limit(5)

    if (responsesError) {
      console.error('❌ Error accessing user_responses table:', responsesError.message)
    } else {
      console.log('✅ user_responses table found!')
      if (responses && responses.length > 0) {
        console.log('   Sample row columns:', Object.keys(responses[0]))
        console.log(`   Found ${responses.length} sample row(s):`)
        responses.forEach((r, i) => {
          console.log(`   ${i + 1}.`, r)
        })
      } else {
        console.log('   Table is empty (this is OK - will be populated when users answer questions)')
      }
    }

    console.log()

    // Test insert to user_responses
    console.log('🧪 Testing insert to user_responses...')
    const testInsert = {
      user_id: null, // Anonymous user
      question_id: '66a1583e-3c27-4e6c-9428-385024b4c399',
      answer_option_id: '3b38cd7d-b223-430d-abc4-0ab5b9570e07',
    }

    const { data: insertData, error: insertError } = await supabase
      .from('user_responses')
      .insert(testInsert)
      .select()

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message)
      console.error('   Error details:', insertError)
      console.log('\n   This could be due to:')
      console.log('   1. Row Level Security (RLS) policies blocking inserts')
      console.log('   2. Missing required columns (e.g., user_id)')
      console.log('   3. Authentication required')
    } else {
      console.log('✅ Insert successful!')
      console.log('   Inserted data:', insertData)

      // Clean up test data
      if (insertData && insertData[0]?.id) {
        await supabase.from('user_responses').delete().eq('id', insertData[0].id)
        console.log('   (Test data cleaned up)')
      }
    }

    console.log('\n✅ Database verification complete!')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

verifyTables()
