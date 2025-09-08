class CommentService {
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
          {"field": {"Name": "Author_c"}},
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "Edited_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "Timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('comment_c', params);

      if (!response.success) {
        console.error('Failed to fetch comments:', response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Author_c"}},
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "Edited_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        where: [{"FieldName": "ContactId_c", "Operator": "EqualTo", "Values": [contactId]}],
        orderBy: [{"fieldName": "Timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('comment_c', params);

      if (!response.success) {
        console.error('Failed to fetch comments by contact:', response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Author_c"}},
          {"field": {"Name": "Content_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "Edited_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await this.apperClient.getRecordById('comment_c', id, params);

      if (!response.success) {
        console.error('Failed to fetch comment:', response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(commentData) {
    try {
      const params = {
        records: [{
          ContactId_c: commentData.contactId,
          Author_c: commentData.author,
          Content_c: commentData.content,
          Timestamp_c: new Date().toISOString(),
          Edited_c: false
        }]
      };

      const response = await this.apperClient.createRecord('comment_c', params);

      if (!response.success) {
        console.error('Failed to create comment:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, commentData) {
    try {
      const updateData = {};
      if (commentData.content !== undefined) updateData.Content_c = commentData.content;
      if (commentData.author !== undefined) updateData.Author_c = commentData.author;
      updateData.Edited_c = true;

      const params = {
        records: [{
          Id: id,
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('comment_c', params);

      if (!response.success) {
        console.error('Failed to update comment:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('comment_c', params);

      if (!response.success) {
        console.error('Failed to delete comment:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} comments:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getCommentsCount(contactId) {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "ContactId_c", "Operator": "EqualTo", "Values": [contactId]}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('comment_c', params);

      if (!response.success) {
        console.error('Failed to get comments count:', response.message);
        return 0;
      }

      return response.data?.length || 0;
    } catch (error) {
      console.error("Error getting comments count:", error?.response?.data?.message || error);
      return 0;
    }
  }
}

export const commentService = new CommentService();