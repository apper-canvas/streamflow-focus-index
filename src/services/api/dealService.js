import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.deals];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = this.deals.find(d => d.Id === id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.deals.map(d => d.Id), 0);
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    };
    
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData
    };
    
    return { ...this.deals[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }
}

export const dealService = new DealService();