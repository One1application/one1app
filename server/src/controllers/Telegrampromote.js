import prisma from "../db/dbClient.js";
import { uploadOnImageKit } from "../config/imagekit.js";
 
export const createTelegrampromotionachannel = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { channelLink, subscribers, channelName } = req.body;

  if (!channelLink || !subscribers || !channelName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let channelProfileImage = null;


  const findIfexists = await prisma.telegramChannelForPublic.findUnique({
    where: {
      userId : req.user.id
    
  }
})

if(findIfexists){
    return res.status(400).json({success : false , message: 'You have already created a promotional channel' });
}

  try {
     
    if (req.file) {
      const imageResponse = await uploadOnImageKit(req.file.path, "user-profiles", false);
      channelProfileImage = imageResponse.url;
    }

    const promotionalChannel = await prisma.telegramChannelForPublic.create({
      data: {
        channelLink,
        subscribers: parseInt(subscribers),
        channelName,
        channelImage: channelProfileImage,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'created successfully',
      promotionalChannel,
    });

  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      message: 'Failed to create  channel',
      error: error.message,
    });
  }
};


export const deleteTelegrampromotionachannel = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    // Step 1: Check if the channel exists and belongs to the user
    const existingChannel = await prisma.telegramChannelForPublic.findUnique({
      where: { id },
    });

    if (!existingChannel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Optional: You can also verify that this channel belongs to the current user
    if (existingChannel.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this channel' });
    }

    // Step 2: Delete it
    const deletedPromotionalChannel = await prisma.telegramChannelForPublic.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Channel deleted successfully',
      deletedPromotionalChannel,
    });

  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({
      message: 'Failed to delete channel',
      error: error.message,
    });
  }
};



export const editTelegrampromotionachannel = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;
  const { channelLink, subscribers, channelName } = req.body;

   
  const existingChannel = await prisma.telegramChannelForPublic.findUnique({
    where: { id },
  });

  if (!existingChannel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  let channelImage = null;

  try {
    if(req.file){
        const imageResponse = await uploadOnImageKit(req.file.path, "user-profiles", false);
        channelImage = imageResponse.url;
    }
  } catch (error) {
     return res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }

 
  const updatedData = {
    channelLink: channelLink?.trim() ? channelLink : existingChannel.channelLink,
    channelName: channelName?.trim() ? channelName : existingChannel.channelName,
    channelImage : channelImage ? channelImage : existingChannel.channelImage,
    subscribers:
      subscribers !== undefined && subscribers !== ""
        ? parseInt(subscribers)
        : existingChannel.subscribers,
  };

  const editedPromotionalChannel = await prisma.telegramChannelForPublic.update({
    where: { id },
    data: updatedData,
  });

  return res
    .status(200)
    .json({ message: 'Updated successfully', editedPromotionalChannel });
};


export const getAllTelegrampromotionachannels = async (req, res) => {
  try {
    const promotionalChannels = await prisma.telegramChannelForPublic.findMany();

    if(promotionalChannels.length === 0){
      return res.status(404).json({ message: "No promotional channels found" });
    }


    return res.status(200).json({
        success : true,
       promotionalChannles : promotionalChannels,
    });
  } catch (error) {
    console.error("Error fetching promotional channels:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const getTelegrampromotionachannelbyid = async (req, res) => {

    try {
         if(!req.user){
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {id} = req.params;

  if(id){
    return res.status(400).json({messgae : "id is required !"})
  }

  const findIfexists = await prisma.telegramChannelForPublic.findUnique({
    where:{id}
  })


  if(!findIfexists){
    return res.status(404).json({
        success : false,
        message : "Promotional channel not found"
    })
  }

  return res.status(200).json({
    success : true,
    found : findIfexists
  })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
 

}


export const findavailablepromotionalchannel = async (req, res) => {
   
    if(!req.user){
    return res.status(401).json({ message: 'Unauthorized' });
  }


  const findIfexists = await prisma.telegramChannelForPublic.findUnique({
    where:{userId : req.user.id}
  })

  if(!findIfexists){
    return res.status(400).json({
        success : false,
        message : "You have not created a promotional channel"
    })
  }else{
    return res.status(200).json({
        success : true,
        found : findIfexists
    })
  }

}