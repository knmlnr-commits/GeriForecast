export function Card({ title, subtitle, children, className = "" }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-xl border border-stone-200 bg-white ${className}`}>
      <header className="px-4 pt-4 pb-3">
        <h2 className="font-bold text-stone-800">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}
