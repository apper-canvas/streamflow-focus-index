import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const Settings = () => {
  const [pipelineStages, setPipelineStages] = useState([
    { id: 1, name: "Lead", order: 1 },
    { id: 2, name: "Qualified", order: 2 },
    { id: 3, name: "Proposal", order: 3 },
    { id: 4, name: "Closed Won", order: 4 },
    { id: 5, name: "Closed Lost", order: 5 }
  ]);
  
  const [newStage, setNewStage] = useState("");
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    browserNotifications: false,
    weeklyReports: true,
    autoSave: true,
    compactView: false
  });

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStage.trim()) return;

    const stage = {
      id: Date.now(),
      name: newStage.trim(),
      order: pipelineStages.length + 1
    };

    setPipelineStages([...pipelineStages, stage]);
    setNewStage("");
    toast.success("Pipeline stage added successfully!");
  };

  const handleDeleteStage = (stageId) => {
    if (pipelineStages.length <= 2) {
      toast.error("You must have at least 2 pipeline stages");
      return;
    }

    setPipelineStages(pipelineStages.filter(stage => stage.id !== stageId));
    toast.success("Pipeline stage deleted successfully!");
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success("Preferences updated!");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-white/90">
          Customize your CRM experience and configure pipeline stages
        </p>
      </div>

      {/* Pipeline Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="Target" size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Stages</h2>
            <p className="text-sm text-gray-600">Configure your sales pipeline stages</p>
          </div>
        </div>

        <div className="space-y-4">
          {pipelineStages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{stage.order}</span>
                </div>
                <span className="font-medium text-gray-900">{stage.name}</span>
              </div>
              
              {pipelineStages.length > 2 && (
                <Button
                  onClick={() => handleDeleteStage(stage.id)}
                  variant="ghost"
                  size="sm"
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddStage} className="mt-6">
          <div className="flex space-x-3">
            <FormField
              label=""
              type="text"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              placeholder="Enter new stage name"
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mt-6"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Stage
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-success/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="Settings" size={16} className="text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            <p className="text-sm text-gray-600">Customize your application settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Notifications</h3>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive email updates for important activities</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Browser Notifications</div>
                <div className="text-sm text-gray-600">Show desktop notifications in your browser</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.browserNotifications}
                  onChange={(e) => handlePreferenceChange("browserNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Weekly Reports</div>
                <div className="text-sm text-gray-600">Receive weekly performance summaries</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weeklyReports}
                  onChange={(e) => handlePreferenceChange("weeklyReports", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Interface</h3>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Auto-save</div>
                <div className="text-sm text-gray-600">Automatically save form changes</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoSave}
                  onChange={(e) => handlePreferenceChange("autoSave", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Compact View</div>
                <div className="text-sm text-gray-600">Use compact layout for tables and lists</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.compactView}
                  onChange={(e) => handlePreferenceChange("compactView", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-info/20 to-blue-600/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="Info" size={16} className="text-info" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">About StreamFlow CRM</h2>
            <p className="text-sm text-gray-600">Application information and support</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
            <ApperIcon name="Zap" size={32} className="mx-auto text-primary mb-2" />
            <div className="font-semibold text-gray-900">Version 1.0.0</div>
            <div className="text-sm text-gray-600">Current release</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-success/5 to-emerald-500/5 rounded-lg">
            <ApperIcon name="Users" size={32} className="mx-auto text-success mb-2" />
            <div className="font-semibold text-gray-900">Small Teams</div>
            <div className="text-sm text-gray-600">Built for efficiency</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-warning/5 to-orange-500/5 rounded-lg">
            <ApperIcon name="Heart" size={32} className="mx-auto text-warning mb-2" />
            <div className="font-semibold text-gray-900">Open Source</div>
            <div className="text-sm text-gray-600">Community driven</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;