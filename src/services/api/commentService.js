import commentsData from "@/services/mockData/comments.json";

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.comments];
  }

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.comments
      .filter(comment => comment.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const comment = this.comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  }

  async create(commentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = Math.max(...this.comments.map(c => c.Id), 0);
    const newComment = {
      Id: maxId + 1,
      ...commentData,
      timestamp: new Date().toISOString(),
      edited: false
    };
    
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, commentData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    this.comments[index] = {
      ...this.comments[index],
      ...commentData,
      edited: true
    };
    
    return { ...this.comments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    this.comments.splice(index, 1);
    return true;
  }

  async getCommentsCount(contactId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.comments.filter(comment => comment.contactId === contactId).length;
  }
}

export const commentService = new CommentService();