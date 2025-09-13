export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-300">Only users with role ADMIN can access this page.</p>
    </div>
  );
}
