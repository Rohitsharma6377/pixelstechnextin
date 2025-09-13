import AdminSidebar from "@/components/Admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="ml-64 px-4 py-8 md:px-6">
        {children}
      </main>
    </div>
  );
}
