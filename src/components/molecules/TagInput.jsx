import React, { useState } from "react";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const TagInput = ({ value = [], onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge key={index} variant="primary" className="group cursor-pointer">
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;