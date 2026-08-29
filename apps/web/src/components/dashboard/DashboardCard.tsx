interface DashboardCardProps {
  title: string;
  value: number;
}

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-medium text-gray-500">
          {title}
        </h3>

        <div className="h-2 w-2 rounded-full bg-gray-300 transition-colors duration-200 group-hover:bg-black" />
      </div>

      <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        Current total
      </p>
    </div>
  );
}