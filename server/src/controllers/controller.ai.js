import main from "../config/config.ai.js";

export const generateDescription = async (req, res) => {
   try {
     if(!req.user){
       return res.status(401).json({
        success : false,
        message : "Please login first"
       })
     }

     const {prompt} = req.body;

     if(!prompt){
      return res.status(400).json({
        success : false,
        message : "Please enter a prompt"
      })
     }

    const response = await main(`${prompt} Write a simple, direct explanation at least 100-150 words  of this title. No introductions or prefaces.`);


     if(!response){
       return res.status(400).json({
        success : false,
        message : "Something went wrong"
       })
     }

     return res.status(200).json({
      success : true,
      description : response
     })
      
   } catch (error) {
      console.log(error || error?.message || "Somethin really went wrong malik ")
   }

}