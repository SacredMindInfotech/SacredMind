import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const createDiscountTokenController=async(req:Request,res:Response)=>{
  try {
    const {token,discountPercentage,courseIds,expiresAt}=req.body;
    const discountToken=await prisma.discountToken.create({
      data:{
        token,
        discountPercentage:Number(discountPercentage),
        courseIds,
        expiresAt:new Date(expiresAt),
      }
    })
    res.status(200).json(discountToken);
    return;
  } catch (error) {
    console.error("Error creating discount token:", error);
    res.status(500).json({error:"Internal server error"});
    return;
  }
}

export const getAllDiscountTokensController=async(req:Request,res:Response)=>{
  try {
    const discountTokens=await prisma.discountToken.findMany();
    res.status(200).json(discountTokens);
    return;
  } catch (error) {
    res.status(500).json({error:"Internal server error"});
    return;
  }
}   

export const updateDiscountTokenByIdController=async(req:Request,res:Response)=>{
  try {
    const {id}=req.params;
    const {token,discountPercentage,courseIds,expiresAt}=req.body;
    const discountToken=await prisma.discountToken.update({
      where:{id:Number(id)},
      data:{token,discountPercentage:Number(discountPercentage),courseIds,expiresAt:new Date(expiresAt)}
    })
    res.status(200).json(discountToken);
    return;
  } catch (error) {
    console.error("Error updating discount token:", error);
    res.status(500).json({error:"Internal server error"});
    return;
  }
}

export const deleteDiscountTokenByIdController=async(req:Request,res:Response)=>{
  try {
    const {id}=req.params;
    await prisma.discountToken.delete({
      where:{id:Number(id)}
    })
    res.status(200).json({message:"Discount token deleted successfully"});
    return;
  } catch (error) {
    console.error("Error deleting discount token:", error);
    res.status(500).json({error:"Internal server error"});
    return;
  }
}

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
