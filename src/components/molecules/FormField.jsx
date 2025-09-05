import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";

const FormField = ({ 
  label, 
  type = "text", 
  options = [], 
  error = "", 
  required = false,
  className = "",
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select error={!!error} {...props}>
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case "textarea":
        return <TextArea error={!!error} {...props} />;
      default:
        return <Input type={type} error={!!error} {...props} />;
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;