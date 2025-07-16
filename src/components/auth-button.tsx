import { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
// Import the simplified helpers from our new file
import { useSession, signIn, signOut, type User } from '../lib/auth-client';

// This DropdownMenu component remains a clean way to structure the UI
const DropdownMenu = ({ user, onSignOut }: { user: User; onSignOut: () => void }) => (
  <div className='bg-popover ring-opacity-5 absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black focus:outline-none'>
    <div className='p-1'>
      <div className='px-3 py-2'>
        <p className='text-popover-foreground text-sm font-medium'>{user?.name}</p>
        <p className='text-muted-foreground truncate text-sm'>{user?.email}</p>
      </div>
      <div className='bg-border mx-1 h-px'></div>
      <button
        onClick={onSignOut}
        className='text-popover-foreground hover:bg-accent flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm'
      >
        <LogOut className='h-4 w-4' />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
);

export default function AuthButton() {
  // 1. Get session and status directly from the library's hook!
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Robust hook to handle closing the dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // 2. The sign-in and sign-out logic is now a simple function call
  const handleSignIn = async () => {
    await signIn.social({
      provider: 'github',
    });
  };
  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
  };

  // Show a loading state while the session is being fetched
  if (isPending) {
    return <div className='bg-muted h-10 w-24 animate-pulse rounded-md' />;
  }

  // If unauthenticated, show the Sign In button
  if (!session) {
    return (
      <button
        onClick={handleSignIn}
        className='border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap'
      >
        <LogIn className='h-4 w-4' />
        Sign In
      </button>
    );
  }

  // If authenticated, show the user dropdown
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className='focus:ring-ring flex items-center gap-2 rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none'
      >
        <span className='sr-only'>Open user menu</span>
        {session.user?.image ? (
          <img className='h-8 w-8 rounded-full' src={session.user.image} alt='User avatar' />
        ) : (
          <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-full'>
            <UserIcon className='text-muted-foreground h-5 w-5' />
          </div>
        )}
      </button>
      {menuOpen && <DropdownMenu user={session.user} onSignOut={handleSignOut} />}
    </div>
  );
}
