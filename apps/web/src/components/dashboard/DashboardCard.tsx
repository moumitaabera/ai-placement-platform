interface DashboardCardProps {
  title: string;
  value: number;
}

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}