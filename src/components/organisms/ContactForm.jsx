import React, { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import TagInput from "@/components/molecules/TagInput";
import Button from "@/components/atoms/Button";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const ContactForm = ({ contactId = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contactId) {
      loadContact();
    }
  }, [contactId]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const contact = await contactService.getById(contactId);
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        tags: contact.tags
      });
    } catch (err) {
      toast.error("Failed to load contact");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (contactId) {
        await contactService.update(contactId, formData);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.create(formData);
        toast.success("Contact created successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(`Failed to ${contactId ? "update" : "create"} contact`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (loading && contactId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Doe"
          error={errors.name}
          required
        />

        <FormField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john.doe@company.com"
          error={errors.email}
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="(555) 123-4567"
          error={errors.phone}
          required
        />

        <FormField
          label="Company"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Acme Inc."
          error={errors.company}
          required
        />
      </div>

      <FormField
        label="Position"
        type="text"
        value={formData.position}
        onChange={(e) => handleChange("position", e.target.value)}
        placeholder="Senior Manager"
        error={errors.position}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <TagInput
          value={formData.tags}
          onChange={(tags) => handleChange("tags", tags)}
          placeholder="Add tags (press Enter to add)"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          disabled={loading}
        >
          {loading ? "Saving..." : contactId ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;