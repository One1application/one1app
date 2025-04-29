import { z } from "zod";

const aboutThisCourseSchema = z.object({
  description: z.string(),
  features: z.array(z.string())
});

const testimonialSchema = z.object({
  name: z.string().optional(),
  profilePic: z.string().url().optional(),
  description: z.string().optional(),
  rating: z.string().optional()
});

const courseBenefitSchema = z.object({
  emoji: z.string(),
  title: z.string()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const galleryImageSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional()
});

const productSchema = z.object({
  name: z.string(),
  price: z.string(),
  productLink: z.string().url()
});

const lessonSchema = z.object({
  lessonName: z.string(),
  videos: z.array(z.string().url())
});

export const courseSchema = z.object({
  title: z.string(),
  price: z.string().transform((val) => Number(val)).pipe(z.number().positive("Price cannot be less than zero.")),
  validity: z.string(),
  aboutThisCourse: aboutThisCourseSchema,
  testimonials: z.object({
    title: z.string(),
    isActive: z.boolean(),
    testimonialsMetaData: z.array(testimonialSchema).default([])
  }),
  courseBenefits: z.object({
    title: z.string(),
    benefitsActive: z.boolean(),
    benefitsMetaData: z.array(courseBenefitSchema)
  }).optional(),
  faQ: z.object({
    title: z.string(),
    isActive: z.boolean(),
    faQMetaData: z.array(faqSchema)
  }).optional(),
  gallery: z.object({
    title: z.string(),
    isActive: z.boolean(),
    imageMetaData: z.array(galleryImageSchema).default([])
  }),
  products: z.array(
    z.object({
      title: z.string(),
      isActive: z.boolean(),
      productMetaData: z.array(productSchema)
    })
  ).optional(),
  language: z.object({
    title: z.string(),
    isActive: z.boolean(),
    value: z.array(z.string())
  }).optional(),
  coverImage: z.object({
    value: z.string().url(),
    isActive: z.boolean()
  }),
  lessons: z.object({
    isActive: z.boolean(),
    lessonData: z.array(lessonSchema)
  }),
  discounts: z.array(z.any()).optional(),
  faqs: z.object({
    title: z.string(),
    isActive: z.boolean(),
    faQMetaData: z.array(faqSchema)
  }).optional()
});

