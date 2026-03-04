"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartSkeletonProps {
  titleWidth?: number
}

export function ChartSkeleton({ titleWidth = 120 }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton
          style={{ width: titleWidth }}
          className="h-5"
        />
      </CardHeader>

      <CardContent className="h-80">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  )
}