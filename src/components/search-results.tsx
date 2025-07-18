import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search as SearchIcon, ArrowRight, SearchX } from 'lucide-react';
import type { IFuseOptions } from 'fuse.js';

// Define the data types used in this component
export interface ReadItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  dateAdded: string; // Received as an ISO string
}

interface Tag {
  slug: string;
  title: string;
}

interface SearchResultsProps {
  allReads: ReadItem[];
  initialQuery: string;
  allTags: Tag[];
}

// A simple highlight utility
function highlight(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<mark class="bg-primary/20 rounded-sm px-0.5 py-px text-primary-foreground">$1</mark>`);
}

// Consistent date formatting
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// A reusable empty state component
const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className='border-border flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-24 text-center'>
    <SearchX className='text-muted-foreground h-12 w-12' />
    <h2 className='text-foreground mt-4 text-2xl font-semibold tracking-tight'>{title}</h2>
    <p className='text-muted-foreground mt-2'>{message}</p>
  </div>
);

export default function SearchResults({ allReads, initialQuery, allTags }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);

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

  // Create a Map for efficient tag title lookups
  const tagMap = useMemo(() => new Map(allTags.map((tag) => [tag.slug, tag.title])), [allTags]);

  const results = initialQuery.length >= 2 ? fuse.search(initialQuery) : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 0) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <>
      <header className='mb-12'>
        <h1 className='text-foreground font-serif text-4xl font-bold tracking-tight sm:text-5xl'>Search Results</h1>
        <form onSubmit={handleFormSubmit} className='relative mt-6'>
          <label htmlFor='search-page-input' className='sr-only'>
            Search
          </label>
          <SearchIcon className='text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2' />
          <input
            id='search-page-input'
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for articles or topics...'
            className='border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary h-12 w-full rounded-md border py-2 pr-4 pl-12 text-lg focus:ring-1 focus:outline-none'
          />
        </form>
      </header>

      {!initialQuery ? (
        <EmptyState title='Begin a Search' message='Please enter a term in the field above to find articles.' />
      ) : results.length > 0 ? (
        <>
          <p className='text-muted-foreground mb-8 text-lg'>
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{initialQuery}".
          </p>
          <div className='divide-border divide-y'>
            {results.map(({ item }) => (
              <article key={item.id} className='py-10 md:py-12'>
                <div className='grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-4'>
                  <aside className='text-muted-foreground col-span-1 text-sm md:text-right'>
                    <time dateTime={item.dateAdded}>{formatDate(item.dateAdded)}</time>
                    <div className='mt-2 flex flex-wrap gap-x-2 gap-y-1 md:justify-end'>
                      {item.tags.slice(0, 3).map((tagSlug) => (
                        <a
                          key={tagSlug}
                          href={`/tags/${tagSlug}/`}
                          className='hover:text-primary relative transition-colors'
                        >
                          {tagMap.get(tagSlug) || tagSlug}
                        </a>
                      ))}
                    </div>
                  </aside>
                  <div className='col-span-1 md:col-span-3'>
                    <h2 className='text-foreground text-2xl leading-snug font-bold tracking-tight sm:text-3xl'>
                      <a
                        href={`/read/${item.id}/`}
                        className='from-primary to-primary bg-gradient-to-r bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-200 hover:bg-[length:100%_2px]'
                        dangerouslySetInnerHTML={{ __html: highlight(item.title, initialQuery) }}
                      />
                    </h2>
                    {item.summary && (
                      <p className='text-muted-foreground mt-3 line-clamp-3 text-base leading-relaxed'>
                        {item.summary}
                      </p>
                    )}
                    <a
                      href={`/read/${item.id}/`}
                      className='group text-primary mt-4 inline-flex items-center text-sm font-medium'
                    >
                      <span>Read full story</span>
                      <ArrowRight className='ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title='No Results Found'
          message={`Your search for "${initialQuery}" did not match any articles.`}
        />
      )}
    </>
  );
}
