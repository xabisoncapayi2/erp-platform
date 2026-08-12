export interface AuthenticatedUser {
    userId: string;
    tenantId: string;
    email: string;
    roles: string[];
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
