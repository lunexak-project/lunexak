export default function AccountPage() {
  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        My Account
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          My Profile
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          My Orders
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          Wishlist
        </div>
      </div>
    </main>
  );
}
