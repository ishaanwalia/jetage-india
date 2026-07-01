import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us - JetAge India",
  description: "Contact JetAge India - Authorized HP Dealer in Chandigarh. WhatsApp, call, or visit our showroom.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions about HP products? Reach out to us via WhatsApp, phone, 
            or visit our showroom in Chandigarh.
          </p>

          <div className="space-y-6">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-50 p-4 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <p className="text-green-600">+91 XXXXXXXXXX</p>
              </div>
            </a>

            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Call Us</p>
                <p className="text-blue-600">+91 XXXXXXXXXX</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">info@jetageindia.in</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Showroom</p>
                <p className="text-gray-600">Chandigarh, India</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Working Hours</p>
                <p className="text-gray-600">Mon-Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}