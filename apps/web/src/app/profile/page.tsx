import ProfileForm from "@/components/forms/ProfileForm";


export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Student Profile
      </h1>

      <ProfileForm />
    </div>
  );
}