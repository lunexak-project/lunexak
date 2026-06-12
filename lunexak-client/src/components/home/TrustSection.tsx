import { Truck, RotateCcw, ShieldCheck, HeadphonesIcon, Award, Zap } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On all orders above ₹1,999. Fast and reliable shipping across India.",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    description: "Changed your mind? Return any item within 14 days, no questions asked.",
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "All transactions are encrypted and protected by industry-leading security.",
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our customer support team is always ready to help you with any queries.",
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Every product is carefully inspected before dispatch to ensure premium quality.",
    gradient: "from-rose-500 to-rose-600",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Zap,
    title: "Fast Checkout",
    description: "One-click checkout, multiple payment options including UPI, cards & wallets.",
    gradient: "from-yellow-500 to-amber-600",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Why Choose Us</p>
          <h2 className="text-4xl font-black text-gray-900">Shopping Made Better</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            We're committed to delivering the best experience — from browsing to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={item.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}