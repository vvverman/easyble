import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth-client'

export function NavUser() {
  const router = useRouter()

  const { data, isPending } = authClient.useSession()
  const sessionUser = data?.user

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!sessionUser) {
    return (
      <button onClick={() => router.push('/sign-in')}>
        Sign in
      </button>
    )
  }

  return (
    <div>
      <span>{sessionUser.name || sessionUser.email}</span>
      <button onClick={() => authClient.signOut()}>
        Sign out
      </button>
    </div>
  )
}
