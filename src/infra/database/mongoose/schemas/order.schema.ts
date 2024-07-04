import * as mongoose from 'mongoose';

enum Status {
    OPEN = 'OPEN',
    AUTHORIZED = 'AUTHORIZED',
    REJECTED = "REJECTED",
    DONE = 'DONE',
}

export const OrderSchema = new mongoose.Schema({
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeSchema', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    cost_center: { type: String, required: true },
    status: { type: String, enum: Status, required: true },
    created_at: { type: Date, default: Date.now },
    authorized_at: { type: Date },
    rejected_at: { type: Date },
    completed_at: { type: Date },
    updated_at: { type: Date },
});