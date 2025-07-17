import { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Fuse from 'fuse.js';
import type { FuseResult, IFuseOptions } from 'fuse.js';
import type { ReadItem } from '../pages/api/search.json';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<ReadItem>[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<ReadItem> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/search.json')
      .then((response) => response.json())
      .then((data: ReadItem[]) => {
        const options: IFuseOptions<ReadItem> = {
          keys: [
            { name: 'title', weight: 0.7 },
            { name: 'tags', weight: 0.3 },
          ],
          includeScore: true,
          minMatchCharLength: 2,
          threshold: 0.4,
        };
        fuseRef.current = new Fuse(data, options);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load search data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      const searchResults = fuseRef.current?.search(query) || [];
      setResults(searchResults);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
    } else {
      setTimeout(() => dialogRef.current?.close(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);

      if (!isOpen) return;

      // New 'Enter' key logic
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent any default form submission
        if (activeIndex > -1) {
          // If an item is selected, navigate to it
          const result = results[activeIndex];
          if (result) window.location.href = `/read/${result.item.id}/`;
        } else if (query.length > 0) {
          // If no item is selected, navigate to the search results page
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      }

      if (results.length === 0) return;

      // Arrow key navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, query]); // <-- query is a dependency

  const highlight = useCallback(
    (text: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return text.replace(regex, `<mark class="bg-primary/80 rounded-sm px-0.5">$1</mark>`);
    },
    [query],
  );

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='border-input bg-background text-muted-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground flex h-10 w-full max-w-md items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors'
      >
        <div className='flex items-center gap-2'>
          <SearchIcon className='h-4 w-4' />
          <span>Search articles...</span>
        </div>
        <kbd className='bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
        className={`bg-popover text-popover-foreground mx-auto w-[95vw] rounded-lg border p-0 shadow-lg transition-all duration-200 ease-in-out sm:max-w-xl ${isOpen ? 'mt-[10vh] scale-100 opacity-100 sm:mt-[15vh]' : 'mt-[8vh] scale-95 opacity-0'} backdrop:bg-black/50 backdrop:transition-opacity backdrop:duration-200 ${isOpen ? 'backdrop:opacity-100' : 'backdrop:opacity-0'}`}
      >
        <div className='flex items-center border-b px-3'>
          <SearchIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />
          <input
            ref={inputRef}
            type='text'
            placeholder='Search for news, topics, or sources...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none'
          />
        </div>
        <div className='p-2'>
          {isLoading && <div className='text-muted-foreground py-4 text-center text-sm'>Loading...</div>}
          {!isLoading && query.length > 1 && results.length === 0 && (
            <div className='py-6 text-center text-sm'>
              <p className='text-muted-foreground mb-2'>No results found for "{query}".</p>
            </div>
          )}
          <ul className='max-h-[60vh] overflow-x-hidden overflow-y-auto'>
            {results.map((result, index) => (
              <li key={result.item.id}>
                <a
                  href={`/read/${result.item.id}/`}
                  className={`block rounded-md p-3 focus:outline-none ${index === activeIndex ? 'bg-accent' : 'hover:bg-accent'}`}
                >
                  <div
                    className='text-sm font-semibold'
                    dangerouslySetInnerHTML={{ __html: highlight(result.item.title) }}
                  />
                  {result.item.tags?.length > 0 && (
                    <div
                      className='text-muted-foreground mt-1 text-xs'
                      dangerouslySetInnerHTML={{ __html: highlight(result.item.tags.join(', ')) }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
