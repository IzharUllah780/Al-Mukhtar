import Login from "@/pages_migrated/Login";
import { GuestRoute } from "@/components/ProtectedRoute";

export const metadata = {
  title: "Student & Faculty Login | Al-Mukhtar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <GuestRoute>
      <Login />
    </GuestRoute>
  );
}
