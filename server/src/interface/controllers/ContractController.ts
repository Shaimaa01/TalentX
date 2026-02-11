import { Request, Response, NextFunction } from 'express';
import { ContractService } from '../../application/services/ContractService';
import { ErrorApp } from '../../infrastructure/ErrorApp';

export class ContractController {
    private contractService: ContractService;

    constructor({ contractService }: { contractService: ContractService }) {
        this.contractService = contractService;
    }

    createContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contract = await this.contractService.createContract(req.user!.id, req.body);
            res.status(201).json(contract);
        } catch (error: any) {
            next(error);
        }
    };

    getContractsByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contracts = await this.contractService.getContractsByProject(
                req.params.projectId
            );
            res.json(contracts);
        } catch (error: any) {
            next(error);
        }
    };

    signContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { signature } = req.body;
            if (!signature) {
                return next(new ErrorApp('Signature is required', 400));
            }
            const contract = await this.contractService.signContract(
                req.params.id,
                req.user!.id,
                signature
            );
            res.json(contract);
        } catch (error: any) {
            next(error);
        }
    };
}
