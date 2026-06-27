import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function loginAction(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm px-4">
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-maroon flex items-center justify-center">
            <span className="font-serif text-white text-sm font-bold leading-none">
              CS
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-semibold text-stone-900 text-center mb-1">
          Sign in
        </h1>
        <p className="text-stone-600 text-sm text-center mb-8">
          Continue to Checksheet
        </p>

        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition-colors mt-2"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-maroon font-medium hover:text-maroon-hover"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
