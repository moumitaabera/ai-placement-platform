import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}

