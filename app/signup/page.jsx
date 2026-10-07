import Signup from "@/pages_migrated/Sign-up";
import { GuestRoute } from "@/components/ProtectedRoute";

export const metadata = {
  title: "Create Student Account | Al-Mukhtar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return (
    <GuestRoute>
      <Signup />
    </GuestRoute>
  );
}
