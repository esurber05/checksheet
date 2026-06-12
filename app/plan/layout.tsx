export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-1 overflow-hidden">{children}</div>;
}
