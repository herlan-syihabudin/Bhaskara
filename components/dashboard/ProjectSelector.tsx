export default function ProjectSelector() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">Project:</span>

      <select className="form-input max-w-xs">
        <option>Proyek Gudang Cikarang</option>
        <option disabled>Proyek lainnya (soon)</option>
      </select>
    </div>
  );
}
