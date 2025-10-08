'use client';

interface PortfolioFormProps {
  title: string;
  slug: string;
  error: string;
  isPending: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

export function PortfolioForm({
  title,
  slug,
  error,
  isPending,
  onTitleChange,
  onSlugChange,
  onSubmit,
  onCancel,
  mode = 'create'
}: PortfolioFormProps) {
  const isCreateMode = mode === 'create';
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-titles text-2xl md:text-3xl font-bold">
          {isCreateMode ? 'Create Portfolio' : 'Edit Portfolio'}
        </h2>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium block">
            Portfolio Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={isPending}
            placeholder="E.g: Frontend Portfolio"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 transition-all"
            required
          />
        </div>
        
        {/* Slug Field */}
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium block">
            URL Slug
          </label>
          <div className="flex items-center gap-2 mb-2 font-mono text-sm text-neutral-500">
            <span>show-off.art/u/username/</span>
            <span className="font-semibold text-blue">
              {slug || 'slug'}
            </span>
          </div>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
            disabled={isPending}
            placeholder="E.g: frontend-portfolio"
            pattern="[a-z0-9-]+"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 transition-all"
            required
          />
          <p className="font-mono text-xs text-neutral-500">
            Only lowercase letters, numbers and hyphens
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="cursor-pointer flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer flex-1 px-4 py-3 bg-blue text-white rounded-lg font-semibold hover:bg-blue/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? (isCreateMode ? 'Creating...' : 'Saving...') : (isCreateMode ? 'Create' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
}