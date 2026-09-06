export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-[#262626] bg-[#141414] p-8 text-center">
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
    </div>
  );
}
