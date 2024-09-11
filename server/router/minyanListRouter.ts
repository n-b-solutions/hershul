import express, { Request, Response } from "express";
import MinyanListController from "../controller/minyanListController";
const MinyanListRouter = express.Router();

MinyanListRouter.get("/", (req: Request, res: Response) => {
    MinyanListController.get(req, res);
  });
  MinyanListRouter.get('/:id', (req: Request, res: Response) => {
    MinyanListController.getById(req, res);
  });
  MinyanListRouter.get('/getMinyanimByDateType/:dateType',(req:Request,res:Response)=>{
    MinyanListController.getByTypeDate(req,res);
  })
  MinyanListRouter.post('/', (req: Request, res: Response) => {
    MinyanListController.post(req, res);
  });
  
  MinyanListRouter.put('/:id', (req: Request, res: Response) => {
    MinyanListController.put(req, res);
  });
  
  MinyanListRouter.delete('/:id', (req: Request, res: Response) => {
    MinyanListController.delete(req, res);
  });
  

export default MinyanListRouter;