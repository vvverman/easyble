import { createTeam } from "~/features/teams/actions"

export default function NewTeamPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold leading-tight">
          New team
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a workspace to group your projects.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <form action={createTeam} className="space-y-4 max-w-md">
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
              placeholder="Client work"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create team
          </button>
        </form>
      </div>
    </div>
  )
}
