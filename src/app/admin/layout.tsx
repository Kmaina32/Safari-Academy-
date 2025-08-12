export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
