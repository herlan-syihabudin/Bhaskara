type Props = {
  title: string;
};

export default function SectionPlaceholder({ title }: Props) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500">
        Konten akan ditambahkan sesuai kebutuhan divisi.
      </p>
    </div>
  );
}
