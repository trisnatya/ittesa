import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        employees: {
            total: number;
            byStatus: {};
        };
        requests: {
            total: number;
            byStatus: {};
            byType: any[];
        };
        users: {
            total: number;
        };
        questions: {
            total: number;
            pending: number;
        };
    }>;
}
