import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    recentActivities: 0,
    wonDeals: 0,
    pipeline: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const wonDeals = deals.filter(deal => deal.stage === "closed-won").length;
      const recentActivities = activities.filter(
        activity => new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;

      const pipeline = [
        { stage: "Lead", count: deals.filter(d => d.stage === "lead").length, color: "info" },
        { stage: "Qualified", count: deals.filter(d => d.stage === "qualified").length, color: "warning" },
        { stage: "Proposal", count: deals.filter(d => d.stage === "proposal").length, color: "primary" },
        { stage: "Closed Won", count: deals.filter(d => d.stage === "closed-won").length, color: "success" }
      ];

      setStats({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalValue,
        recentActivities,
        wonDeals,
        pipeline
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const mainStats = [
    {
      name: "Total Contacts",
      value: stats.totalContacts.toLocaleString(),
      icon: "Users",
      color: "primary",
      bg: "from-primary/10 to-secondary/10"
    },
    {
      name: "Active Deals",
      value: stats.totalDeals.toLocaleString(),
      icon: "Target",
      color: "success",
      bg: "from-success/10 to-emerald-500/10"
    },
    {
      name: "Pipeline Value",
      value: formatCurrency(stats.totalValue),
      icon: "DollarSign",
      color: "warning",
      bg: "from-warning/10 to-orange-500/10"
    },
    {
      name: "Recent Activities",
      value: stats.recentActivities.toLocaleString(),
      icon: "Calendar",
      color: "info",
      bg: "from-info/10 to-blue-600/10"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <ApperIcon name="BarChart3" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to StreamFlow CRM</h1>
            <p className="text-white/90">
              Here's an overview of your sales pipeline and customer relationships
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
            <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.pipeline.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${stage.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{stage.count} deals</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 bg-${stage.color} rounded-full`} 
                      style={{ width: `${Math.max((stage.count / Math.max(stats.totalDeals, 1)) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <ApperIcon name="Zap" size={20} className="text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/contacts"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <ApperIcon name="UserPlus" size={24} className="text-gray-400 group-hover:text-primary mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-primary">Add Contact</span>
            </a>
            
            <a
              href="/deals"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors group"
            >
              <ApperIcon name="Plus" size={24} className="text-gray-400 group-hover:text-secondary mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-secondary">New Deal</span>
            </a>
            
            <a
              href="/activities"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-success hover:bg-success/5 transition-colors group"
            >
              <ApperIcon name="Calendar" size={24} className="text-gray-400 group-hover:text-success mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-success">Log Activity</span>
            </a>
            
            <a
              href="/settings"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-warning hover:bg-warning/5 transition-colors group"
            >
              <ApperIcon name="Settings" size={24} className="text-gray-400 group-hover:text-warning mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-warning">Settings</span>
            </a>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">{stats.wonDeals}</div>
            <div className="text-sm text-gray-600">Deals Won</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalDeals > 0 ? Math.round((stats.wonDeals / stats.totalDeals) * 100) : 0}% success rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatCurrency(stats.totalValue / Math.max(stats.totalContacts, 1))}
            </div>
            <div className="text-sm text-gray-600">Avg. Deal Value</div>
            <div className="text-xs text-gray-500 mt-1">per contact</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-2">{stats.recentActivities}</div>
            <div className="text-sm text-gray-600">Recent Activities</div>
            <div className="text-xs text-gray-500 mt-1">last 7 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;