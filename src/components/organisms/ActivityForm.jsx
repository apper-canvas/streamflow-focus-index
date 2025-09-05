import React, { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

const ActivityForm = ({ activityId = null, contactId = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "call",
    subject: "",
    description: "",
    contactId: contactId ? contactId.toString() : "",
    dealId: "",
    timestamp: new Date().toISOString().slice(0, 16),
    duration: ""
  });
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activityTypes = [
    { value: "call", label: "Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" },
    { value: "task", label: "Task" }
  ];

  useEffect(() => {
    loadOptions();
    if (activityId) {
      loadActivity();
    }
  }, [activityId]);

  const loadOptions = async () => {
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      toast.error("Failed to load form options");
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await activityService.getById(activityId);
      setFormData({
        type: activity.type,
        subject: activity.subject,
        description: activity.description,
        contactId: activity.contactId.toString(),
        dealId: activity.dealId ? activity.dealId.toString() : "",
        timestamp: new Date(activity.timestamp).toISOString().slice(0, 16),
        duration: activity.duration ? activity.duration.toString() : ""
      });
    } catch (err) {
      toast.error("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.timestamp) {
      newErrors.timestamp = "Date and time is required";
    }

    if (formData.duration && (isNaN(parseInt(formData.duration)) || parseInt(formData.duration) < 0)) {
      newErrors.duration = "Please enter a valid duration in minutes";
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
      
      const activityData = {
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        timestamp: new Date(formData.timestamp).toISOString(),
        duration: formData.duration ? parseInt(formData.duration) : null
      };
      
      if (activityId) {
        await activityService.update(activityId, activityData);
        toast.success("Activity updated successfully!");
      } else {
        await activityService.create(activityData);
        toast.success("Activity created successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(`Failed to ${activityId ? "update" : "create"} activity`);
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

  const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} (${contact.company})`
  }));

  const dealOptions = deals
    .filter(deal => !formData.contactId || deal.contactId.toString() === formData.contactId)
    .map(deal => ({
      value: deal.Id.toString(),
      label: deal.title
    }));

  if (loading && activityId) {
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
          label="Activity Type"
          type="select"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          options={activityTypes}
          required
        />

        <FormField
          label="Date & Time"
          type="datetime-local"
          value={formData.timestamp}
          onChange={(e) => handleChange("timestamp", e.target.value)}
          error={errors.timestamp}
          required
        />
      </div>

      <FormField
        label="Subject"
        type="text"
        value={formData.subject}
        onChange={(e) => handleChange("subject", e.target.value)}
        placeholder="Call to discuss proposal"
        error={errors.subject}
        required
      />

      <FormField
        label="Description"
        type="textarea"
        rows={4}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Notes about the activity..."
        error={errors.description}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Contact"
          type="select"
          value={formData.contactId}
          onChange={(e) => handleChange("contactId", e.target.value)}
          options={contactOptions}
          error={errors.contactId}
          required
          disabled={!!contactId}
        />

        <FormField
          label="Related Deal (Optional)"
          type="select"
          value={formData.dealId}
          onChange={(e) => handleChange("dealId", e.target.value)}
          options={dealOptions}
        />
      </div>

      <FormField
        label="Duration (minutes)"
        type="number"
        value={formData.duration}
        onChange={(e) => handleChange("duration", e.target.value)}
        placeholder="30"
        error={errors.duration}
      />

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
          {loading ? "Saving..." : activityId ? "Update Activity" : "Create Activity"}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;