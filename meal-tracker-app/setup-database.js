#!/usr/bin/env node

import https from 'https';
import readline from 'readline';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function setupDatabase() {
  log('🚀 Meal Tracker Database Setup', 'bright');
  log('================================', 'cyan');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function question(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  }

  try {
    // Get Supabase credentials
    log('\n📋 Please provide your Supabase credentials:', 'yellow');
    log('You can find these in your Supabase dashboard under Settings > API', 'cyan');
    
    const projectUrl = await question('Enter your Supabase Project URL (e.g., https://your-project.supabase.co): ');
    const serviceRoleKey = await question('Enter your Supabase Service Role Key: ');
    
    if (!projectUrl || !serviceRoleKey) {
      log('❌ Project URL and Service Role Key are required!', 'red');
      rl.close();
      return;
    }

    // Extract project ID from URL
    const projectId = projectUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectId) {
      log('❌ Invalid Supabase project URL format!', 'red');
      rl.close();
      return;
    }

    log('\n🔧 Setting up database tables...', 'yellow');

    const baseUrl = `https://${projectId}.supabase.co/rest/v1`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    };

    // SQL commands to execute
    const sqlCommands = [
      // Create ingredients table
      `CREATE TABLE IF NOT EXISTS public.ingredients (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        category TEXT,
        unit TEXT NOT NULL,
        cost_per_unit DECIMAL(10,2) DEFAULT 0,
        current_stock DECIMAL(10,2) DEFAULT 0,
        min_stock_level DECIMAL(10,2) DEFAULT 0,
        expiry_date DATE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Create meals table
      `CREATE TABLE IF NOT EXISTS public.meals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        meal_date DATE NOT NULL,
        meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
        total_cost DECIMAL(10,2) DEFAULT 0,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Create meal_ingredients junction table
      `CREATE TABLE IF NOT EXISTS public.meal_ingredients (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE,
        ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
        quantity_used DECIMAL(10,2) NOT NULL,
        cost_contribution DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(meal_id, ingredient_id)
      );`,

      // Enable RLS
      `ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;`,

      // Create RLS policies for ingredients
      `CREATE POLICY "Users can view their own ingredients" ON public.ingredients FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own ingredients" ON public.ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own ingredients" ON public.ingredients FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own ingredients" ON public.ingredients FOR DELETE USING (auth.uid() = user_id);`,

      // Create RLS policies for meals
      `CREATE POLICY "Users can view their own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);`,

      // Create RLS policies for meal_ingredients
      `CREATE POLICY "Users can view meal ingredients for their meals" ON public.meal_ingredients FOR SELECT USING (EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_ingredients.meal_id AND meals.user_id = auth.uid()));`,
      `CREATE POLICY "Users can insert meal ingredients for their meals" ON public.meal_ingredients FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_ingredients.meal_id AND meals.user_id = auth.uid()));`,
      `CREATE POLICY "Users can update meal ingredients for their meals" ON public.meal_ingredients FOR UPDATE USING (EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_ingredients.meal_id AND meals.user_id = auth.uid()));`,
      `CREATE POLICY "Users can delete meal ingredients for their meals" ON public.meal_ingredients FOR DELETE USING (EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_ingredients.meal_id AND meals.user_id = auth.uid()));`,

      // Create indexes
      `CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON public.ingredients(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(meal_date);`,
      `CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal_id ON public.meal_ingredients(meal_id);`,
      `CREATE INDEX IF NOT EXISTS idx_meal_ingredients_ingredient_id ON public.meal_ingredients(ingredient_id);`,

      // Create function and triggers
      `CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ language 'plpgsql';`,
      `CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON public.ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`,
      `CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
    ];

    // Execute SQL commands using Supabase REST API
    const sqlUrl = `https://${projectId}.supabase.co/rest/v1/rpc/exec_sql`;
    
    for (let i = 0; i < sqlCommands.length; i++) {
      const sql = sqlCommands[i];
      log(`\n📝 Executing SQL command ${i + 1}/${sqlCommands.length}...`, 'blue');
      
      try {
        const response = await makeRequest(sqlUrl, {
          method: 'POST',
          headers: headers
        }, {
          query: sql
        });

        if (response.status === 200) {
          log(`✅ Command ${i + 1} executed successfully`, 'green');
        } else {
          log(`⚠️  Command ${i + 1} returned status ${response.status}`, 'yellow');
          log(`Response: ${JSON.stringify(response.data)}`, 'cyan');
        }
      } catch (error) {
        log(`❌ Error executing command ${i + 1}: ${error.message}`, 'red');
      }
    }

    log('\n🎉 Database setup completed!', 'green');
    log('Your Meal Tracker app should now work properly.', 'cyan');
    log('\n📋 Next steps:', 'yellow');
    log('1. Refresh your app at http://localhost:5174/', 'cyan');
    log('2. The "Database Setup Required" messages should disappear', 'cyan');
    log('3. You can now add ingredients and log meals!', 'cyan');

  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

// Run the setup
setupDatabase(); 