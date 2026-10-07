import VerifyEmail from "@/pages_migrated/Verify-email";
import { GuestRoute } from "@/components/ProtectedRoute";

export const metadata = {
  title: "Verify Email | Al-Mukhtar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <GuestRoute>
      <VerifyEmail />
    </GuestRoute>
  );
}
