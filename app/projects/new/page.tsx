import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { createProject } from '~/features/projects/actions';

export default function NewProjectPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create New Project</h2>
          <p className="text-muted-foreground mt-2">Start managing your tasks</p>
        </div>
        
        <form action={createProject} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title
            </label>
            <Input 
              id="title" 
              name="title" 
              placeholder="My Awesome Project" 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}
