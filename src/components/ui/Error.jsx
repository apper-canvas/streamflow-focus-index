import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-error" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;