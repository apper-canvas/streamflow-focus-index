import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const ActivitiesTimeline = ({ onAddActivity, contactId = null }) => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const activityTypes = [
    { id: "call", name: "Call", icon: "Phone", color: "info" },
    { id: "email", name: "Email", icon: "Mail", color: "primary" },
    { id: "meeting", name: "Meeting", icon: "Users", color: "success" },
    { id: "note", name: "Note", icon: "FileText", color: "warning" },
    { id: "task", name: "Task", icon: "CheckSquare", color: "secondary" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      
      let filteredByContact = activitiesData;
      if (contactId) {
        filteredByContact = activitiesData.filter(activity => activity.contactId === contactId);
      }
      
      setActivities(filteredByContact);
      setFilteredActivities(filteredByContact);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [contactId]);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Sort by timestamp, newest first
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredActivities(filtered);
  }, [searchTerm, filterType, activities]);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getActivityTypeInfo = (type) => {
    return activityTypes.find(t => t.id === type) || activityTypes[0];
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityService.delete(activityId);
        await loadData();
        toast.success("Activity deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete activity");
      }
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  if (loading) return <Loading type="activity" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!loading && activities.length === 0) {
    return (
      <Empty
        title="No activities recorded"
        message="Start tracking interactions by adding your first activity."
        actionLabel="Add Activity"
        onAction={onAddActivity}
        icon="Calendar"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search activities..."
            className="flex-1 max-w-md"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Types</option>
            {activityTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {onAddActivity && (
          <Button
            onClick={onAddActivity}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Activity
          </Button>
        )}
      </div>

      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          message="Try adjusting your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setFilterType("all");
          }}
          icon="Search"
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const typeInfo = getActivityTypeInfo(activity.type);
            const isLast = index === filteredActivities.length - 1;

            return (
              <div key={activity.Id} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${typeInfo.color}/20 to-${typeInfo.color}/30 flex items-center justify-center border-2 border-white shadow-sm`}>
                      <ApperIcon name={typeInfo.icon} size={16} className={`text-${typeInfo.color}`} />
                    </div>
                    {!isLast && (
                      <div className="absolute top-10 left-5 w-px h-16 bg-gray-200"></div>
                    )}
                  </div>

                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {activity.subject}
                          </h3>
                          <Badge variant={typeInfo.color} size="sm">
                            {typeInfo.name}
                          </Badge>
                          {activity.duration && (
                            <span className="text-xs text-gray-500">
                              {formatDuration(activity.duration)}
                            </span>
                          )}
                        </div>

                        {!contactId && (
                          <p className="text-sm text-gray-600 mb-2">
                            <ApperIcon name="User" size={14} className="inline mr-1" />
                            {getContactName(activity.contactId)}
                          </p>
                        )}

                        <p className="text-sm text-gray-700 mb-3">
                          {activity.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.Id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-error hover:text-error hover:bg-error/10"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivitiesTimeline;