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
  type: z.string().min(3, 'Subscription type must be at least 3 characters').max(50, 'Subscription type must not exceed 50 characters'),
  cost: z.number().min(1, 'Cost must be at least ₹1').max(100000, 'Cost cannot exceed ₹100,000'),
  days: z.number().int().min(1, 'Days must be at least 1').max(3650, 'Days cannot exceed 3650 (10 years)').optional(),
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
  code: z.string()
    .min(3, 'Discount code must be at least 3 characters')
    .max(20, 'Discount code must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Discount code can only contain letters, numbers, hyphens, and underscores'),
  percent: z.number().min(1, 'Discount percent must be between 1 and 100').max(100, 'Discount percent must be between 1 and 100'),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date > today;
    },
    { message: 'Expiry date must be a valid date and must be in the future' }
  ),
  plan: z.string().optional(),
});

export const createTelegramSchema = z.object({
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(75, 'Title must not exceed 75 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  chatId: z.string()
    .min(1, 'Chat ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Chat ID must be alphanumeric with hyphens or underscores'),
  genre: z.enum(['education', 'entertainment', 'marketing'], {
    errorMap: () => ({ message: 'Genre must be education, entertainment, or marketing' })
  }),
  discounts: z.array(discountSchema).optional(),
  subscriptions: z.array(subscriptionSchema).min(1, 'At least one subscription is required'),
  gstDetails: z.string().max(200, 'GST details must not exceed 200 characters').optional(),
  courseDetails: z.string().max(500, 'Course details must not exceed 500 characters').optional(),
  inviteLink: z.string().url('Invite link must be a valid URL').optional(),
  sessionString: z.string().optional(),
  channelName: z.string().optional(),
  channelLink: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validate subscription type uniqueness (case-insensitive)
  const subscriptionTypes = data.subscriptions.map((s) => s.type.toLowerCase().trim());
  const uniqueTypes = new Set(subscriptionTypes);
  if (uniqueTypes.size !== subscriptionTypes.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Subscription types must be unique (case-insensitive).',
      path: ['subscriptions'],
    });
  }

  // Validate discount codes uniqueness (case-insensitive)
  if (data.discounts && data.discounts.length > 1) {
    const discountCodes = data.discounts.map((d) => d.code.toLowerCase().trim());
    const uniqueCodes = new Set(discountCodes);
    if (uniqueCodes.size !== discountCodes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount codes must be unique (case-insensitive).',
        path: ['discounts'],
      });
    }
  }

  // Validate discount plan references
  if (data.discounts && data.discounts.length > 0) {
    for (let i = 0; i < data.discounts.length; i++) {
      const discount = data.discounts[i];
      if (discount.plan && !subscriptionTypes.includes(discount.plan.toLowerCase().trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Discount plan '${discount.plan}' must match an existing subscription type.`,
          path: [`discounts[${i}].plan`],
        });
      }
    }
  }

  // Validate GST details requirement
  if (data.gstDetails && data.gstDetails.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GST details cannot be empty if provided.',
      path: ['gstDetails'],
    });
  }

  // Validate course details requirement
  if (data.courseDetails && data.courseDetails.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Course details cannot be empty if provided.',
      path: ['courseDetails'],
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
  code: z.string()
    .min(3, 'Discount code must be at least 3 characters')
    .max(20, 'Discount code must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Discount code can only contain letters, numbers, hyphens, and underscores'),
  percent: z.number().min(1, 'Discount percent must be between 1 and 100').max(100, 'Discount percent must be between 1 and 100'),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date > today;
    },
    { message: 'Expiry date must be a valid date and must be in the future' }
  ),
  plan: z.string().optional(),
});

export const editDiscountSchema = z.object({
  code: z.string()
    .min(3, 'Discount code must be at least 3 characters')
    .max(20, 'Discount code must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Discount code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
  percent: z.number().min(1, 'Discount percent must be between 1 and 100').max(100, 'Discount percent must be between 1 and 100').optional(),
  expiry: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date > today;
    },
    { message: 'Expiry date must be a valid date and must be in the future' }
  ).optional(),
  plan: z.string().nullable().optional(),
});

export const createSubscriptionSchema = z.object({
  type: z.string().min(3, 'Subscription type must be at least 3 characters').max(50, 'Subscription type must not exceed 50 characters'),
  cost: z.number().min(1, 'Cost must be at least ₹1').max(100000, 'Cost cannot exceed ₹100,000'),
  days: z.number().int().min(1, 'Days must be at least 1').max(3650, 'Days cannot exceed 3650 (10 years)').optional(),
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
  type: z.string().min(3, 'Subscription type must be at least 3 characters').max(50, 'Subscription type must not exceed 50 characters').optional(),
  cost: z.number().min(1, 'Cost must be at least ₹1').max(100000, 'Cost cannot exceed ₹100,000').optional(),
  days: z.number().int().min(1, 'Days must be at least 1').max(3650, 'Days cannot exceed 3650 (10 years)').optional().nullable(),
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
  couponCode: z.string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Coupon code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
});

export const purchaseSubscriptionSchema = z.object({
  telegramId: uuidSchema,
  subscriptionId: uuidSchema,
  couponCode: z.string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Coupon code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
  validateOnly: z.boolean().optional().default(false),
});

