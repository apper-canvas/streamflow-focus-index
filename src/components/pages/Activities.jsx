import React, { useState } from "react";
import ActivitiesTimeline from "@/components/organisms/ActivitiesTimeline";
import Modal from "@/components/molecules/Modal";
import ActivityForm from "@/components/organisms/ActivityForm";

const Activities = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddActivity = () => {
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
          <h1 className="text-2xl font-bold mb-2">Activities</h1>
          <p className="text-white/90">
            Track all your customer interactions and communication history
          </p>
        </div>
      </div>

      <ActivitiesTimeline 
        key={refreshTrigger}
        onAddActivity={handleAddActivity}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Activity"
        size="lg"
      >
        <ActivityForm
          onSuccess={handleFormSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Activities;