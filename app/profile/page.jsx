import Profile from "@/pages_migrated/Profile";
import { PrivateRoute } from "@/components/ProtectedRoute";

export const metadata = {
  title: "Student Profile & Dashboard | Al-Mukhtar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}
