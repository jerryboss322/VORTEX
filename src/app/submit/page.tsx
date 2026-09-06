import { createSubmissionAction } from "@/lib/actions";
import { ContributorSubmitForm } from "@/components/tips/ContributorSubmitForm";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Submit a Tip</h1>
        <p className="mt-1 text-sm text-zinc-400">Trusted contributors — your slip will be reviewed before publishing. Only clear screenshots and correct booking codes get approved.</p>
      </div>
      <ContributorSubmitForm action={createSubmissionAction} />
    </div>
  );
}
