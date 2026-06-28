import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { Calendar, Clock, User, ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

const blogs = [
  {
    id: "how-to-choose-hp-printer-2026",
    title: "How to Choose the Right HP Printer for Your Business in 2026",
    content: `...`,
    author: "Jetage Team",
    date: "June 15, 2026",
    readTime: "8 min read",
    category: "Buying Guide"
  },
  {
    id: "hp-ai-pc-revolution-omnibook",
    title: "The HP AI PC Revolution: Why the OmniBook X Changes Everything",
    content: `...`,
    author: "Jetage Team",
    date: "June 20, 2026",
    readTime: "6 min read",
    category: "Technology"
  }
];

// ✅ REQUIRED for static export - tells Next.js which pages to generate
export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.id,
  }));
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = blogs.find(b => b.id === params.slug);
  // ... rest of component
}