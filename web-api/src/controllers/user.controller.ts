import { Request, Response } from 'express';
import userService from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';

class UserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const search = req.query.search as string | undefined;

      const result = await userService.getAllUsers(page, limit, search);
      
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: limit ? Math.ceil(result.total / limit) : 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;

      if (!userData.name || !userData.email || !userData.username) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, username'
        });
        return;
      }

      const newUser = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUserDto = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const updatedUser = await userService.updateUser(id, userData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new UserController();
