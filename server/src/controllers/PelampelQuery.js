import prisma from "../db/dbClient.js";
import { uploadOnImageKit } from "../config/imagekit.js";
 

export const raiseQuery = async(req,res) =>{
    try {

        if(!req.user){
            return res.status(401).json({message:"Please login first"})
        }


       

       let existingUser = await prisma.user.findUnique({
        where : {
            id : req?.user?.id
        },

        select : {
            phone : true
        }
       })

       if(!existingUser){
         return res.status(404).json({
            message : "Not verified"
         })
       }
 
        const {phone , query } = req.body;

        if(!query){
            return res.status(400).json({message:"Please fill all the fields"})
        }
 

      


        const imagesUrls = []

        try {
             if(req.files && req.files.length > 0 ){
           for(const file of req.files){
            const uploadedFile = await uploadOnImageKit(file.path , "raiseQueriesss" , false)
             imagesUrls.push(uploadedFile.url)
             console.log(imagesUrls);
           }
        }
        } catch (error) {
            console.log("imagekit error" , error.message)
            return res.status(400).json({
                message : "Something went wrong!"
            })
        }

       

         const newQuery = await prisma.raiseQuery.create({
      data: {
        phone : phone || existingUser.phone,
        query,
        images: imagesUrls,
        userId : req.user.id,
      },
    });

  
        
        res.status(201).json({
      message: "Query raised successfully",
      data: newQuery,
    });

       
    } catch (error) {
        
          console.error("Error in raise-query:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

export const toggleQueryStatus = async (req, res) => {
    try {
       
       

        //Must be admin
        if (req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can resolve queries" });
        }

        const { queryId } = req.params;
        if (!queryId) {
            return res.status(400).json({ message: "Query ID is required" });
        }

        // Find query that is still pending
        const existingQuery = await prisma.raiseQuery.findFirst({
            where: { id: queryId}
        });

        if (!existingQuery) {
            return res.status(404).json({ message: "No pending query found with this ID" });
        }

        // Update status to resolved
        let updated = await prisma.raiseQuery.update({
            where: { id: queryId },
            data: { status: existingQuery.status === "Pending" ? "Resolved" : "Pending" } 
            // created toggle suppose by mistake admin clicked on the button 
        });

        return res.status(200).json({ message: `Query marked as ${updated.status}` ,
        data : updated});

    } catch (error) {
        console.error("Error resolving query:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllQueries = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const { status } = req.query;  

       
        let whereCondition = {};

        if (req.user.role !== "Admin") {
            whereCondition.userId = req.user.id;
        }

        

        if (status) {
             
            const validStatuses = ["Pending", "Resolved"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            whereCondition.status = status;
        }


         

        const queries = await prisma.raiseQuery.findMany({
            where: whereCondition,
          
            include : {
                user : {
                    select : {
                        name : true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return res.status(200).json({
            message: "Queries fetched successfully",
            count: queries.length,
            data: queries
        });

    } catch (error) {
        console.error("Error fetching queries:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// todo set to admin panel for bulk update

export const bulkResolvedorPending = async (req,res) =>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                message : "Only admin can perform this action"
            })
        }


        console.log(req.user)
        const {Ids} = req.body;

        console.log(Ids)

        if(!Ids.length || !Array.isArray(Ids)){
            return res.status(400).json({
                message : "Ids are required"
            })
        }

        const queries = await prisma.raiseQuery.findMany({
            where : {
                id : {
                    in : Ids
                }
            }
        })

        if(!queries.length){
            return res.status(404).json({
                message : "No queries found"
            })
        }

        const updated = await prisma.raiseQuery.updateMany({
            where : {
                id : {
                    in : Ids
                }
            },
            data : {
                status : queries[0].status === "Pending" ? "Resolved" : "Pending"
            }
        })

        return res.status(200).json({
            message : "Queries updated successfully",
            data : updated
        })
    } catch (error) {
        console.log("error in bulk resolved or pending" , error.message)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}


// todo -- websockets for real time notification to the admin panel
// todo -- cron job for auto delete after 48 hrs if resolved 