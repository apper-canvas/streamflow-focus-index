class DealService {
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
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Value_c"}},
          {"field": {"Name": "Stage_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Probability_c"}},
          {"field": {"Name": "ExpectedCloseDate_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('deal_c', params);

      if (!response.success) {
        console.error('Failed to fetch deals:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Value_c"}},
          {"field": {"Name": "Stage_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Probability_c"}},
          {"field": {"Name": "ExpectedCloseDate_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await this.apperClient.getRecordById('deal_c', id, params);

      if (!response.success) {
        console.error('Failed to fetch deal:', response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Title_c: dealData.title,
          Value_c: dealData.value,
          Stage_c: dealData.stage,
          ContactId_c: dealData.contactId,
          Probability_c: dealData.probability,
          ExpectedCloseDate_c: dealData.expectedCloseDate
        }]
      };

      const response = await this.apperClient.createRecord('deal_c', params);

      if (!response.success) {
        console.error('Failed to create deal:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const updateData = {};
      if (dealData.title !== undefined) updateData.Title_c = dealData.title;
      if (dealData.value !== undefined) updateData.Value_c = dealData.value;
      if (dealData.stage !== undefined) updateData.Stage_c = dealData.stage;
      if (dealData.contactId !== undefined) updateData.ContactId_c = dealData.contactId;
      if (dealData.probability !== undefined) updateData.Probability_c = dealData.probability;
      if (dealData.expectedCloseDate !== undefined) updateData.ExpectedCloseDate_c = dealData.expectedCloseDate;

      const params = {
        records: [{
          Id: id,
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('deal_c', params);

      if (!response.success) {
        console.error('Failed to update deal:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('deal_c', params);

      if (!response.success) {
        console.error('Failed to delete deal:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const dealService = new DealService();