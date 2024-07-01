import * as mongoose from 'mongoose';

enum Status {
    OPEN = 'OPEN',
    AUTHORIZED = 'AUTHORIZED',
    REJECTED = "REJECTED",
    DONE = 'DONE',
}

export const OrderSchema = new mongoose.Schema({
    authorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    costCenter: { type: String, required: true },
    status: { type: String, enum: Status, required: true },
    createdAt: { type: Date, default: Date.now },
    authorizedAt: { type: Date },
    rejectedAt: { type: Date },
    completedAt: { type: Date },
    updatedAt: { type: Date },
});