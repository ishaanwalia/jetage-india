"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { Calendar, Clock, User, ArrowLeft, MessageCircle, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

const blogs = [
  {
    id: "how-to-choose-hp-printer-2026",
    title: "How to Choose the Right HP Printer for Your Business in 2026",
    content: `
      <p class="mb-4">Choosing the right printer for your business is more important than ever in 2026. With hybrid work environments, cloud printing needs, and sustainability concerns, HP's latest lineup offers solutions for every scenario.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">1. Assess Your Print Volume</h2>
      <p class="mb-4">The first step is understanding how much you print. For home offices printing under 1,000 pages monthly, the HP Laser 1008 series is perfect. Small businesses with 5,000-10,000 pages should consider the Laser MFP 1188 series. For enterprises exceeding 30,000 pages monthly, the Laser 303 series with enterprise-grade durability is essential.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">2. Connectivity Requirements</h2>
      <p class="mb-4">Modern offices need flexible connectivity. USB-only printers work for single users, but shared environments require Wi-Fi or Ethernet. The HP Laser 303dw and 323dnw offer dual-band Wi-Fi with Wi-Fi Direct for phone printing without network setup.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">3. Duplex & ADF Needs</h2>
      <p class="mb-4">Automatic duplex (double-sided printing) saves paper and presents professionally. For document scanning, an Automatic Document Feeder (ADF) is crucial. The Laser MFP 323sdnw includes a 50-sheet ADF for batch scanning.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">4. Total Cost of Ownership</h2>
      <p class="mb-4">Don't just compare purchase prices. Calculate cost per page using original HP toner. The Laser 1008a's 12A toner yields 2,000 pages, while enterprise models use high-capacity cartridges for lower per-page costs.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">5. Our Recommendations</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Home/Student:</strong> HP Laser 1008w (₹10,499) - Wireless, compact, reliable</li>
        <li><strong>Small Office:</strong> HP Laser MFP 1188nw (₹15,999) - Print, scan, copy with network</li>
        <li><strong>Business:</strong> HP Laser 303dw (₹15,999) - Auto duplex, wireless, 30 ppm</li>
        <li><strong>Enterprise:</strong> HP Laser MFP 323sdnw (₹21,999) - ADF, full networking, heavy duty</li>
      </ul>
      
      <p class="mb-4">Visit our showroom at SCO-12, Sector-17-E, Chandigarh or WhatsApp us at +91 98149 58295 for personalized recommendations and best pricing.</p>
    `,
    author: "Jetage Team",
    date: "June 15, 2026",
    readTime: "8 min read",
    category: "Buying Guide"
  },
  {
    id: "hp-ai-pc-revolution-omnibook",
    title: "The HP AI PC Revolution: Why the OmniBook X Changes Everything",
    content: `
      <p class="mb-4">The launch of HP's OmniBook X series marks the biggest shift in personal computing since the transition from desktops to laptops. With dedicated AI Neural Processing Units (NPUs) capable of 40+ TOPS, these aren't just faster laptops—they're entirely new computing paradigms.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">What is an AI PC?</h2>
      <p class="mb-4">An AI PC contains a dedicated NPU that handles artificial intelligence tasks locally, without cloud dependency. This means real-time language translation, intelligent photo editing, predictive text that actually understands context, and battery optimization that learns your usage patterns.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">HP OmniBook X Key Features</h2>
      <p class="mb-4">The OmniBook X Flip 14 features Intel Core Ultra 7 processors with Intel AI Boost, delivering 47 TOPS of AI performance. The 3K OLED touchscreen provides stunning visuals with 100% DCI-P3 color accuracy—perfect for creators. With 32GB LPDDR5X RAM and 1TB PCIe 4.0 SSD, multitasking is effortless.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">Real-World AI Benefits</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Copilot+ Integration:</strong> Windows 11's AI assistant runs natively on-device</li>
        <li><strong>Live Captions:</strong> Real-time translation of 44 languages during video calls</li>
        <li><strong>Recall:</strong> AI-powered search across everything you've seen on your PC</li>
        <li><strong>Cocreator:</strong> Generate images from text prompts locally, privately</li>
        <li><strong>Studio Effects:</strong> AI-enhanced webcam with eye contact correction and background blur</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">Battery Life Breakthrough</h2>
      <p class="mb-4">The NPU's efficiency extends battery life dramatically. The OmniBook X delivers up to 26 hours of video playback—nearly triple traditional laptops. The AI learns your usage and optimizes background processes, extending unplugged productivity.</p>
      
      <h2 class="text-2xl font-bold text-jet-text mt-8 mb-4">Should You Upgrade?</h2>
      <p class="mb-4">If you're using a laptop older than 2022, the OmniBook X represents a genuine leap forward. For creative professionals, the AI-assisted editing and color-accurate OLED display justify the investment. Business users benefit from the all-day battery and Copilot+ productivity features.</p>
      
      <p class="mb-4">The HP OmniBook X Flip 14 is available at Jetage Computer Traders with exclusive pricing. Contact us on WhatsApp at +91 98149 58295 or visit our showroom at SCO-12, Sector-17-E, Chandigarh.</p>
    `,
    author: "Jetage Team",
    date: "June 20, 2026",
    readTime: "6 min read",
    category: "Technology"
  }
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = blogs.find(b => b.id === slug);

  if (!blog) {
    return (
      <main className="min-h-screen bg-jet-bg pt-28">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-jet-text mb-4">Blog Not Found</h1>
          <Link href="/blogs/" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-full font-bold">
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />
      
      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="space-y-4">
              <Link href="/blogs/" className="inline-flex items-center gap-2 text-jet-text-muted hover:text-jet-primary transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Link>
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                {blog.category}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-jet-text leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-jet-text-muted flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {blog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blog.readTime}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <Reveal direction="up">
          <div 
            className="prose prose-lg max-w-none text-jet-text-dim leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Reveal>

        <Reveal direction="up" className="mt-12">
          <div className="bg-jet-primary/5 rounded-3xl border border-jet-primary/20 p-8 text-center">
            <h3 className="text-xl font-bold text-jet-text mb-4">Need Help Choosing?</h3>
            <p className="text-jet-text-dim mb-6">Get personalized HP product recommendations from our experts.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all">
                <Share2 className="w-5 h-5" />
                Share Article
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}