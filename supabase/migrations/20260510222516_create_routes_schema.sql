CREATE TABLE IF NOT EXISTS routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    crag_id uuid NOT NULL REFERENCES public.crags(id) ON DELETE CASCADE,
    sector_id uuid,
    name text NOT NULL,
    grade text NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT routes_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT routes_grade_not_empty CHECK (length(trim(grade)) > 0)
);

CREATE trigger routes_set_updated_at
  BEFORE UPDATE ON public.routes
  for each ROW
  EXECUTE FUNCTION extensions.moddatetime (updated_at);

CREATE index routes_crag_id_idx ON public.routes (crag_id);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "routes are viewable by everyone"
  ON public.routes
  FOR SELECT
  TO anon, authenticated
  USING (true);
