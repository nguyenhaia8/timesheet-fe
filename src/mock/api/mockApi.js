// Base mock API utilities
class MockApiResponse {
  constructor(data, status = 200, message = 'Success') {
    this.data = data;
    this.status = status;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

class MockApiError {
  constructor(message, status = 400) {
    this.error = true;
    this.message = message;
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate network failures (5% chance)
const shouldFail = () => Math.random() < 0.05;

// Generic CRUD operations
export class MockApi {
  constructor(data, entityName = 'entity') {
    this.data = [...data]; // Create a copy to avoid mutating original
    this.entityName = entityName;
    this.nextId = Math.max(...data.map(item => item[`${entityName}Id`] || item.id || 0)) + 1;
  }

  // GET all entities
  async getAll(filters = {}) {
    await delay();
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to fetch ${this.entityName}s`, 500);
    }

    let filteredData = [...this.data];

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        filteredData = filteredData.filter(item => 
          item[key] === filters[key] || 
          (typeof item[key] === 'string' && item[key].toLowerCase().includes(filters[key].toLowerCase()))
        );
      }
    });

    return new MockApiResponse(filteredData);
  }

  // GET entity by ID
  async getById(id) {
    await delay(200);
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to fetch ${this.entityName}`, 500);
    }

    const idField = `${this.entityName}Id`;
    const entity = this.data.find(item => item[idField] === id || item.id === id);
    
    if (!entity) {
      throw new MockApiError(`${this.entityName} not found`, 404);
    }

    return new MockApiResponse(entity);
  }

  // POST create new entity
  async create(entityData) {
    await delay(800);
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to create ${this.entityName}`, 500);
    }

    const idField = `${this.entityName}Id`;
    const newEntity = {
      ...entityData,
      [idField]: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.push(newEntity);
    return new MockApiResponse(newEntity, 201, `${this.entityName} created successfully`);
  }

  // PUT update entity
  async update(id, entityData) {
    await delay(600);
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to update ${this.entityName}`, 500);
    }

    const idField = `${this.entityName}Id`;
    const index = this.data.findIndex(item => item[idField] === id || item.id === id);
    
    if (index === -1) {
      throw new MockApiError(`${this.entityName} not found`, 404);
    }

    const updatedEntity = {
      ...this.data[index],
      ...entityData,
      updatedAt: new Date().toISOString()
    };

    this.data[index] = updatedEntity;
    return new MockApiResponse(updatedEntity, 200, `${this.entityName} updated successfully`);
  }

  // DELETE entity
  async delete(id) {
    await delay(400);
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to delete ${this.entityName}`, 500);
    }

    const idField = `${this.entityName}Id`;
    const index = this.data.findIndex(item => item[idField] === id || item.id === id);
    
    if (index === -1) {
      throw new MockApiError(`${this.entityName} not found`, 404);
    }

    const deletedEntity = this.data[index];
    this.data.splice(index, 1);
    
    return new MockApiResponse(deletedEntity, 200, `${this.entityName} deleted successfully`);
  }

  // Bulk operations
  async bulkCreate(entitiesData) {
    await delay(1200);
    
    if (shouldFail()) {
      throw new MockApiError(`Failed to create ${this.entityName}s`, 500);
    }

    const createdEntities = entitiesData.map(entityData => {
      const idField = `${this.entityName}Id`;
      const newEntity = {
        ...entityData,
        [idField]: this.nextId++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.push(newEntity);
      return newEntity;
    });

    return new MockApiResponse(createdEntities, 201, `${entitiesData.length} ${this.entityName}s created successfully`);
  }

  // Search with pagination
  async search(query, page = 1, limit = 10) {
    await delay(300);
    
    if (shouldFail()) {
      throw new MockApiError(`Search failed`, 500);
    }

    let filteredData = this.data;
    
    if (query) {
      filteredData = this.data.filter(item => 
        Object.values(item).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return new MockApiResponse({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
        hasNext: endIndex < filteredData.length,
        hasPrev: page > 1
      }
    });
  }
}

export { MockApiResponse, MockApiError, delay };
