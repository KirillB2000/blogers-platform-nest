import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    private readonly adminUsername = process.env.ADMIN_USERNAME;
    private readonly adminPassword = process.env.ADMIN_PASSWORD;
    
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        
        const headersAuth = request.headers['authorization']

        if (!headersAuth || typeof headersAuth !== 'string') {
            throw new UnauthorizedException('Unauthorized')
        }

        if(!headersAuth.startsWith('Basic ')) {
            throw new UnauthorizedException('Unauthorized')
        }

        const token = headersAuth.split(" ")[1]

        if(!token) {
            throw new UnauthorizedException('Unauthorized')
        }

        try {
            const credentials = Buffer.from(token, 'base64').toString('utf-8')
            const [username, password] = credentials.split(':')
            
            if (username !== this.adminUsername && password !== this.adminPassword) {
                throw new UnauthorizedException('Unauthorized')
            }
    
            return true
        } catch {
            throw new UnauthorizedException('Unauthorized')
        }
    }
}