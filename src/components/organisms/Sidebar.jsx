import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Activities", href: "/activities", icon: "Calendar" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreamFlow CRM
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onMobileClose}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={18} 
                    className={`mr-3 transition-colors ${
                      isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
                    }`} 
                  />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-surface rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Sales Team</p>
            <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;