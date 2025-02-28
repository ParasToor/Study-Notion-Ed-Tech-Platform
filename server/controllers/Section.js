const Section = require("../models/Section");

//  Create Section
const createSection = async (req, res) => {
  try {
    const { sectionName } = req.body;

    const newSwction = await Section.create({ sectionName });

    return res.status(200).json({
      success: "true",
      data: newSection,
    });

  } catch (err) {
    return res.status(500).json({
        success : false,
        message: "Error inside create Section handler",
        error : err.message
    })
  }
};

//  Update Section
const updateSection = (req,res)=>{
    try{
        
        // const {}
    }
    catch(err){
        a
    }
}

//  Delete Section
const deleteSection = (req,res)=>{
    try{
        a
    }
    catch(){
        a
    }
}
