export default function RiskBadge({ value }: { value: number }) {
  const color =
    value >= 80 ? "bg-red-600" :
    value >= 60 ? "bg-orange-500" :
    value >= 30 ? "bg-yellow-500" : "bg-emerald-600";
  return <span className={`inline-block text-white text-xs px-2 py-1 rounded ${color}`}>{value ?? 0}%</span>;
}