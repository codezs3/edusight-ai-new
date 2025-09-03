'use client';

import React, { memo, forwardRef, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface VirtualizedListProps {
  items: any[];
  height: number;
  itemHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => Promise<void>;
  className?: string;
  overscanCount?: number;
}

interface ItemRendererProps extends ListChildComponentProps {
  data: {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
  };
}

// Memoized item renderer for optimal performance
const ItemRenderer = memo(({ index, style, data }: ItemRendererProps) => {
  const { items, renderItem } = data;
  const item = items[index];
  
  // Handle loading states for infinite scroll
  if (!item) {
    return (
      <div style={style} className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div style={style}>
      {renderItem(item, index)}
    </div>
  );
});

ItemRenderer.displayName = 'VirtualizedListItem';

// Main virtualized list component
const VirtualizedList = memo(forwardRef<List, VirtualizedListProps>(({
  items,
  height,
  itemHeight,
  renderItem,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  className = '',
  overscanCount = 5,
}, ref) => {
  
  // Memoize item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items,
    renderItem,
  }), [items, renderItem]);

  // Calculate total item count including loading indicator
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  
  // Check if item is loaded (for infinite loading)
  const isItemLoaded = (index: number) => !!items[index];

  // If we have infinite loading, wrap with InfiniteLoader
  if (hasNextPage && loadNextPage) {
    return (
      <div className={className}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadNextPage}
          threshold={3} // Load more when 3 items from the end
        >
          {({ onItemsRendered, ref: infiniteRef }) => (
            <List
              ref={(list) => {
                if (typeof infiniteRef === 'function') {
                  infiniteRef(list);
                }
                if (ref) {
                  if (typeof ref === 'function') {
                    ref(list);
                  } else {
                    ref.current = list;
                  }
                }
              }}
              height={height}
              itemCount={itemCount}
              itemSize={itemHeight}
              itemData={itemData}
              onItemsRendered={onItemsRendered}
              overscanCount={overscanCount}
            >
              {ItemRenderer}
            </List>
          )}
        </InfiniteLoader>
      </div>
    );
  }

  // Standard virtual list without infinite loading
  return (
    <div className={className}>
      <List
        ref={ref}
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscanCount}
      >
        {ItemRenderer}
      </List>
    </div>
  );
}));

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;

// Pre-built components for common use cases

// Student List Component
export const VirtualizedStudentList = memo(({ 
  students, 
  onStudentClick,
  height = 400,
  ...props 
}: {
  students: any[];
  onStudentClick?: (student: any) => void;
  height?: number;
} & Partial<VirtualizedListProps>) => {
  
  const renderStudent = useMemo(() => (student: any, index: number) => (
    <div 
      className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onStudentClick?.(student)}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 font-medium">
          {student.user?.name?.charAt(0) || 'S'}
        </span>
      </div>
      <div className="ml-4 flex-1">
        <div className="text-sm font-medium text-gray-900">
          {student.user?.name || 'Unknown Student'}
        </div>
        <div className="text-sm text-gray-500">
          Grade: {student.grade} | Section: {student.section || 'N/A'}
        </div>
      </div>
      <div className="text-xs text-gray-400">
        ID: {student.id.slice(-6)}
      </div>
    </div>
  ), [onStudentClick]);

  return (
    <VirtualizedList
      items={students}
      height={height}
      itemHeight={80}
      renderItem={renderStudent}
      {...props}
    />
  );
});

VirtualizedStudentList.displayName = 'VirtualizedStudentList';

// Assessment List Component
export const VirtualizedAssessmentList = memo(({ 
  assessments, 
  onAssessmentClick,
  height = 400,
  ...props 
}: {
  assessments: any[];
  onAssessmentClick?: (assessment: any) => void;
  height?: number;
} & Partial<VirtualizedListProps>) => {
  
  const renderAssessment = useMemo(() => (assessment: any, index: number) => (
    <div 
      className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onAssessmentClick?.(assessment)}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">
            {assessment.subject || 'General Assessment'}
          </div>
          <div className={`text-sm font-medium ${
            assessment.score >= 80 ? 'text-green-600' : 
            assessment.score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {assessment.score}%
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {new Date(assessment.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  ), [onAssessmentClick]);

  return (
    <VirtualizedList
      items={assessments}
      height={height}
      itemHeight={72}
      renderItem={renderAssessment}
      {...props}
    />
  );
});

VirtualizedAssessmentList.displayName = 'VirtualizedAssessmentList';

// Analytics Data List Component
export const VirtualizedAnalyticsList = memo(({ 
  analytics, 
  onItemClick,
  height = 400,
  ...props 
}: {
  analytics: any[];
  onItemClick?: (item: any) => void;
  height?: number;
} & Partial<VirtualizedListProps>) => {
  
  const renderAnalytic = useMemo(() => (analytic: any, index: number) => (
    <div 
      className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onItemClick?.(analytic)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {analytic.title || `Analysis #${index + 1}`}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Score: {analytic.score} | Date: {new Date(analytic.date).toLocaleDateString()}
          </div>
        </div>
        <div className="text-xs text-blue-600">
          View Details →
        </div>
      </div>
    </div>
  ), [onItemClick]);

  return (
    <VirtualizedList
      items={analytics}
      height={height}
      itemHeight={68}
      renderItem={renderAnalytic}
      {...props}
    />
  );
});

VirtualizedAnalyticsList.displayName = 'VirtualizedAnalyticsList';
