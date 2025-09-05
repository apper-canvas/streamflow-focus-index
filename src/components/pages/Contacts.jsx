import React, { useState } from "react";
import ContactList from "@/components/organisms/ContactList";
import Modal from "@/components/molecules/Modal";
import ContactForm from "@/components/organisms/ContactForm";

const Contacts = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddContact = () => {
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
          <h1 className="text-2xl font-bold mb-2">Contacts</h1>
          <p className="text-white/90">
            Manage your customer relationships and contact information
          </p>
        </div>
      </div>

      <ContactList 
        key={refreshTrigger}
        onAddContact={handleAddContact}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Contact"
        size="lg"
      >
        <ContactForm
          onSuccess={handleFormSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Contacts;