import { z } from 'zod';

const predefinedTypes = [
  'Weekly',
  'Monthly',
  'Bimonthly',
  'Quarterly',
  'Quadrimester',
  'Half Yearly',
  'Yearly',
];

const subscriptionDays = {
  Weekly: 7,
  Monthly: 30,
  Bimonthly: 60,
  Quarterly: 90,
  Quadrimester: 120,
  'Half Yearly': 180,
  Yearly: 365,
};

export const subscriptionSchema = z.object({
  type: z.string().min(1, 'Subscription type is required'),
  cost: z.number().positive('Cost must be a positive number'),
  days: z.number().int().positive('Days must be a positive integer').optional(),
  isLifetime: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (predefinedTypes.includes(data.type)) {
    if (data.isLifetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Lifetime subscriptions are not allowed for predefined type '${data.type}'.`,
        path: ['isLifetime'],
      });
    }
    if (data.days !== subscriptionDays[data.type]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Days for '${data.type}' must be ${subscriptionDays[data.type]}.`,
        path: ['days'],
      });
    }
  } else if (data.isLifetime) {
    if (data.days !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Days must be null for lifetime subscriptions.',
        path: ['days'],
      });
    }
  } else if (!data.days || !Number.isInteger(data.days) || data.days <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Days must be a positive integer for non-lifetime subscriptions.',
      path: ['days'],
    });
  }
});

export const discountSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+$/, 'Discount code must contain only uppercase letters and numbers'),
  percent: z.number().min(0, 'Discount percent must be between 0 and 99').max(99, 'Discount percent must be between 0 and 99'),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today;
    },
    { message: 'Expiry date must be a valid date and not in the past' }
  ),
  plan: z.string().optional(),
});

export const createTelegramSchema = z.object({
  coverImage: z.string().url().optional(),
  title: z.string().min(1, 'Title is required').max(75, 'Title must be 75 characters or less'),
  description: z.string().min(1, 'Description is required'),
  chatId: z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Chat ID must be alphanumeric with hyphens or underscores'),
  genre: z.string().min(1, 'Genre is required'),
  discounts: z.array(discountSchema).optional(),
  subscriptions: z.array(subscriptionSchema).min(1, 'At least one subscription is required'),
  gstDetails: z.string().optional(),
  courseDetails: z.string().optional(),
  inviteLink: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (data.discounts && data.discounts.length > 0) {
    const subscriptionTypes = data.subscriptions.map((s) => s.type.toLowerCase());
    for (let i = 0; i < data.discounts.length; i++) {
      const discount = data.discounts[i];
      if (discount.plan && !subscriptionTypes.includes(discount.plan.toLowerCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Discount plan '${discount.plan}' must match an existing subscription type.`,
          path: [`discounts[${i}].plan`],
        });
      }
    }
  }
  const subscriptionTypes = data.subscriptions.map((s) => s.type);
  const uniqueTypes = new Set(subscriptionTypes);
  if (uniqueTypes.size !== subscriptionTypes.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Subscription types must be unique.',
      path: ['subscriptions'],
    });
  }
});

export const editTelegramSchema = z.object({
  coverImage: z.string().url().optional(),
  title: z.string().min(1, 'Title is required').max(75, 'Title must be 75 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  genre: z.string().min(1, 'Genre is required').optional(),
  gstDetails: z.string().nullable().optional(),
  courseDetails: z.string().nullable().optional(),
  inviteLink: z.string().url().nullable().optional(),
});



export const createDiscountSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+$/, 'Discount code must contain only uppercase letters and numbers'),
  percent: z.number().min(0, 'Discount percent must be between 0 and 99').max(99, 'Discount percent must be between 0 and 99'),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today;
    },
    { message: 'Expiry date must be a valid date and not in the past' }
  ),
  plan: z.string().optional(),
});

export const editDiscountSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]+$/, 'Discount code must contain only uppercase letters and numbers').optional(),
  percent: z.number().min(0, 'Discount percent must be between 0 and 99').max(99, 'Discount percent must be between 0 and 99').optional(),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today;
    },
    { message: 'Expiry date must be a valid date and not in the past' }
  ).optional(),
  plan: z.string().nullable().optional(),
});

export const createSubscriptionSchema = z.object({
  type: z.string().min(1, 'Subscription type is required'),
  cost: z.number().positive('Cost must be a positive number'),
  days: z.number().int().positive('Days must be a positive integer').optional(),
  isLifetime: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (predefinedTypes.includes(data.type)) {
    if (data.isLifetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Lifetime subscriptions are not allowed for predefined type '${data.type}'.`,
        path: ['isLifetime'],
      });
    }
    if (data.days !== subscriptionDays[data.type]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Days for '${data.type}' must be ${subscriptionDays[data.type]}.`,
        path: ['days'],
      });
    }
  } else if (data.isLifetime) {
    if (data.days !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Days must be null for lifetime subscriptions.',
        path: ['days'],
      });
    }
  } else if (!data.days || !Number.isInteger(data.days) || data.days <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Days must be a positive integer for non-lifetime subscriptions.',
      path: ['days'],
    });
  }
});

export const editSubscriptionSchema = z.object({
  type: z.string().min(1, 'Subscription type is required').optional(),
  cost: z.number().positive('Cost must be a positive number').optional(),
  days: z.number().int().positive('Days must be a positive integer').optional().nullable(),
  isLifetime: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.type && predefinedTypes.includes(data.type)) {
    if (data.isLifetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Lifetime subscriptions are not allowed for predefined type '${data.type}'.`,
        path: ['isLifetime'],
      });
    }
    if (data.days !== undefined && data.days !== subscriptionDays[data.type]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Days for '${data.type}' must be ${subscriptionDays[data.type]}.`,
        path: ['days'],
      });
    }
  } else if (data.isLifetime) {
    if (data.days !== undefined && data.days !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Days must be null for lifetime subscriptions.',
        path: ['days'],
      });
    }
  } else if (data.days !== undefined && (!Number.isInteger(data.days) || data.days <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Days must be a positive integer for non-lifetime subscriptions.',
      path: ['days'],
    });
  }
});

export const getTelegramByIdSchema = z.object({
  telegramId: z.string().uuid('Invalid UUID format'),
});

const uuidSchema = z.string().uuid('Invalid UUID format');

export const applyCouponSchema = z.object({
  telegramId: uuidSchema,
  subscriptionId: uuidSchema,
  couponCode: z.string().regex(/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers').optional(),
});

export const purchaseSubscriptionSchema = z.object({
  telegramId: uuidSchema,
  subscriptionId: uuidSchema,
  couponCode: z.string().regex(/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers').optional(),
  validateOnly: z.boolean().optional().default(false),
});

