import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    return role ? { ...user, role: role.role } : null;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-cosmic-50 dark:bg-cosmic-950">
            {/* Sidebar */}
            <AdminSidebar userRole={user.role} />

            {/* Main content */}
            <div className="lg:pl-64">
                <AdminHeader userEmail={user.email || ''} />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
