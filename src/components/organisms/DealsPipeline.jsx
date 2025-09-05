import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const DealsPipeline = ({ onAddDeal }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: "lead", name: "Lead", color: "info" },
    { id: "qualified", name: "Qualified", color: "warning" },
    { id: "proposal", name: "Proposal", color: "primary" },
    { id: "closed-won", name: "Closed Won", color: "success" },
    { id: "closed-lost", name: "Closed Lost", color: "error" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === newStage) return;

    try {
      const updatedDeal = { ...draggedDeal, stage: newStage };
      await dealService.update(draggedDeal.Id, updatedDeal);
      await loadData();
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
    } catch (err) {
      toast.error("Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(dealId);
        await loadData();
        toast.success("Deal deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete deal");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loading type="kanban" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!loading && deals.length === 0) {
    return (
      <Empty
        title="No deals in your pipeline"
        message="Start tracking opportunities by adding your first deal."
        actionLabel="Add Deal"
        onAction={onAddDeal}
        icon="Target"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
          <p className="text-sm text-gray-500">
            {deals.length} deals • {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))} total value
          </p>
        </div>
        
        {onAddDeal && (
          <Button
            onClick={onAddDeal}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Deal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

          return (
            <div
              key={stage.id}
              className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{stage.name}</h3>
                  <p className="text-xs text-gray-500">
                    {stageDeals.length} deals • {formatCurrency(stageValue)}
                  </p>
                </div>
                <Badge variant={stage.color} size="sm">
                  {stageDeals.length}
                </Badge>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {deal.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal.Id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">
                        {getContactName(deal.contactId)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(deal.value)}
                        </div>
                        <Badge variant="default" size="sm">
                          {deal.probability}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Close: {format(new Date(deal.expectedCloseDate), "MMM dd")}
                        </div>
                        <ApperIcon name="GripVertical" size={14} className="text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Drop deals here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealsPipeline;