import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - EduSight',
  description: 'EduSight Analytics Dashboard - Track your student\'s comprehensive assessment progress',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
