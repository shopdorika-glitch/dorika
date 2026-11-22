-- ════════════════════════════════════════════════════════════════════
--  DORIKA — Seed Data  (File 3 of 3)
--  Run AFTER 01_schema.sql and 02_rls.sql.
--  ~12 demo products across 4 categories. Placeholder images use
--  picsum.photos (deterministic seeds) — swap them in the admin panel.
-- ════════════════════════════════════════════════════════════════════

-- Categories ----------------------------------------------------------
insert into public.categories (name, slug, description, image_url, sort_order) values
  ('Wall Art',        'wall-art',        'Statement string art pieces for your walls.',        'https://picsum.photos/seed/dorika-wall/800/800',  1),
  ('Custom Face Art', 'custom-face-art', 'Your photo, hand-woven into thread on a 45cm plank.', 'https://picsum.photos/seed/dorika-face/800/800',  2),
  ('Home Decor',      'home-decor',      'Warm, crafted accents for every room.',             'https://picsum.photos/seed/dorika-decor/800/800', 3),
  ('Gifts',           'gifts',           'Thoughtful, one-of-a-kind crafted gifts.',          'https://picsum.photos/seed/dorika-gift/800/800',  4)
on conflict (slug) do nothing;

-- Products ------------------------------------------------------------
with c as (
  select
    (select id from public.categories where slug='wall-art')        as wall,
    (select id from public.categories where slug='custom-face-art') as face,
    (select id from public.categories where slug='home-decor')      as decor,
    (select id from public.categories where slug='gifts')           as gift
)
insert into public.products
  (name, slug, description, price, compare_at, category_id, images, size, stock, is_featured, is_custom)
select * from (
  select
    'Custom String Face Art — 45cm'::text,
    'custom-string-face-art'::text,
    'Our signature piece. Send us a face photo and we hand-weave it into stunning monochrome string art on a 45cm diameter round wooden plank. A deeply personal gift that lasts a lifetime.'::text,
    3500::numeric, 4500::numeric, (select face from c),
    array['/products/custom-string-face-art.jpg'],
    '45cm diameter round plank'::text, 99, true, true
  union all select
    'Himalaya Peaks Wall Art','himalaya-peaks-wall-art',
    'The silhouette of the Himalayas rendered in fine terracotta thread on a deep charcoal board. A tribute to Nepal''s mountains.',
    2800, 3200, (select wall from c),
    array['/products/himalaya-peaks-wall-art.jpg'],
    '40 x 60 cm', 12, true, false
  union all select
    'Mandala Thread Circle','mandala-thread-circle',
    'A meditative mandala woven in concentric rings. Intricate, symmetrical, and endlessly calming.',
    2200, null, (select wall from c),
    array['https://picsum.photos/seed/dorika-p3/900/900','https://picsum.photos/seed/dorika-p3b/900/900'],
    '40cm diameter', 18, true, false
  union all select
    'Lotus Bloom String Art','lotus-bloom-string-art',
    'A soft lotus in bloom, strung in warm cream and terracotta tones. Symbol of purity and new beginnings.',
    1900, 2400, (select wall from c),
    array['https://picsum.photos/seed/dorika-p4/900/900'],
    '35 x 35 cm', 20, false, false
  union all select
    'Heart Knot Keepsake','heart-knot-keepsake',
    'A tightly woven heart — the perfect anniversary or wedding keepsake. Comes gift-boxed.',
    1500, null, (select gift from c),
    array['https://picsum.photos/seed/dorika-p5/900/900','https://picsum.photos/seed/dorika-p5b/900/900'],
    '25 x 25 cm', 30, true, false
  union all select
    'Name String Art (Custom Word)','name-string-art-custom-word',
    'Any name or short word, hand-woven in the thread colour of your choice. A beautiful nursery or desk piece.',
    1800, null, (select gift from c),
    array['https://picsum.photos/seed/dorika-p6/900/900'],
    'Up to 40 cm wide', 25, false, false
  union all select
    'Boho Moon Phases','boho-moon-phases',
    'The phases of the moon strung across a slim horizontal board. Understated boho elegance.',
    2100, 2600, (select decor from c),
    array['https://picsum.photos/seed/dorika-p7/900/900','https://picsum.photos/seed/dorika-p7b/900/900'],
    '20 x 70 cm', 15, false, false
  union all select
    'Elephant Blessing','elephant-blessing',
    'A detailed elephant motif — a symbol of wisdom and good fortune, woven in charcoal thread.',
    2400, null, (select wall from c),
    array['https://picsum.photos/seed/dorika-p8/900/900'],
    '40 x 40 cm', 10, false, false
  union all select
    'Minimal Compass','minimal-compass',
    'A clean compass rose for the traveller at heart. Thread on raw birch ply.',
    1700, null, (select decor from c),
    array['https://picsum.photos/seed/dorika-p9/900/900'],
    '30cm diameter', 22, false, false
  union all select
    'Guitar String Silhouette','guitar-string-silhouette',
    'An acoustic guitar outline — thread on thread. The ideal gift for the musician you love.',
    2000, 2500, (select gift from c),
    array['https://picsum.photos/seed/dorika-p10/900/900'],
    '30 x 45 cm', 14, false, false
  union all select
    'Sunburst Wall Piece','sunburst-wall-piece',
    'Radiant lines bursting from a central hub in warm terracotta. Fills a wall with energy.',
    2600, null, (select decor from c),
    array['https://picsum.photos/seed/dorika-p11/900/900','https://picsum.photos/seed/dorika-p11b/900/900'],
    '50cm diameter', 8, true, false
  union all select
    'Couple Portrait Face Art — 45cm','couple-portrait-face-art',
    'The two-face version of our signature piece. Send a photo of the couple and we weave you both together on a 45cm plank.',
    5500, 6500, (select face from c),
    array['/products/couple-portrait-face-art.jpg'],
    '45cm diameter round plank', 50, true, true
) as rows
on conflict (slug) do nothing;
