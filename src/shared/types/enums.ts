import { orderStatusSchema, recordStatusSchema } from '@/shared/services/api/schemas';

export const RecordStatus = recordStatusSchema.enum;
export const OrderStatus = orderStatusSchema.enum;

export type RecordStatus = (typeof RecordStatus)[keyof typeof RecordStatus];
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
