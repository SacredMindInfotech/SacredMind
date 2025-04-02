import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const validateDiscountTokenController=async(req:Request,res:Response)=>{
  try {
    const {token}=req.params;
    const discountToken=await prisma.discountToken.findUnique({where:{token}});
    if(!discountToken){
      res.status(404).json({error:"Discount token not found"});
      return;
    }
    if(discountToken!.expiresAt<new Date()){
      res.status(400).json({error:"Discount token expired"});
      return;
    }
    res.status(200).json(discountToken);
  } catch (error) {
    console.error("Error validating discount token:", error);
    res.status(500).json({error:"Internal server error"});
    return;
  }
}
