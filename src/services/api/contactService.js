class ContactService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Company_c"}},
          {"field": {"Name": "Position_c"}},
          {"field": {"Name": "Tags_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('contact_c', params);

      if (!response.success) {
        console.error('Failed to fetch contacts:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Company_c"}},
          {"field": {"Name": "Position_c"}},
          {"field": {"Name": "Tags_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };

      const response = await this.apperClient.getRecordById('contact_c', id, params);

      if (!response.success) {
        console.error('Failed to fetch contact:', response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      const params = {
        records: [{
          Name_c: contactData.name,
          Email_c: contactData.email,
          Phone_c: contactData.phone,
          Company_c: contactData.company,
          Position_c: contactData.position,
          Tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags
        }]
      };

      const response = await this.apperClient.createRecord('contact_c', params);

      if (!response.success) {
        console.error('Failed to create contact:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const updateData = {};
      if (contactData.name !== undefined) updateData.Name_c = contactData.name;
      if (contactData.email !== undefined) updateData.Email_c = contactData.email;
      if (contactData.phone !== undefined) updateData.Phone_c = contactData.phone;
      if (contactData.company !== undefined) updateData.Company_c = contactData.company;
      if (contactData.position !== undefined) updateData.Position_c = contactData.position;
      if (contactData.tags !== undefined) {
        updateData.Tags_c = Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags;
      }

      const params = {
        records: [{
          Id: id,
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('contact_c', params);

      if (!response.success) {
        console.error('Failed to update contact:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('contact_c', params);

      if (!response.success) {
        console.error('Failed to delete contact:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const contactService = new ContactService();