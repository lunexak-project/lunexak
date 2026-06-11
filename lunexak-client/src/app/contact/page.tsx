export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-8">
        We would love to hear from you! Please reach out using the form below or via our support channels.
      </p>
      <form className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border rounded p-2" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border rounded p-2" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="How can we help?"></textarea>
        </div>
        <button type="button" className="bg-black text-white px-4 py-2 rounded">Send Message</button>
      </form>
    </div>
  );
}
