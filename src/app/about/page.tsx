import { Calendar, Users, MapPin, Award } from "lucide-react";

export const metadata = {
  title: "About Us - JetAge India | Authorized HP Dealer",
  description: "Learn about JetAge India - Chandigarh's most trusted HP dealer since 1989. 35+ years of excellence in HP products and services.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About JetAge India</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600 mb-12">
        <p className="text-xl leading-relaxed mb-6">
          Founded in 1989, JetAge India has grown to become Chandigarh's most trusted 
          authorized HP dealer. With over three decades of experience, we've served 
          thousands of customers across India with genuine HP products at competitive prices.
        </p>
        <p>
          Our showroom in Chandigarh is your one-stop destination for all HP products 
          including printers, laptops, desktops, and accessories. We pride ourselves on 
          our expert product knowledge, after-sales support, and commitment to customer 
          satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Calendar, label: "Established", value: "1989" },
          { icon: Users, label: "Customers Served", value: "25,000+" },
          { icon: MapPin, label: "Cities Covered", value: "500+" },
          { icon: Award, label: "HP Awards", value: "15+" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-xl p-6 text-center">
            <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We're Different</h2>
        <ul className="space-y-3">
          {[
            "Authorized HP dealer with genuine product guarantee",
            "Competitive pricing - often better than online marketplaces",
            "Expert pre-sales consultation to find the right product",
            "Free setup assistance for printers and devices",
            "All-India delivery with secure packaging",
            "WhatsApp support for quick queries and orders",
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}