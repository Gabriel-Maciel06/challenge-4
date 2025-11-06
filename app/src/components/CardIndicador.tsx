type Props = {
  title: string;
  value: string | number;
  className?: string;
  loading?: boolean;
};

export default function CardIndicador({ title, value, className = "", loading = false }: Props) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm bg-white ${className}`}>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">
        {loading ? (
          <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}
