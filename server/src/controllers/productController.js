import prisma from "../db/dbClient.js";

export async function getProductSalesRevenue(req, res) {
  try {
    const user = req.user;
    const { page = 1, limit = 10, productType, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Validate user exists
    const userExists = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User not found."
      });
    }

    // Build query conditions for transactions
    const whereConditions = {
      creatorId: user.id,
      status: "COMPLETED"
    };

    if (productType) {
      whereConditions.productType = productType;
    }

    // Get all transactions for this creator
    const transactions = await prisma.transaction.findMany({
      where: whereConditions,
      select: {
        productId: true,
        productType: true,
        amount: true,
        amountAfterFee: true,
        createdAt: true
      }
    });

    // Group transactions by product and calculate metrics
    const productMetrics = {};
    
    transactions.forEach(transaction => {
      const key = `${transaction.productType}_${transaction.productId}`;
      
      if (!productMetrics[key]) {
        productMetrics[key] = {
          productId: transaction.productId,
          productType: transaction.productType,
          totalRevenue: 0,
          totalAmountAfterFee: 0,
          salesCount: 0
        };
      }
      
      productMetrics[key].totalRevenue += Number(transaction.amount || 0);
      productMetrics[key].totalAmountAfterFee += Number(transaction.amountAfterFee || 0);
      productMetrics[key].salesCount += 1;
    });

    // Group product IDs by type
    const productIds = {
      COURSE: [],
      WEBINAR: [],
      PAYINGUP: [],
      TELEGRAM: [],
      PREMIUMCONTENT: []
    };

    Object.values(productMetrics).forEach(metric => {
      if (productIds[metric.productType]) {
        productIds[metric.productType].push(metric.productId);
      }
    });

    // Fetch product details for each type
    const [courses, webinars, payingUps, telegrams, premiumContents] = await Promise.all([
      productIds.COURSE.length > 0 ? prisma.course.findMany({
        where: { id: { in: productIds.COURSE } },
        select: {
          id: true,
          title: true,
          price: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      }) : [],
      productIds.WEBINAR.length > 0 ? prisma.webinar.findMany({
        where: { id: { in: productIds.WEBINAR } },
        select: {
          id: true,
          title: true,
          amount: true,
          paymentEnabled: true,
          createdAt: true,
          updatedAt: true
        }
      }) : [],
      productIds.PAYINGUP.length > 0 ? prisma.payingUp.findMany({
        where: { id: { in: productIds.PAYINGUP } },
        select: {
          id: true,
          title: true,
          paymentDetails: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      }) : [],
      productIds.TELEGRAM.length > 0 ? prisma.telegram.findMany({
        where: { id: { in: productIds.TELEGRAM } },
        select: {
          id: true,
          title: true,
          subscription: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      }) : [],
      productIds.PREMIUMCONTENT.length > 0 ? prisma.premiumContent.findMany({
        where: { id: { in: productIds.PREMIUMCONTENT } },
        select: {
          id: true,
          title: true,
          unlockPrice: true,
          isVerified: true,
          createdAt: true,
          // updatedAt: true
        }
      }) : []
    ]);

    // Create lookup maps for each product type
    const productDetailsMap = {
      COURSE: courses.reduce((map, item) => { map[item.id] = item; return map; }, {}),
      WEBINAR: webinars.reduce((map, item) => { map[item.id] = item; return map; }, {}),
      PAYINGUP: payingUps.reduce((map, item) => { map[item.id] = item; return map; }, {}),
      TELEGRAM: telegrams.reduce((map, item) => { map[item.id] = item; return map; }, {}),
      PREMIUMCONTENT: premiumContents.reduce((map, item) => { map[item.id] = item; return map; }, {})
    };

    // Combine metrics with product details
    const results = Object.values(productMetrics).map(metric => {
      const productDetail = productDetailsMap[metric.productType][metric.productId];
      
      if (!productDetail) {
        return {
          productId: metric.productId,
          productType: metric.productType,
          title: 'Unknown Product',
          price: 0,
          revenue: metric.totalRevenue,
          amountAfterFee: metric.totalAmountAfterFee,
          salesCount: metric.salesCount,
          payment: "Disabled",
          createdAt: null,
          updatedAt: null
        };
      }

      // Extract price and payment status based on product type
      let price = 0;
      let payment = "Disabled";
      
      switch(metric.productType) {
        case 'COURSE':
          price = productDetail.price;
          payment = productDetail.isVerified ? "Enabled" : "Disabled";
          break;
        case 'WEBINAR':
          price = productDetail.amount;
          payment = productDetail.paymentEnabled ? "Enabled" : "Disabled";
          break;
        case 'PAYINGUP':
          price = productDetail.paymentDetails?.totalAmount;
          payment = productDetail.isVerified ? "Enabled" : "Disabled";
          break;
        case 'TELEGRAM':
          price = Array.isArray(productDetail.subscription) ? 
                  productDetail.subscription[0]?.cost : 0;
          payment = productDetail.isVerified ? "Enabled" : "Disabled";
          break;
        case 'PREMIUMCONTENT':
          price = productDetail.unlockPrice;
          payment = productDetail.isVerified ? "Enabled" : "Disabled";
          break;
      }

      return {
        productId: metric.productId,
        productType: metric.productType,
        title: productDetail.title,
        price: price || 0,
        revenue: metric.totalRevenue,
        amountAfterFee: metric.totalAmountAfterFee,
        salesCount: metric.salesCount,
        payment: payment,
        createdAt: productDetail.createdAt,
        updatedAt: productDetail.updatedAt
      };
    });

    // Sort results
    const validSortFields = ['createdAt', 'updatedAt', 'price', 'revenue', 'salesCount'];
    const actualSortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    results.sort((a, b) => {
      const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
      
      if (actualSortField === 'createdAt' || actualSortField === 'updatedAt') {
        return order * (new Date(b[actualSortField]) - new Date(a[actualSortField]));
      }
      
      return order * (b[actualSortField] - a[actualSortField]);
    });

    // Paginate results
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const startIdx = (pageNum - 1) * pageSize;
    const endIdx = pageNum * pageSize;
    const paginatedResults = results.slice(startIdx, endIdx);
    
    return res.status(200).json({
      success: true,
      message: "Product sales and revenue fetched successfully",
      payload: {
        products: paginatedResults,
        pagination: {
          page: pageNum,
          limit: pageSize,
          totalItems: results.length,
          totalPages: Math.ceil(results.length / pageSize)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching product sales and revenue:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}