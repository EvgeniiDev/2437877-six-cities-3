import {IUser} from '../infrastructure/DAL/user.model.js';
import {User} from '../domain/user/User.js';
import {UserType} from '../domain/user/UserType.js';
import mongoose from 'mongoose';

export class UserMapper {
  public static toDomain(userDbo: IUser): User {
    return new User(
      parseInt(userDbo._id.toString('hex').substring(18)),
      userDbo.name,
      userDbo.email,
      userDbo.passwordHash,
      userDbo.userType as UserType,
      userDbo.avatar
    );
  }

  public static toDbo(user: User): Partial<IUser> {
    return {
      ...(user.id && { _id: new mongoose.Types.ObjectId(user.id) }),
      name: user.name,
      email: user.email,
      passwordHash: user.password,
      userType: user.userType,
      avatar: user.avatar
    };
  }
}