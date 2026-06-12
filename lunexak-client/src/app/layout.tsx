import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { NotificationProvider } from "@/context/NotificationContext";
import RoleSidebar from "@/components/layout/RoleSidebar";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "LunexAK - Premium Fashion",
  description: "Shop premium fashion and timeless styles at LunexAK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "mock_client_id_for_dev"}>
          <AuthProvider>
            <SearchProvider>
              <WishlistProvider>
                <CartProvider>
                  <NotificationProvider>
                    <LayoutWrapper>
                      {children}
                    </LayoutWrapper>
                  </NotificationProvider>
                </CartProvider>
              </WishlistProvider>
            </SearchProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}