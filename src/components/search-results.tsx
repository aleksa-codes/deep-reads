import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search as SearchIcon } from 'lucide-react';
import type { IFuseOptions } from 'fuse.js';
import type { ReadItem } from '../pages/api/search.json';

interface SearchResultsProps {
  allReads: ReadItem[];
  initialQuery: string;
}

function highlight(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<mark class="bg-primary/80 rounded-sm px-0.5">$1</mark>`);
}

export default function SearchResults({ allReads, initialQuery }: SearchResultsProps) {
  // The query state is managed by this component
  const [query, setQuery] = useState(initialQuery);

  // Initialize Fuse.js once. useMemo prevents re-initialization on every render.
  const fuse = useMemo(() => {
    const options: IFuseOptions<ReadItem> = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'tags', weight: 0.3 },
      ],
      includeScore: true,
      minMatchCharLength: 2,
      threshold: 0.4,
    };
    return new Fuse(allReads, options);
  }, [allReads]);

  // Perform the search based on the initial query passed from Astro's URL param
  const results = initialQuery.length >= 2 ? fuse.search(initialQuery) : [];

  // This function handles the form submission when the user presses Enter
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 0) {
      // Navigate to the same page but with the new query parameter
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div>
      {/* The input is now wrapped in a form */}
      <form onSubmit={handleFormSubmit} className='relative mb-8'>
        <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
        <input
          type='search'
          value={query} // The input value is controlled by the component's state
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Refine your search...'
          className='border-input bg-background ring-offset-background flex h-12 w-full rounded-md border py-2 pr-4 pl-12 text-lg'
        />
      </form>

      {initialQuery ? (
        <>
          <h1 className='text-foreground mb-6 text-2xl font-bold tracking-tight'>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{initialQuery}"
          </h1>

          {results.length > 0 ? (
            <div className='space-y-8'>
              {results.map(({ item }) => (
                <article key={item.id} className='border-b pb-8 last:border-b-0'>
                  <h2 className='mb-2 text-xl font-semibold'>
                    <a
                      href={`/read/${item.id}/`}
                      className='hover:text-primary'
                      dangerouslySetInnerHTML={{ __html: highlight(item.title, initialQuery) }}
                    />
                  </h2>
                  {item.summary && (
                    <p className='text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed'>{item.summary}</p>
                  )}
                  {item.tags && (
                    <div
                      className='text-muted-foreground flex flex-wrap gap-1 text-xs'
                      dangerouslySetInnerHTML={{ __html: highlight(item.tags.join(', '), initialQuery) }}
                    />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground py-12 text-center'>
              <p>No articles found matching your search.</p>
            </div>
          )}
        </>
      ) : (
        <div className='text-muted-foreground py-12 text-center'>
          <p>Please enter a search term above to see results.</p>
        </div>
      )}
    </div>
  );
}
