import * as mongoose from 'mongoose';

enum Role {
    REQUESTER = 'REQUESTER',
    AUTHORIZER = 'AUTHORIZER',
    PURCHASER = 'PURCHASER',
}

export const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: Role, required: true },
  is_active: { type: Boolean, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now() }
});