-- Add is_calculation field to quiz_questions to determine timer duration
ALTER TABLE public.quiz_questions 
ADD COLUMN is_calculation BOOLEAN NOT NULL DEFAULT false;

-- Modify quiz_attempts to only store answer selections, not full questions
ALTER TABLE public.quiz_attempts 
DROP COLUMN questions,
ADD COLUMN question_ids UUID[] NOT NULL DEFAULT '{}';

-- Update answers column to be simpler - just store user's selected answers
COMMENT ON COLUMN public.quiz_attempts.question_ids IS 'Array of question IDs for this quiz attempt';
COMMENT ON COLUMN public.quiz_attempts.answers IS 'JSONB array of user answer selections: [{"question_id": "uuid", "selected_answer": "A"}]';