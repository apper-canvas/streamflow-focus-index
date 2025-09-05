import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const ContactList = ({ onContactSelect, onAddContact }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const handleDeleteContact = async (contactId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId);
        await loadContacts();
        toast.success("Contact deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleContactClick = (contact) => {
    if (onContactSelect) {
      onContactSelect(contact);
    } else {
      navigate(`/contacts/${contact.Id}`);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;
  if (!loading && contacts.length === 0) {
    return (
      <Empty
        title="No contacts yet"
        message="Start building your customer relationships by adding your first contact."
        actionLabel="Add Contact"
        onAction={onAddContact}
        icon="Users"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search contacts..."
          className="flex-1 max-w-md"
        />
        
        {onAddContact && (
          <Button
            onClick={onAddContact}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Contact
          </Button>
        )}
      </div>

      {filteredContacts.length === 0 ? (
        <Empty
          title="No matches found"
          message="Try adjusting your search terms or add a new contact."
          actionLabel="Clear Search"
          onAction={() => setSearchTerm("")}
          icon="Search"
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.Id}
                    onClick={() => handleContactClick(contact)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company}</div>
                      <div className="text-sm text-gray-500">{contact.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="primary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="default" size="sm">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(contact.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/contacts/${contact.Id}/edit`);
                          }}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteContact(contact.Id, e)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;