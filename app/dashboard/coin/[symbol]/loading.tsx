export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div>
            <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
            <div className="flex items-center gap-2 mt-2">
              <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mb-1" />
              <div className="h-6 w-16 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="text-right">
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mb-1" />
              <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <div className="h-6 w-48 bg-muted rounded-lg animate-pulse mb-4" />
            <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card">
              <div className="p-6">
                <div className="h-4 w-32 bg-muted rounded-lg animate-pulse mb-4" />
                <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Skeleton */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <div className="h-6 w-48 bg-muted rounded-lg animate-pulse mb-6" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-[95%] bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-[90%] bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-[85%] bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}