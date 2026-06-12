export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-auto">
      <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
