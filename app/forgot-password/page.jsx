import ForgotPassword from "@/pages_migrated/ForgotPassword";
import { GuestRoute } from "@/components/ProtectedRoute";

export const metadata = {
  title: "Account Recovery | Al-Mukhtar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <ForgotPassword />
    </GuestRoute>
  );
}
