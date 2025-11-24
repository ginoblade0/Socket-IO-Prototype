import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateAvatar } = useAuthStore();

  const handleImageUpload = async (e: React.FormEvent) => {
    const file = e.target as HTMLInputElement;
    if (file.files && file.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(file.files[0]);
      reader.onload = async () => {
        const data: string = reader.result as string;
        await updateAvatar(data);
        window.location.reload();
      };
    }
  };

  return (
    <div className="h-screen max-w-2xl mx-auto p-4 py-8 pt-25">
      <div className="bg-base-300 rounded-2xl p-12">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="mb-6 text-base-content/70">
            Manage your profile information
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-full bg-black">
              <img
                className="size-32 rounded-full border-4"
                src={authUser.avatar || "avatar.png"}
                alt="Profile"
              ></img>
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content
              hover:scale-110 p-2 rounded-full cursor-pointer
              transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/70">
              {isUpdatingProfile
                ? "Uploading . . ."
                : "Click on the camera icon to update your photo."}
            </p>
          </div>
        </div>
        <div className="space-y-6 text-base-content/70">
          <div className="space-y-1.5">
            <div className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </div>
            <p className="px-6 py-2.5 bg-base-200 rounded-lg border">
              {authUser?.username}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-6 py-2.5 bg-base-200 rounded-lg border">
              {authUser?.email}
            </p>
          </div>
        </div>
        <div className="mt-6 bg-base-300 p-8">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="flex justify-between py-2 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
