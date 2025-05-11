import { Skeleton } from "@/components/ui/skeleton"
import { DashboardStatsSkeleton } from "./DashboardStatsSkeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 animate-in">
      <div className="h-8 w-1/3 mb-2">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="h-5 w-1/2 mb-4">
        <Skeleton className="h-5 w-full" />
      </div>
      {/* Tarjetas resumen skeleton reales */}
      <DashboardStatsSkeleton />
      {/* Grids de ventas recientes y productos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Skeleton className="h-6 w-1/2 mb-2" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-6 w-1/2 mb-2" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
} 