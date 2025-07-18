import { useState, useEffect, useRef } from 'react';
import { LogOut, LogIn, Heart, UserIcon } from 'lucide-react';
import { useSession, signIn, signOut, type User } from '../lib/auth-client';

// The DropdownMenu component is refined to use theme variables consistently.
const DropdownMenu = ({ user, onSignOut }: { user: User; onSignOut: () => void }) => (
  <div className='bg-popover text-popover-foreground ring-border absolute right-0 mt-2 w-56 origin-top-right rounded-md border shadow-lg ring-1 focus:outline-none'>
    <div className='p-1'>
      <div className='px-3 py-2'>
        <p className='text-foreground text-sm font-medium'>{user?.name}</p>
        <p className='text-muted-foreground truncate text-sm'>{user?.email}</p>
      </div>
      <div className='bg-border mx-1 my-1 h-px'></div>
      <a
        href='/favorites'
        className='hover:bg-accent text-popover-foreground flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm'
      >
        <Heart className='h-4 w-4' />
        <span>My Favorites</span>
      </a>
      <button
        onClick={onSignOut}
        className='hover:bg-accent text-popover-foreground flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm'
      >
        <LogOut className='h-4 w-4' />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
);

export default function AuthButton() {
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSignIn = async () => {
    // Redirect back to the current page after a successful sign-in.
    await signIn.social({ provider: 'github' });
  };

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
  };

  // LOADING STATE: A pulsing circle that matches the final avatar size.
  if (isPending) {
    return <div className='bg-muted h-8 w-8 animate-pulse rounded-full' />;
  }

  // UNAUTHENTICATED STATE: A clean, icon-only button.
  if (!session) {
    return (
      <button
        onClick={handleSignIn}
        aria-label='Sign In'
        className='text-muted-foreground hover:bg-accent hover:text-accent-foreground border-input inline-flex h-10 w-10 items-center justify-center rounded-md border bg-transparent transition-colors'
      >
        <LogIn className='h-5 w-5' />
      </button>
    );
  }

  // AUTHENTICATED STATE: The user avatar which opens a dropdown menu.
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className='focus:ring-ring focus:ring-offset-background flex items-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none'
        aria-label='Open user menu'
      >
        <span className='sr-only'>Open user menu</span>
        {session.user?.image ? (
          <img
            className='h-8 w-8 rounded-full border-2 border-transparent'
            src={session.user.image}
            alt='User avatar'
          />
        ) : (
          <div className='bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 border-transparent'>
            <UserIcon className='h-5 w-5' />
          </div>
        )}
      </button>
      {menuOpen && <DropdownMenu user={session.user} onSignOut={handleSignOut} />}
    </div>
  );
}
