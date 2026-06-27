import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function signupAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) {
    redirect(
      `/signup?error=${encodeURIComponent("Passwords do not match.")}`
    );
  }
  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent(
        "Password must be at least 8 characters."
      )}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Email confirmation is enabled — session won't exist yet
  if (!data.session) {
    redirect("/signup?confirm=1");
  }

  redirect("/dashboard");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirm?: string }>;
}) {
  const { error, confirm } = await searchParams;

  if (confirm === "1") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-full max-w-sm px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-maroon flex items-center justify-center">
              <span className="font-serif text-white text-sm font-bold leading-none">
                CS
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-stone-900 mb-3">
            Check your inbox
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            We sent you a confirmation link. Click it to activate your account,
            then come back to sign in.
          </p>
          <Link
            href="/login"
            className="text-maroon text-sm font-medium hover:text-maroon-hover"
          >
            Go to sign in →
          </Link>
        </div>
      </div>
    );
  }

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
          Create account
        </h1>
        <p className="text-stone-600 text-sm text-center mb-8">
          Get started with Checksheet
        </p>

        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form action={signupAction} className="space-y-4">
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
                autoComplete="new-password"
                minLength={8}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition-colors mt-2"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-maroon font-medium hover:text-maroon-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
