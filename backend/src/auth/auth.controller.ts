import { Body, Controller, Post, Res, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day

interface AuthenticatedRequest extends Request {
    user: { userId: string; email: string; name: string };
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: AuthenticatedRequest) {
        return {
            user: {
                id: req.user.userId,
                email: req.user.email,
                name: req.user.name,
            },
        };
    }

    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.register(dto);
        this.setAuthCookie(res, result.accessToken);
        return { user: result.user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(dto);
        this.setAuthCookie(res, result.accessToken);
        return { user: result.user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        return { message: 'Logged out successfully' };
    }

    private setAuthCookie(res: Response, token: string) {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
        });
    }
}