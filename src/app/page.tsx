import Navbar from '@/components/Navbar/Navbar';
import HeroSection from '@/components/HeroSection/HeroSection';
import GuidebookSection from '@/components/GuidebookSection/GuidebookSection';
import MyStorySection from '@/components/MyStorySection/MyStorySection';
import DestinationSection from '@/components/DestinationSection/DestinationSection';
import BookingSection from '@/components/BookingSection/BookingSection';
import { fetchSupabase } from '@/lib/supabaseFetch';

export const revalidate = 0; // Disable cache so changes show up instantly

export default async function Home() {
  // Fetch real data from Supabase
  const [settingsRaw, heroRaw, includedRaw, portfolioRaw, destRaw, packagesRaw] = await Promise.all([
    fetchSupabase('settings', 'limit=1'),
    fetchSupabase('hero_banners', 'order=order_idx.asc'),
    fetchSupabase('included_features', 'order=order_idx.asc'),
    fetchSupabase('portfolios', 'order=order_idx.asc'),
    fetchSupabase('destinations', 'order=order_idx.asc'),
    fetchSupabase('packages', 'order=created_at.desc')
  ]);

  const settings = settingsRaw?.[0] || {};

  // Parse for Hero Section
  const heroContent = {
    preTitle: settings.hero_pre_title,
    slogan: settings.slogan,
    tagline: settings.hero_tagline,
    hero_images: heroRaw?.map(h => ({
      desktop: h.image_url,
      mobile: h.image_mobile_url || null
    })) || []
  };

  // Parse for Guidebook (What's Included)
  const features = includedRaw?.map(f => ({
    id: f.id,
    image: f.image_url,
    category: f.category,
    category_kr: f.category_kr,
    subtitle: f.subtitle
  })) || undefined;

  // Parse for My Story
  const stories = portfolioRaw?.map(p => ({
    id: p.id,
    image: p.image_url,
    caption: p.caption
  })) || undefined;

  // Parse for Destinations
  const destinations = destRaw?.map(d => ({
    id: d.id,
    image: d.image_url,
    place: d.place,
    name: d.name
  })) || undefined;

  // Parse for Booking (Packages)
  const packages = packagesRaw?.map(p => ({
    id: p.id,
    image: p.main_image || '',
    title: p.title,
    price: p.price_adult,
    tags: [p.location, p.duration]
  })) || undefined;

  return (
    <main>
      <Navbar settings={settings} />
      <HeroSection content={heroContent} />
      
      <div className="reveal">
        <GuidebookSection cards={features} />
      </div>

      <div className="reveal">
        <MyStorySection stories={stories} bgImage={settings.portfolio_background_image} />
      </div>

      <div className="reveal">
        <DestinationSection destinations={destinations} />
      </div>

      <div className="reveal">
        <BookingSection bookings={packages} />
      </div>
    </main>
  );
}
