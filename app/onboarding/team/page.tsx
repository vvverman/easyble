import { createTeam } from "~/features/teams/actions"

export default function OnboardingTeamPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold leading-tight">
            Create your first team
          </h1>
          <p className="text-sm text-muted-foreground">
            This workspace will contain your projects and boards.
          </p>
        </div>

        <form action={createTeam} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Team name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Acme Studio"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
