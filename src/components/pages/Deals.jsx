import React, { useState } from "react";
import DealsPipeline from "@/components/organisms/DealsPipeline";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";

const Deals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddDeal = () => {
    setIsAddModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Sales Pipeline</h1>
          <p className="text-white/90">
            Track and manage your sales opportunities through each stage
          </p>
        </div>
      </div>

      <DealsPipeline 
        key={refreshTrigger}
        onAddDeal={handleAddDeal}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          onSuccess={handleFormSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Deals;