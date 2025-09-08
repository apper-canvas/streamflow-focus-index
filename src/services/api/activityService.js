class ActivityService {
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
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Subject_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "DealId_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "Duration_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "Timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('activity_c', params);

      if (!response.success) {
        console.error('Failed to fetch activities:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Subject_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "DealId_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "Duration_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await this.apperClient.getRecordById('activity_c', id, params);

      if (!response.success) {
        console.error('Failed to fetch activity:', response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Type_c: activityData.type,
          Subject_c: activityData.subject,
          Description_c: activityData.description,
          ContactId_c: activityData.contactId,
          DealId_c: activityData.dealId,
          Timestamp_c: activityData.timestamp,
          Duration_c: activityData.duration
        }]
      };

      const response = await this.apperClient.createRecord('activity_c', params);

      if (!response.success) {
        console.error('Failed to create activity:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const updateData = {};
      if (activityData.type !== undefined) updateData.Type_c = activityData.type;
      if (activityData.subject !== undefined) updateData.Subject_c = activityData.subject;
      if (activityData.description !== undefined) updateData.Description_c = activityData.description;
      if (activityData.contactId !== undefined) updateData.ContactId_c = activityData.contactId;
      if (activityData.dealId !== undefined) updateData.DealId_c = activityData.dealId;
      if (activityData.timestamp !== undefined) updateData.Timestamp_c = activityData.timestamp;
      if (activityData.duration !== undefined) updateData.Duration_c = activityData.duration;

      const params = {
        records: [{
          Id: id,
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('activity_c', params);

      if (!response.success) {
        console.error('Failed to update activity:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('activity_c', params);

      if (!response.success) {
        console.error('Failed to delete activity:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();