import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.activities];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activity = this.activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData
    };
    
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

export const activityService = new ActivityService();