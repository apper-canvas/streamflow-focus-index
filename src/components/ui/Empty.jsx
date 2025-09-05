import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        {onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;