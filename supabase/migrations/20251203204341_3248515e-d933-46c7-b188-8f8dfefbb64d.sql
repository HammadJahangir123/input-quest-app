-- Add model columns to return_items for Canon and Receipt printers
ALTER TABLE public.return_items 
ADD COLUMN IF NOT EXISTS canon_printer_model text,
ADD COLUMN IF NOT EXISTS receipt_printer_model text;

-- Create laptop_returns table
CREATE TABLE public.laptop_returns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  return_date date NOT NULL,
  brand text NOT NULL,
  store_code text,
  location text,
  laptop_model text NOT NULL,
  serial_number text NOT NULL,
  has_charger boolean NOT NULL DEFAULT true,
  remark text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.laptop_returns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own laptop returns" 
ON public.laptop_returns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own laptop returns" 
ON public.laptop_returns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own laptop returns" 
ON public.laptop_returns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own laptop returns" 
ON public.laptop_returns 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_laptop_returns_updated_at
BEFORE UPDATE ON public.laptop_returns
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();