import { userRepository } from "@/repositories/user.repository";
import { NotFoundError } from "@/utils/errors.util";
import { UpdateUserData } from "@/repositories/user.repository";

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  },

  async updateProfile(userId: string, data: UpdateUserData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return userRepository.update(userId, data);
  },

  async getAddress(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user.address;
  },
};

