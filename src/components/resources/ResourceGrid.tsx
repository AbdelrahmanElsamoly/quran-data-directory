import { ResourceCard } from './ResourceCard';
import type { Resource } from '@/types/resource';

interface ResourceGridProps {
  resources: Resource[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-muted)] font-heading">
          No resources found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
