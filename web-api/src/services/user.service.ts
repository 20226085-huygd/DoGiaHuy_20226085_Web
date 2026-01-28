import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';
import { initialUsers } from '../data/users.data';

class UserService {
  private users: User[] = [...initialUsers];
  private nextId: number = 11;

  async getAllUsers(page?: number, limit?: number, search?: string): Promise<{ users: User[], total: number, page: number, limit: number }> {
    let filteredUsers = [...this.users];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredUsers.length;
    
    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      filteredUsers = filteredUsers.slice(startIndex, endIndex);
    }

    return {
      users: filteredUsers,
      total,
      page: page || 1,
      limit: limit || total
    };
  }

  async getUserById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: this.nextId++,
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return null;
    }

    this.users[index] = {
      ...this.users[index],
      ...userData
    };

    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }
}

export default new UserService();
