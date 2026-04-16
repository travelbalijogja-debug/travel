-- SQL Schema for NorthTour (PostgreSQL / Supabase)

-- 1. Table Admin (Login)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Settings (Konfigurasi General)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logo_text VARCHAR(255) DEFAULT 'NORTH TOUR',
    phone_number VARCHAR(255) DEFAULT '+62 812-3456-7890',
    slogan VARCHAR(500) DEFAULT 'BUS TO THE SEA - FAST, ECONOMICAL, COMFORTABLE',
    portfolio_background_image TEXT DEFAULT 'https://picsum.photos/seed/bali_bg/1920/1080',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Settings
INSERT INTO settings (id) VALUES (gen_random_uuid());

-- 3. Table Hero Banners (Foto Banner / Header Slide)
CREATE TABLE hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    order_idx INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table Packages (Pricelist Paket Wisata)
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price_adult DECIMAL(12,2) NOT NULL,
    price_child DECIMAL(12,2),
    discount DECIMAL(5,2) DEFAULT 0,
    main_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table Package Gallery (Galeri foto per paket)
CREATE TABLE package_galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- 6. Table Included Features (What's Included)
CREATE TABLE included_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(255) NOT NULL,
    category_kr VARCHAR(255),
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    order_idx INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table Portfolio (Our Portfolio)
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caption VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    order_idx INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table Destinations (Bali & Jogja Destinations)
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    order_idx INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table Bookings (Order/Reservasi)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, CONFIRMED, CANCELLED
    payment_status VARCHAR(50) DEFAULT 'UNPAID', -- UNPAID, PAID
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- INITIAL DUMMY DATA INSERTS (Agar website langsung tampil)
-- =======================================================

-- Admin (password: admin123 - you should hash this in production)
INSERT INTO admins (username, password, name) VALUES ('admin', 'admin123', 'Super Admin');

-- Hero Images
INSERT INTO hero_banners (image_url, order_idx) VALUES 
('https://picsum.photos/seed/hero1/600/900', 1),
('https://picsum.photos/seed/hero2/600/900', 2),
('https://picsum.photos/seed/hero3/600/900', 3),
('https://picsum.photos/seed/hero4/600/900', 4);

-- What's Included
INSERT INTO included_features (image_url, category, category_kr, subtitle, order_idx) VALUES 
('https://picsum.photos/seed/hotelbali/400/600', 'Akomodasi', '최고의 호텔', 'Hotel Bintang 4/5', 1),
('https://picsum.photos/seed/transportjogja/400/600', 'Transportasi', '편안한 이동', 'Hiace / Premium Bus', 2),
('https://picsum.photos/seed/foodbali/400/600', 'Konsumsi', '맛있는 현지식', 'Kuliner Lokal & Resto', 3),
('https://picsum.photos/seed/guidebali/400/600', 'Tour Guide', '전문 가이드', 'Pemandu Berpengalaman', 4),
('https://picsum.photos/seed/photobali/400/600', 'Dokumentasi', '사진 촬영', 'Fotografer & Drone', 5);

-- Portfolio
INSERT INTO portfolios (image_url, caption, order_idx) VALUES 
('https://picsum.photos/seed/bali1/400/600', 'pesona melasti beach, bali', 1),
('https://picsum.photos/seed/jogja1/400/600', 'sunrise di borobudur, jogja', 2),
('https://picsum.photos/seed/bali2/400/600', 'momen pura uluwatu', 3),
('https://picsum.photos/seed/jogja2/400/600', 'jejak sejarah prambanan', 4);

-- Destinations
INSERT INTO destinations (image_url, place, name, order_idx) VALUES 
('https://picsum.photos/seed/destbali1/600/800', 'Ubud, Bali', 'Monkey Forest & Rice Terrace', 1),
('https://picsum.photos/seed/destjogja1/600/800', 'Magelang, DIY', 'Candi Borobudur', 2),
('https://picsum.photos/seed/destbali2/600/800', 'Nusa Penida, Bali', 'Kelingking Beach', 3),
('https://picsum.photos/seed/destjogja2/600/800', 'Sleman, DIY', 'Candi Prambanan', 4);

-- Packages (Pricelist)
INSERT INTO packages (id, title, description, location, duration, price_adult, price_child, main_image) VALUES 
('11111111-1111-1111-1111-111111111111', 'Swiss Alps Retreat', 'Experience a luxury retreat with breathtaking landscapes.', 'Ubud, Bali', '3 Days', 750.00, 300.00, 'https://picsum.photos/seed/book1/600/800'),
('22222222-2222-2222-2222-222222222222', 'Iceland Cabin', 'Deep nature unbothered.', 'Nusa Penida, Bali', '5 Days', 980.00, 400.00, 'https://picsum.photos/seed/book2/600/800'),
('33333333-3333-3333-3333-333333333333', 'Tokyo Penthouse', 'City center vacation.', 'Malioboro, Jogja', '2 Days', 850.00, 350.00, 'https://picsum.photos/seed/book3/600/800');
