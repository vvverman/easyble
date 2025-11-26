import {
  FolderKanban,
  SquareKanban,
  SquareDashedKanban,
  Briefcase,
  BriefcaseBusiness,
  BriefcaseMedical,
  Folder,
  FolderOpen,
  ClipboardList,
  ClipboardCheck,
  Target,
  Rocket,
  Layers,
  Cat,
} from "lucide-react"
import { createProject } from "~/features/projects/actions"

const ICON_OPTIONS = [
  { value: "FolderKanban", Icon: FolderKanban },
  { value: "SquareKanban", Icon: SquareKanban },
  { value: "SquareDashedKanban", Icon: SquareDashedKanban },
  { value: "Briefcase", Icon: Briefcase },
  { value: "BriefcaseBusiness", Icon: BriefcaseBusiness },
  { value: "BriefcaseMedical", Icon: BriefcaseMedical },
  { value: "Folder", Icon: Folder },
  { value: "FolderOpen", Icon: FolderOpen },
  { value: "ClipboardList", Icon: ClipboardList },
  { value: "ClipboardCheck", Icon: ClipboardCheck },
  { value: "Target", Icon: Target },
  { value: "Rocket", Icon: Rocket },
  { value: "Layers", Icon: Layers },
  { value: "Cat", Icon: Cat },
] as const

export default function NewProjectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const teamId =
    typeof searchParams.team === "string" ? searchParams.team : ""

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold leading-tight">
          New project
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a project and its first board.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <form action={createProject} className="space-y-6 max-w-md">
          <input type="hidden" name="teamId" value={teamId} />
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Project name
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Client roadmap"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Project icon
            </p>
            <div className="grid grid-cols-7 gap-3">
              {ICON_OPTIONS.map(({ value, Icon }) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="icon"
                    value={value}
                    defaultChecked={value === "FolderKanban"}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center rounded-md border p-2 transition-colors peer-checked:border-primary peer-checked:bg-primary/10">
                    <Icon className="h-5 w-5" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create project
          </button>
        </form>
      </div>
    </div>
  )
}
