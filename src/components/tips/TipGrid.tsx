import { TipCard } from "./TipCard";

export function TipGrid({ tips }: { tips: any[] }) {
  if (tips.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tips.map((t) => (
        <TipCard key={t.id} tip={t} />
      ))}
    </div>
  );
}

export function DateGrouped({ groups }: { groups: { date: string; tips: any[] }[] }) {
  return (
    <div className="space-y-8">
      {groups.map((g, idx) => (
        <section key={g.date}>
          <h3 className="mb-3 flex items-center gap-2 text-[12px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">
            <span className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-[var(--th-gold)]" : "bg-[var(--th-sub)]"}`} />
            {g.date}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.tips.map((t: any) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
