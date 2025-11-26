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

    const { question_ids, answers, week_start_date } = await req.json();

    if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid question_ids' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid answers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the correct answers from the database (server-side only)
    const { data: questions, error: questionsError } = await supabaseClient
      .from('quiz_questions')
      .select('id, correct_answer')
      .in('id', question_ids);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate score by comparing user answers with correct answers
    let score = 0;
    const correctAnswersMap = new Map(
      questions?.map((q) => [q.id, q.correct_answer]) || []
    );

    for (const answer of answers) {
      const correctAnswer = correctAnswersMap.get(answer.question_id);
      if (correctAnswer && answer.selected_answer === correctAnswer) {
        score++;
      }
    }

    // Store the quiz attempt with only the user's selections (not correct answers)
    const { data: attempt, error: attemptError } = await supabaseClient
      .from('quiz_attempts')
      .upsert({
        user_id: user.id,
        week_start_date,
        question_ids,
        answers,
        score,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,week_start_date'
      })
      .select()
      .single();

    if (attemptError) {
      console.error('Error saving quiz attempt:', attemptError);
      return new Response(
        JSON.stringify({ error: 'Failed to save quiz attempt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        score,
        total: question_ids.length,
        attempt_id: attempt.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-quiz function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});