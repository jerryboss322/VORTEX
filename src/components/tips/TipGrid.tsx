import { TipCard } from "./TipCard";

export function TipGrid({ tips }: { tips: any[] }) {
  if (tips.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
          <h3 className="mb-3 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-cyan-400" : "bg-violet-400/70"}`} />
            <span className="text-zinc-500">{g.date}</span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.tips.map((t: any) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
