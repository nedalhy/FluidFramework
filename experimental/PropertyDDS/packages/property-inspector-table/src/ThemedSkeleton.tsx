import React from "react";
import { SkeletonTheme } from "react-loading-skeleton";

/**
 * @param inSkeleton - basic skeleton
 * @returns Custom skeleton
 */
 export const ThemedSkeleton = (inSkeleton: JSX.Element) => {
    return (
      <SkeletonTheme color="#C4C4C4">
        {inSkeleton}
      </SkeletonTheme>
    );
  };