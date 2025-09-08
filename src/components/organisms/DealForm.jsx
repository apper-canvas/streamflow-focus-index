import React, { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const DealForm = ({ dealId = null, contactId = null, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: contactId ? contactId.toString() : "",
    probability: "10",
    expectedCloseDate: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stages = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  useEffect(() => {
    loadContacts();
    if (dealId) {
      loadDeal();
    }
  }, [dealId]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      toast.error("Failed to load contacts");
    }
  };

  const loadDeal = async () => {
    try {
      setLoading(true);
      const deal = await dealService.getById(dealId);
      setFormData({
        title: deal.title,
        value: deal.value.toString(),
        stage: deal.stage,
        contactId: deal.contactId.toString(),
        probability: deal.probability.toString(),
        expectedCloseDate: deal.expectedCloseDate.split("T")[0]
      });
    } catch (err) {
      toast.error("Failed to load deal");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid amount";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
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
      
      const dealData = {
        title: formData.title,
        value: parseFloat(formData.value),
        stage: formData.stage,
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability),
        expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
      };
      
      if (dealId) {
        await dealService.update(dealId, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(`Failed to ${dealId ? "update" : "create"} deal`);
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

  if (loading && dealId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Deal Title"
        type="text"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Enterprise Software License"
        error={errors.title}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Value"
          type="number"
          value={formData.value}
          onChange={(e) => handleChange("value", e.target.value)}
          placeholder="50000"
          error={errors.value}
          required
        />

        <FormField
          label="Probability (%)"
          type="range"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => handleChange("probability", e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="text-sm text-gray-600 text-center -mt-4">
        Probability: {formData.probability}%
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Contact"
          type="select"
          value={formData.contactId}
          onChange={(e) => handleChange("contactId", e.target.value)}
          options={contactOptions}
          error={errors.contactId}
          required
        />

        <FormField
          label="Stage"
          type="select"
          value={formData.stage}
          onChange={(e) => handleChange("stage", e.target.value)}
          options={stages}
          required
        />
      </div>

      <FormField
        label="Expected Close Date"
        type="date"
        value={formData.expectedCloseDate}
        onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
        error={errors.expectedCloseDate}
        required
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
          {loading ? "Saving..." : dealId ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;