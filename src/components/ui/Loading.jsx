import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "kanban") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            {[1, 2, 3].map((card) => (
              <div key={card} className="p-4 bg-white rounded-lg border space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "activity") {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;