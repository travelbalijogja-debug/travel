import Navbar from '@/components/Navbar/Navbar';
import HeroSection from '@/components/HeroSection/HeroSection';
import AboutSection from '@/components/AboutSection/AboutSection';
import GuidebookSection from '@/components/GuidebookSection/GuidebookSection';
import MyStorySection from '@/components/MyStorySection/MyStorySection';
import DestinationSection from '@/components/DestinationSection/DestinationSection';
import BookingSection from '@/components/BookingSection/BookingSection';
import FaqSection from '@/components/FaqSection/FaqSection';
import { fetchSupabase } from '@/lib/supabaseFetch';

export const revalidate = 0;

export default async function Home() {
  const [settingsRaw, heroRaw, includedRaw, portfolioRaw, destRaw, packagesRaw, faqsRaw] = await Promise.all([
    fetchSupabase('settings', 'limit=1'),
    fetchSupabase('hero_banners', 'order=created_at.desc'),
    fetchSupabase('included_features', 'order=created_at.desc'),
    fetchSupabase('portfolios', 'order=created_at.desc'),
    fetchSupabase('destinations', 'order=created_at.desc'),
    fetchSupabase('packages', 'order=created_at.desc'),
    fetchSupabase('faqs', 'order=order_idx.asc,created_at.asc')
  ]);

  const settings = settingsRaw?.[0] || {};

  const heroContent = {
    preTitle: settings.hero_pre_title,
    slogan: settings.slogan,
    tagline: settings.hero_tagline,
    hero_images: heroRaw?.map((h: any) => ({
      desktop: h.image_url,
      mobile: h.image_mobile_url || null
    })) || []
  };

  // Setiap section hanya muncul jika ada datanya (null = hidden)
  const features = includedRaw?.length ? includedRaw.map((f: any) => ({
    id: f.id, image: f.image_url, category: f.category,
    category_kr: f.category_kr, subtitle: f.subtitle
  })) : null;

  const stories = portfolioRaw?.length ? portfolioRaw.map((p: any) => ({
    id: p.id, image: p.image_url, caption: p.caption
  })) : null;

  const destinations = destRaw?.length ? destRaw.map((d: any) => ({
    id: d.id, image: d.image_url, place: d.place, name: d.name
  })) : null;

  const packages = packagesRaw?.length ? packagesRaw.map((p: any) => ({
    id: p.id, image: p.main_image || '', title: p.title,
    short_description: p.short_description || '',
    description: p.description, price: p.price_adult,
    tags: [p.location, p.duration]
  })) : null;

  const faqs = faqsRaw?.length ? faqsRaw.map((f: any) => ({
    id: f.id, question: f.question, answer: f.answer
  })) : null;

  return (
    <main>
      <Navbar settings={settings} />
      <HeroSection content={heroContent} />

      {/* About Section — muncul jika deskripsi diisi di Settings */}
      <AboutSection
        title={settings.about_title}
        description={settings.about_description}
        highlights={[
          settings.about_highlight_1,
          settings.about_highlight_2,
          settings.about_highlight_3,
        ]}
      />

      {features && (
        <div className="reveal">
          <GuidebookSection cards={features} />
        </div>
      )}

      {stories && (
        <div className="reveal">
          <MyStorySection stories={stories} bgImage={settings.portfolio_background_image} />
        </div>
      )}

      {destinations && (
        <div className="reveal">
          <DestinationSection destinations={destinations} />
        </div>
      )}

      {packages && (
        <div className="reveal">
          <BookingSection bookings={packages} phoneNumber={settings.phone_number} />
        </div>
      )}

      {faqs && (
        <div className="reveal">
          <FaqSection faqs={faqs} />
        </div>
      )}
    </main>
  );
}
