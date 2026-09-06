import { createSubmissionAction, createPublicSubmissionAction } from "@/lib/actions";
import { ContributorSubmitForm } from "@/components/tips/ContributorSubmitForm";
import { auth } from "@/lib/auth";

export default async function SubmitPage() {
  const session = await auth();
  const isAnon = !session?.user;
  const role = (session?.user as any)?.role;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Submit a Tip</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {isAnon
            ? "No account needed — members submit as guest with optional name. Admin reviews before publishing."
            : role === "ADMIN"
              ? "Admin submit — publishes after your review via same queue. Add your name or leave blank."
              : "Trusted contributor — your slip will be reviewed before publishing. Only clear screenshots and correct codes get approved."}
        </p>
      </div>
      <ContributorSubmitForm action={isAnon ? createPublicSubmissionAction : createSubmissionAction} mode={isAnon ? "public" : "contributor"} />
    </div>
  );
}
