import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession, signIn } from '../lib/auth-client';

interface LikeButtonProps {
  readId: string;
}

export default function LikeButton({ readId }: LikeButtonProps) {
  const { data: session, isPending: isSessionLoading } = useSession();

  // The component now has three states: loading, favorited, not favorited.
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // True initially to fetch status
  const [isToggling, setIsToggling] = useState(false); // For click actions

  // This effect fetches the initial favorite status from our new API endpoint
  useEffect(() => {
    // Don't fetch until we know the user's login status
    if (isSessionLoading) {
      return;
    }

    // If the user is not logged in, we know it's not favorited.
    if (!session) {
      setIsFavorited(false);
      setIsLoading(false);
      return;
    }

    // If logged in, ask the server for the status
    let isMounted = true;
    setIsLoading(true);
    fetch(`/api/favorites/status?readId=${readId}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setIsFavorited(data.isFavorited);
        }
      })
      .catch((err) => console.error('Failed to fetch favorite status:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [readId, session, isSessionLoading]); // Rerun when session status changes

  const handleLike = async () => {
    if (!session) {
      await signIn.social({ provider: 'github' });
      return;
    }
    if (isToggling) return;

    setIsToggling(true);
    const originalState = isFavorited;
    setIsFavorited(!originalState);

    const endpoint = originalState ? '/api/favorites/remove' : '/api/favorites/add';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readId }),
      });
      if (!response.ok) setIsFavorited(originalState);
    } catch (error) {
      setIsFavorited(originalState);
    } finally {
      setIsToggling(false);
    }
  };

  // While session or favorite status is loading, show a placeholder
  if (isSessionLoading || isLoading) {
    return <div className='bg-muted inline-flex h-12 w-36 animate-pulse rounded-md' />;
  }

  const buttonText = isFavorited ? 'Favorited' : 'Favorite';
  const fillClass = isFavorited ? 'fill-red-500 text-red-500' : 'fill-none text-foreground';

  return (
    <button
      onClick={handleLike}
      disabled={isToggling}
      className='border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors disabled:opacity-50'
    >
      <Heart className={`h-5 w-5 transition-all ${fillClass}`} />
      {buttonText}
    </button>
  );
}
