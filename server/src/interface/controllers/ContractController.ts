import { Request, Response } from 'express';
import { ContractService } from '../../application/services/ContractService';

export class ContractController {
    private contractService: ContractService;

    constructor({ contractService }: { contractService: ContractService }) {
        this.contractService = contractService;
    }

    createContract = async (req: Request, res: Response) => {
        try {
            const contract = await this.contractService.createContract(req.user!.id, req.body);
            res.status(201).json(contract);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getContractsByProject = async (req: Request, res: Response) => {
        try {
            const contracts = await this.contractService.getContractsByProject(
                req.params.projectId
            );
            res.json(contracts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    signContract = async (req: Request, res: Response) => {
        try {
            const { signature } = req.body;
            if (!signature) {
                return res.status(400).json({ error: 'Signature is required' });
            }
            const contract = await this.contractService.signContract(
                req.params.id,
                req.user!.id,
                signature
            );
            res.json(contract);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
