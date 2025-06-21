-- LÉPÉS 1: Futtasd le ezt először
-- Profile és Posts létrehozása
insert into public.profiles (id, name, email, role, avatar_url, department, location, status)
values
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 'Nagy Péter', 'test@example.com', 'Admin', '/male-avatar.png', 'IT', 'Debrecen', 'active')
ON CONFLICT (id) DO NOTHING;

insert into public.posts (author_id, title, excerpt, image, status, category, tags, featured, seo_score)
values
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 'Új termékünk bemutatása', 'Izgalmas fejlesztésekkel készültünk az új évben...', '/modern-tech-product.png', 'published', 'Termékek', '{"új", "termék", "innováció"}', true, 95),
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 'Webfejlesztési trendek 2025-ben', 'Mit hozhat az új év a web világában? Áttekintjük a legfontosabb trendeket...', '/web-development-concept.png', 'draft', 'Teknológia', '{"webfejlesztés", "trendek", "2025"}', false, 78),
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 'Ügyfélszolgálati újítások', 'Hogyan fejlesztettük szolgáltatásainkat az ügyfelek visszajelzései alapján...', '/customer-service-interaction.png', 'published', 'Szolgáltatások', '{"ügyfélszolgálat", "AI", "chatbot"}', true, 88);

-- LÉPÉS 2: Nézd meg a post ID-kat és futtasd le ennek megfelelően módosítva
-- Először ellenőrizd milyen ID-k keletkeztek:
SELECT id, title FROM posts WHERE author_id = '40cbb47c-9264-4e33-aba0-fa22174ce6f4' ORDER BY id;

-- Majd cseréld le az alábbi számokat a valódi post ID-kra:
-- (Például ha a post ID-k 5, 6, 7, akkor használd azokat)

-- insert into public.comments (author_id, post_id, content, status)
-- values
-- ('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 5, 'Nagyon hasznos cikk! Köszönöm a megosztást.', 'approved'),
-- ('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 5, 'Mikor lesz elérhető ez a funkció?', 'pending'),
-- ('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 6, 'Érdekes írás, várom a folytatást!', 'approved');

-- Reviews (ezek nem függnek post ID-tól)
insert into public.reviews (author_id, rating, title, content, product_name, status)
values
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 5, 'Kiváló termék!', 'Nagyon meg vagyok elégedve ezzel a termékkel.', 'Prémium Kávéfőző X2000', 'pending'),
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 4, 'Jó, de lehetne jobb', 'Alapvetően egy jó termék, de a használati útmutató lehetne egyértelműbb.', 'Okosóra Z-Pro', 'approved'),
('40cbb47c-9264-4e33-aba0-fa22174ce6f4', 2, 'Csalódás', 'Sajnos nem váltotta be a hozzá fűzött reményeket.', 'Vezeték nélküli Fülhallgató', 'rejected');