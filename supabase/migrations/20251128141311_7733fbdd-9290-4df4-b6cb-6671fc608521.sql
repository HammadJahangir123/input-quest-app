-- Add remark and scanner columns to return_items table
ALTER TABLE public.return_items 
ADD COLUMN remark text,
ADD COLUMN scanner text;