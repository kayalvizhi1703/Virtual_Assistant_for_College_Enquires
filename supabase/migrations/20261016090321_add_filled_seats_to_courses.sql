/*
# Add filled_seats column to courses table

## Changes
1. New column: `filled_seats` (integer, NOT NULL, default 0) on the `courses` table.
2. Populate `filled_seats` for every existing course with a random integer
   between 40% and 90% of that course's `intake` value.

## Security
- No RLS policy changes. Existing policies on `courses` remain unchanged.
*/

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS filled_seats integer NOT NULL DEFAULT 0;

UPDATE courses
SET filled_seats = FLOOR(
  (intake * (0.4 + RANDOM() * 0.5))
);
