import prisma from "../db/dbClient.js";

export const createUser = async (req, res) => {
    try {
        const { email, phoneNumber, name, goals, heardAboutUs, socialMedia, role } = req.body;

    
        let goalsData = goals.split(",");

        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        console.log(existingUserByEmail);
        

        if (existingUserByEmail) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }
        const existingUserByPhone = await prisma.user.findFirst({
            where: {
                phone: phoneNumber
            }
        })

        if (existingUserByPhone) {
            return res.status(400).json({ message: "A user with this phone number already exists." });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                phone: phoneNumber,
                name,
                role: role,
                verified: false,
                goals:goalsData,
                heardAboutUs,
                socialMedia,
                wallet: {
                    create: {}
                }
            }
        })

        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            prisma.transaction.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    amount: true,
                    modeOfPayment: true,
                    product: true,
                    wallet: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    phone: true,
                                    email: true
                                }
                            }
                        }
                    },
                    status: true
                }
            }),
            prisma.transaction.count()
        ]);

        const formattedPayments = await Promise.all(
            payments.map(async (payment) => {
                let creatorId = null;
                let productId = null;

                if (payment.wallet?.user?.id) {
                    const userId = payment.wallet.user.id;

                    const webinarTickets = await prisma.webinarTicket.findMany({
                        where: {
                            boughtById: userId,
                            paymentId: payment.id
                        },
                        select: {
                            webinar: {
                                select: {
                                    id: true,
                                    createdById: true
                                }
                            }
                        }
                    });

                    const coursePurchases = await prisma.coursePurchasers.findMany({
                        where: {
                            purchaserId: userId,
                            paymentId: payment.id
                        },
                        select: {
                            course: {
                                select: {
                                    id: true,
                                    createdBy: true
                                }
                            }
                        }
                    });

                    if (webinarTickets.length > 0) {
                        creatorId = webinarTickets[0].webinar.createdById;
                        productId = webinarTickets[0].webinar.id;
                    } else if (coursePurchases.length > 0) {
                        creatorId = coursePurchases[0].course.createdBy;
                        productId = coursePurchases[0].course.id;
                    }
                }

                return {
                    AmountPaid: payment.amount,
                    PaymentMethod: payment.modeOfPayment,
                    CreatorsID: creatorId,
                    ProductID: productId,
                    ProductType: payment.product,
                    UserNumber: payment.wallet?.user?.phone,
                    UserEmailID: payment.wallet?.user?.email,
                    Status: payment.status
                };
            })
        );

        return res.status(200).json({
            data: formattedPayments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return res.status(500).json({ message: 'Failed to fetch payments' });
    }
};

export const createAdmin = async (req, res) => {
     try {
       const {
         email,
         phoneNumber,
         name
       } = req.body;

       const existingUserByEmail = await prisma.user.findFirst({
         where: {
           email: email,
         },
       });
       console.log(existingUserByEmail);

       if (existingUserByEmail) {
         return res
           .status(400)
           .json({ message: "A user with this email already exists." });
       }
       const existingUserByPhone = await prisma.user.findFirst({
         where: {
           phone: phoneNumber,
         },
       });

       if (existingUserByPhone) {
         return res
           .status(400)
           .json({ message: "A user with this phone number already exists." });
       }

       const newUser = await prisma.user.create({
         data: {
           email,
           phone: phoneNumber,
           name,
           role: "Admin",
           verified: false,
           goals: [],
           heardAboutUs:"",
           socialMedia:"",
           wallet: {
             create: {},
           },
         },
       });

       return res
         .status(201)
         .json({ message: "User created successfully", newUser });
     } catch (error) {
       console.error("Error creating user:", error);
       return res.status(500).json({ message: "Internal server error" });
     }
};

export const getAdmins = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [admins, total] = await Promise.all([
            prisma.user.findMany({
                where: { role: "Admin" },
                skip,
                take: limit
            }),
            prisma.user.count({ where: { role: "Admin" } })
        ]);

        return res.status(200).json({
            data: admins,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error getting admins:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        
        const { id } = req.params;
        const {
          email,
          phoneNumber,
          name
        } = req.body;

     

        const updatedAdmin = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            email,
            phone: phoneNumber,
            name,
          },
        });
        return res.status(200).json({ message: "Admin updated successfully", updatedAdmin });
    } catch (error) {
        console.error("Error updating admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.admin.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phoneNumber, name, goals, heardAboutUs, socialMedia, role } = req.body;

        let goalsData = goals.split(",");

        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email,
                phone: phoneNumber,
                name,
                role: role,
                goals:goalsData,
                heardAboutUs,
                socialMedia
            }
        });

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    socialMedia: true,
                    goals: true,
                    role: true,
                    wallet: {
                        select: {
                            totalEarnings: true
                        }
                    }
                }
            }),
            prisma.user.count()
        ]);

        return res.status(200).json({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error getting users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [courses, coursesCount] = await Promise.all([
            prisma.course.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    creator: {
                        select: {
                            id: true,
                            phone: true,
                            email: true
                        }
                    },
                    products: {
                        select: {
                            productMetaData: true
                        }
                    }
                }
            }),
            prisma.course.count()
        ]);

        const [webinars, webinarsCount] = await Promise.all([
            prisma.webinar.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    link: true,
                    createdBy: {
                        select: {
                            id: true,
                            phone: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.webinar.count()
        ]);

        const [telegrams, telegramsCount] = await Promise.all([
            prisma.telegram.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    channelName: true,
                    createdBy: {
                        select: {
                            id: true,
                            phone: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.telegram.count()
        ]);

        const products = [
            ...courses.map(course => ({
                CreatorID: course.creator.id,
                CreatorNumber: course.creator.phone,
                CreatorMail: course.creator.email,
                ProductID: course.id,
                TelegramIntegration: course.products[0]?.productMetaData?.telegram || false,
                WhatsappIntegration: course.products[0]?.productMetaData?.whatsapp || false,
                DiscordIntegration: course.products[0]?.productMetaData?.discord || false,
                PaymentPage: true,
                Course: course.title,
                Event: null,
                CommunityName: course.products[0]?.productMetaData?.communityName || null,
                FreeGroupName: course.products[0]?.productMetaData?.freeGroup || null,
                PaidGroupName: course.products[0]?.productMetaData?.paidGroup || null,
                ProductVerification: course.products[0]?.productMetaData?.verified || false
            })),
            ...webinars.map(webinar => ({
                CreatorID: webinar.createdBy.id,
                CreatorNumber: webinar.createdBy.phone,
                CreatorMail: webinar.createdBy.email,
                ProductID: webinar.id,
                TelegramIntegration: webinar.link?.telegram || false,
                WhatsappIntegration: webinar.link?.whatsapp || false,
                DiscordIntegration: webinar.link?.discord || false,
                PaymentPage: true,
                Course: null,
                Event: webinar.title,
                CommunityName: null,
                FreeGroupName: null,
                PaidGroupName: null,
                ProductVerification: true
            })),
            ...telegrams.map(telegram => ({
                CreatorID: telegram.createdBy.id,
                CreatorNumber: telegram.createdBy.phone,
                CreatorMail: telegram.createdBy.email,
                ProductID: telegram.id,
                TelegramIntegration: true,
                WhatsappIntegration: false,
                DiscordIntegration: false,
                PaymentPage: true,
                Course: null,
                Event: null,
                CommunityName: telegram.channelName,
                FreeGroupName: null,
                PaidGroupName: telegram.channelName,
                ProductVerification: true
            }))
        ];

        const total = coursesCount + webinarsCount + telegramsCount;

        return res.status(200).json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Failed to fetch products' });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        // Get revenue statistics from transactions
        const [todayTransactions, thisMonthTransactions, lastMonthTransactions] = await Promise.all([
            prisma.transaction.aggregate({
                where: {
                    createdAt: { gte: startOfToday },
                    status: "success"
                },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    createdAt: { gte: startOfThisMonth },
                    status: "success"
                },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: startOfThisMonth
                    },
                    status: "success"
                },
                _sum: { amount: true }
            })
        ]);

        // Get creator statistics using wallet creation date instead
        const [totalCreators, activeCreators, inactiveCreators] = await Promise.all([
            prisma.user.count({
                where: { role: "Creator" }
            }),
            prisma.user.count({
                where: {
                    role: "Creator",
                    verified: true
                }
            }),
            prisma.user.count({
                where: {
                    role: "Creator",
                    verified: false
                }
            })
        ]);

        // Get new creators based on their wallet creation date
        const [newCreatorsThisMonth, lastMonthCreators] = await Promise.all([
            prisma.wallet.count({
                where: {
                    createdAt: { gte: startOfThisMonth },
                    user: {
                        role: "Creator"
                    }
                }
            }),
            prisma.wallet.count({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: startOfThisMonth
                    },
                    user: {
                        role: "Creator"
                    }
                }
            })
        ]);

        // Get top creators with their total earnings from wallet
        const topCreators = await prisma.user.findMany({
            where: { 
                role: "Creator",
                wallet: {
                    isNot: null
                }
            },
            select: {
                name: true,
                wallet: {
                    select: {
                        totalEarnings: true
                    }
                }
            },
            orderBy: {
                wallet: {
                    totalEarnings: 'desc'
                }
            },
            take: 5
        });

        // Get monthly revenue data for chart
        const monthlyRevenue = await prisma.$queryRaw`
            SELECT 
                EXTRACT(MONTH FROM "createdAt") as month,
                SUM(amount) as revenue
            FROM "Transaction"
            WHERE 
                status = 'success' AND
                "createdAt" >= date_trunc('year', CURRENT_DATE)
            GROUP BY EXTRACT(MONTH FROM "createdAt")
            ORDER BY month
        `;

        // Calculate percentage changes
        const revenueChange = ((thisMonthTransactions._sum.amount || 0) - (lastMonthTransactions._sum.amount || 0)) / 
            (lastMonthTransactions._sum.amount || 1) * 100;
        const creatorsChange = ((newCreatorsThisMonth || 0) - (lastMonthCreators || 0)) / 
            (lastMonthCreators || 1) * 100;

        return res.status(200).json({
            revenue: {
                today: todayTransactions._sum.amount || 0,
                total: thisMonthTransactions._sum.amount || 0,
                percentageChange: revenueChange,
                chartData: monthlyRevenue
            },
            creators: {
                total: totalCreators,
                active: activeCreators,
                inactive: inactiveCreators,
                new: newCreatorsThisMonth,
                percentageChange: creatorsChange,
                leaderboard: topCreators.map(creator => ({
                    name: creator.name,
                    earnings: creator.wallet?.totalEarnings || 0
                }))
            },
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

export const getUserReport = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get statistics
        const [
            totalUsers,
            verifiedUsers,
            activeVerifiedUsers,
            inactiveVerifiedUsers,
            pendingUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    verified: true
                }
            }),
            prisma.user.count({
                where: {
                    verified: true,
                    wallet: {
                        transactions: {
                            some: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                }
                            }
                        }
                    }
                }
            }),
            prisma.user.count({
                where: {
                    verified: true,
                    wallet: {
                        transactions: {
                            none: {
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                }
                            }
                        }
                    }
                }
            }),
            prisma.user.count({
                where: {
                    verified: false
                }
            })
        ]);

        // Get paginated user details
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    verified: true,
                    wallet: {
                        select: {
                            transactions: {
                                select: {
                                    createdAt: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 1
                            }
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            }),
            prisma.user.count()
        ]);

        // Format user data with activity status
        const formattedUsers = users.map(user => ({
            initial: user.name.charAt(0).toUpperCase(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            verificationStatus: user.verified ? 'Verified' : 'Pending',
            activityStatus: user.wallet?.transactions[0]?.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                ? 'Active' 
                : 'Inactive'
        }));

        return res.status(200).json({
            statistics: {
                totalUsers,
                verifiedUsers,
                pendingVerification: pendingUsers,
                activeUsers: activeVerifiedUsers,
                inactiveUsers: inactiveVerifiedUsers
            },
            users: {
                data: formattedUsers,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user report:', error);
        return res.status(500).json({ message: 'Failed to fetch user report' });
    }
};
