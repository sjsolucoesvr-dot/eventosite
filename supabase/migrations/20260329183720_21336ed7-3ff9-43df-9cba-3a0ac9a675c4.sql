-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- EVENTS
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  type text DEFAULT 'casamento',
  title text NOT NULL,
  subtitle text,
  date date,
  time time,
  location text,
  location_address text,
  location_lat decimal,
  location_lng decimal,
  welcome_message text,
  story text,
  theme text DEFAULT 'classico',
  color_primary text DEFAULT '#C9A96E',
  color_secondary text DEFAULT '#1A1A2E',
  color_accent text DEFAULT '#FFF0F3',
  font_title text DEFAULT 'Playfair Display',
  font_body text DEFAULT 'DM Sans',
  hero_image_url text,
  pix_key text,
  spotify_playlist_url text,
  rsvp_deadline date,
  rsvp_limit integer,
  rsvp_enabled boolean DEFAULT true,
  budget_total decimal DEFAULT 0,
  sections jsonb DEFAULT '{"hero":true,"countdown":true,"story":true,"gallery":true,"info":true,"rsvp":true,"gifts":true,"location":true,"message":true,"footer":true,"playlist":true,"wall":true}',
  section_colors jsonb DEFAULT '{}',
  is_published boolean DEFAULT false,
  is_private boolean DEFAULT false,
  site_password text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own events" ON public.events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read published events" ON public.events
  FOR SELECT USING (is_published = true);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GUESTS
CREATE TABLE public.guests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'pending' CHECK (status IN ('confirmed','pending','declined','maybe','no-response')),
  companions integer DEFAULT 0,
  dietary text,
  table_number text,
  message text,
  notes text,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages guests" ON public.guests
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

CREATE POLICY "Guests can insert RSVP" ON public.guests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read guests of published events" ON public.guests
  FOR SELECT USING (event_id IN (SELECT id FROM public.events WHERE is_published = true));

-- GALLERY PHOTOS
CREATE TABLE public.gallery_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  storage_path text,
  caption text,
  is_cover boolean DEFAULT false,
  uploaded_by text DEFAULT 'owner',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages photos" ON public.gallery_photos
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

CREATE POLICY "Public can read gallery of published events" ON public.gallery_photos
  FOR SELECT USING (event_id IN (SELECT id FROM public.events WHERE is_published = true));

-- GIFTS
CREATE TABLE public.gifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  suggested_value decimal,
  image_url text,
  status text DEFAULT 'available' CHECK (status IN ('available','purchased','partial')),
  purchased_by text,
  purchased_at timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages gifts" ON public.gifts
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

CREATE POLICY "Public can read gifts of published events" ON public.gifts
  FOR SELECT USING (event_id IN (SELECT id FROM public.events WHERE is_published = true));

-- GIFT PAYMENTS
CREATE TABLE public.gift_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  gift_id uuid REFERENCES public.gifts(id),
  giver_name text NOT NULL,
  giver_email text,
  amount decimal NOT NULL,
  message text,
  pix_key text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.gift_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages gift payments" ON public.gift_payments
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

CREATE POLICY "Public can insert gift payments" ON public.gift_payments
  FOR INSERT WITH CHECK (true);

-- EXPENSES
CREATE TABLE public.expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  supplier text,
  total_amount decimal NOT NULL,
  paid_amount decimal DEFAULT 0,
  due_date date,
  status text DEFAULT 'pending' CHECK (status IN ('paid','pending','overdue','cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages expenses" ON public.expenses
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

-- CHECKLIST ITEMS
CREATE TABLE public.checklist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  due_months_before integer,
  due_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  responsible text,
  supplier text,
  notes text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages checklist" ON public.checklist_items
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

-- WALL MESSAGES
CREATE TABLE public.wall_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.wall_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owner manages wall messages" ON public.wall_messages
  FOR ALL USING (event_id IN (SELECT id FROM public.events WHERE user_id = auth.uid()));

CREATE POLICY "Public can read wall messages of published events" ON public.wall_messages
  FOR SELECT USING (event_id IN (SELECT id FROM public.events WHERE is_published = true));

CREATE POLICY "Public can insert wall messages" ON public.wall_messages
  FOR INSERT WITH CHECK (true);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- STORAGE BUCKET for event photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('event-photos', 'event-photos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']);

CREATE POLICY "Anyone can view event photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can upload event photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own event photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own event photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;