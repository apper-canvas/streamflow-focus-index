class TaskService {
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
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };

      const response = await this.apperClient.getRecordById('task_c', id, params);

      if (!response.success) {
        console.error('Failed to fetch task:', response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ],
        where: [{"FieldName": "ContactId_c", "Operator": "EqualTo", "Values": [contactId]}],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error('Failed to fetch tasks by contact:', response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          ContactId_c: taskData.contactId,
          Title_c: taskData.title,
          Description_c: taskData.description,
          Priority_c: taskData.priority,
          DueDate_c: taskData.dueDate,
          Completed_c: taskData.completed || false
        }]
      };

      const response = await this.apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to create task:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const updateData = {};
      if (taskData.title !== undefined) updateData.Title_c = taskData.title;
      if (taskData.description !== undefined) updateData.Description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.Priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.DueDate_c = taskData.dueDate;
      if (taskData.completed !== undefined) updateData.Completed_c = taskData.completed;
      if (taskData.contactId !== undefined) updateData.ContactId_c = taskData.contactId;

      const params = {
        records: [{
          Id: id,
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to update task:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();