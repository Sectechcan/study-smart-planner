import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { week_start_date } = await req.json();

    // Get 10 random questions: mix of maths, science, and english
    // Approximately 3-4 questions from each subject
    const subjects = ['maths', 'science', 'english'];
    const questionsPerSubject = Math.floor(10 / subjects.length);
    const remainder = 10 % subjects.length;

    let allQuestions = [];

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const count = questionsPerSubject + (i < remainder ? 1 : 0);

      const { data: subjectQuestions, error: questionsError } = await supabaseClient
        .from('quiz_questions')
        .select('id, subject, question, option_a, option_b, option_c, option_d, is_calculation')
        .eq('subject', subject)
        .limit(100);

      if (questionsError) {
        console.error(`Error fetching ${subject} questions:`, questionsError);
        continue;
      }

      // Randomly select questions from this subject
      const shuffled = subjectQuestions?.sort(() => 0.5 - Math.random()) || [];
      allQuestions.push(...shuffled.slice(0, count));
    }

    // Shuffle all questions together
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());

    // Check if user already attempted this week's quiz
    const { data: existingAttempt } = await supabaseClient
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start_date', week_start_date)
      .maybeSingle();

    return new Response(
      JSON.stringify({ 
        questions: shuffledQuestions,
        has_attempted: !!existingAttempt,
        attempt: existingAttempt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-weekly-quiz function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});