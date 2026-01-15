type Props = {
  title: string;
  subtitle: string;
};

export default function DashboardHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}
