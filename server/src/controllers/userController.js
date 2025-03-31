import prisma from "../db/dbClient.js";


export const selfIdentification = async (req, res) => {
    try {

        const user = req.user;

        const userDetails = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            select: {
                email: true,
                phone: true,
                name: true,
                verified: true
            }
        })

        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: "USer not found."
            })
        }

        return res.status(200).json({
            success: true,
            userDetails
        });
        
    } catch (error) {
        console.error("Error in self identifying.", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error."
        })
        
    }
}

export const userCustomers = async (req, res) => {
    try {
        
        const user = req.user;
        const { param } = req.params;
        const page = param || 1;
        const pageSize = 20;

        const userDetails = await prisma.user.findFirst({
            where: { id: user.id },
            select: {
              createdWebinars: {
                include: {
                  tickets: {
                    select: { boughtBy: {
                        select: {
                            email: true,
                            phone: true,
                            name: true
                        }
                    } },
                  },
                },
                take: pageSize,
                skip: (page - 1) * pageSize,
              },
              createdTelegrams: {
                select: {
                  telegramSubscriptions: {
                    select: { boughtBy: {
                        select: {
                            email: true,
                            phone: true,
                            name: true
                        }
                    } },
                  },
                },
                take: pageSize,
                skip: (page - 1) * pageSize,
              },
              createdCourses: {
                select: {
                  purchasedBy: {
                    select: { purchaser: {
                        select: {
                            email: true,
                            phone: true,
                            name: true
                        }
                    } },
                  },
                },
                take: pageSize,
                skip: (page - 1) * pageSize,
              },
              createdPayingUps: {
                select: {
                  payingUpTickets: {
                    select: { boughtBy: {
                        select: {
                            email: true,
                            phone: true,
                            name: true
                        }
                    } },
                  },
                },
                take: pageSize,
                skip: (page - 1) * pageSize,
              },
            },
        });


        const customers = [];

        userDetails.createdPayingUps.forEach((val) => {
            val.payingUpTickets.forEach((ticket) => {
                customers.push({
                    ...ticket.boughtBy,
                    product: "Paying Up"
                })
            })
        })
        userDetails.createdWebinars.forEach((val) => {
            val.tickets.forEach((ticket) => {
                customers.push({
                    ...ticket.boughtBy,
                    product: "Webinar"
                })
            })
        })
        userDetails.createdCourses.forEach((val) => {
            val.purchasedBy.forEach((ticket) => {
                customers.push({
                    ...ticket.purchaser,
                    product: "Paying Up"
                })
            })
        })
        userDetails.createdTelegrams.forEach((val) => {
            val.boughtBy.forEach((ticket) => {
                customers.push({
                    ...ticket.boughtBy,
                    product: "Paying Up"
                })
            })
        })

        return res.status(200).json({
            success: true,
            customers
        })
          

    } catch (error) {
        console.error("Error in fetching user customers.", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error.'
        })
        
    }
}