import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/molecules/Modal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import CommentsSection from "@/components/organisms/CommentsSection";
import ContactForm from "@/components/organisms/ContactForm";
import ActivityForm from "@/components/organisms/ActivityForm";
import ActivitiesTimeline from "@/components/organisms/ActivitiesTimeline";
import TaskWidget from "@/components/organisms/TaskWidget";
import DealForm from "@/components/organisms/DealForm";
import Activities from "@/components/pages/Activities";
import Deals from "@/components/pages/Deals";

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [contactDeals, setContactDeals] = useState([]);
  const [comments, setComments] = useState([]);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [isEditDealModalOpen, setIsEditDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const loadContactData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [contactData, allDeals, commentService] = await Promise.all([
        contactService.getById(parseInt(id)),
        dealService.getAll(),
        import('@/services/api/commentService').then(m => m.commentService)
      ]);
      
      const contactDeals = allDeals.filter(deal => deal.contactId === parseInt(id));
      const contactComments = await commentService.getByContactId(parseInt(id));
      
      setContact(contactData);
      setDeals(contactDeals);
      setComments(contactComments);
    } catch (err) {
      setError("Failed to load contact details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactData();
  }, [id, refreshTrigger]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddActivitySuccess = () => {
    setIsAddActivityModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
};

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
      try {
        await dealService.delete(dealId);
        await loadContactData();
        toast.success("Deal deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete deal");
      }
    }
  };

const handleDealSuccess = () => {
    setIsAddDealModalOpen(false);
    setIsEditDealModalOpen(false);
    setEditingDeal(null);
    loadContactData();
  };

  const handleCommentsUpdate = () => {
    loadContactData();
  };

  const handleDeleteContact = async () => {
    if (window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      try {
        await contactService.delete(parseInt(id));
        toast.success("Contact deleted successfully!");
        navigate("/contacts");
      } catch (err) {
        toast.error("Failed to delete contact");
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

  const getStageColor = (stage) => {
    const colors = {
      "lead": "info",
      "qualified": "warning", 
      "proposal": "primary",
      "closed-won": "success",
      "closed-lost": "error"
    };
    return colors[stage] || "default";
  };

const tabs = [
    { id: "details", label: "Details", icon: "User" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" },
    { id: "activities", label: "Activities", icon: "Activity" },
    { id: "comments", label: "Comments", icon: "MessageSquare" },
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContactData} />;
  if (!contact) return <Error message="Contact not found" />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
              <p className="text-gray-600">{contact.position} at {contact.company}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <ApperIcon name="Mail" size={16} className="mr-2" />
                  {contact.email}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Phone" size={16} className="mr-2" />
                  {contact.phone}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  Created {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsAddActivityModalOpen(true)}
              variant="outline"
              className="bg-gradient-to-r from-success/10 to-emerald-500/10 border-success/20 text-success hover:from-success hover:to-emerald-500 hover:text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Activity
            </Button>
            
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
            
            <Button
              onClick={handleDeleteContact}
              variant="outline"
              className="text-error border-error/20 hover:bg-error hover:text-white"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
<span>{tab.label}</span>
                {tab.id === "deals" && deals.length > 0 && (
                  <Badge variant="primary" size="sm">
                    {deals.length}
                  </Badge>
                )}
                {tab.id === "comments" && comments.length > 0 && (
                  <Badge variant="primary" size="sm">
                    {comments.length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="text-sm text-gray-900 mt-1">{contact.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 mt-1">{contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900 mt-1">{contact.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="text-sm text-gray-900 mt-1">{contact.company}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Position</dt>
<dd className="text-sm text-gray-900 mt-1">{contact.position}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {deals.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Deals</div>
                  </div>
                  <div className="bg-gradient-to-br from-success/10 to-emerald-500/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="bg-gradient-to-br from-info/10 to-blue-500/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-info">
                      {comments.length}
                    </div>
<div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <TaskWidget contactId={parseInt(id)} />
          )}
            {activeTab === "activities" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                  <Button 
                    onClick={() => setIsAddActivityModalOpen(true)}
                    size="sm"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Activity
                  </Button>
                </div>
                
                <ActivitiesTimeline 
                  contactId={parseInt(id)}
onAddActivity={() => setIsAddActivityModalOpen(true)}
                />
              </div>
            )}

          {activeTab === "deals" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Deals</h3>
                <Button
                  onClick={() => setIsAddDealModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Deal
                </Button>
              </div>

              {deals.length > 0 ? (
                <div className="space-y-3">
                  {deals.map((deal) => (
                    <div key={deal.Id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{deal.title}</h4>
                            <Badge variant={getStageColor(deal.stage)} size="sm">
                              {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1).replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-semibold">{formatCurrency(deal.value)}</span>
                            <span>{deal.probability}% probability</span>
                            <span>Close: {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingDeal(deal);
                              setIsEditDealModalOpen(true);
                            }}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeal(deal.Id)}
                            className="text-error hover:text-error hover:bg-error/10"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Target" size={32} className="mx-auto mb-3 opacity-50" />
                  <p>No deals found for this contact</p>
                  <p className="text-sm">Create a deal to start tracking opportunities</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              </div>
              <CommentsSection contactId={contact?.Id} onUpdate={handleCommentsUpdate} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contactId={parseInt(id)}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
        title="Add Activity"
        size="lg"
      >
        <ActivityForm
          contactId={parseInt(id)}
          onSuccess={handleAddActivitySuccess}
          onCancel={() => setIsAddActivityModalOpen(false)}
/>
      </Modal>

      {/* Deal Modals */}
      <Modal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          contactId={contact?.Id}
          onSuccess={handleDealSuccess}
          onCancel={() => setIsAddDealModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditDealModalOpen}
        onClose={() => {
          setIsEditDealModalOpen(false);
          setEditingDeal(null);
        }}
        title="Edit Deal"
        size="lg"
      >
        <DealForm
          dealId={editingDeal?.Id}
          onSuccess={handleDealSuccess}
          onCancel={() => {
            setIsEditDealModalOpen(false);
            setEditingDeal(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ContactDetail;