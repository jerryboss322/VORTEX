import { createSubmissionAction } from "@/lib/actions";
import { ContributorSubmitForm } from "@/components/tips/ContributorSubmitForm";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Submit a tip</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--th-sub)]">No account needed — add your name and slip. Admin reviews before publishing.</p>
      </div>
      <div className="mt-6">
        <ContributorSubmitForm action={createSubmissionAction} mode="public" />
      </div>
    </div>
  );
}
