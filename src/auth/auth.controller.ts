import { Controller, Post, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'Login user',
    })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully login.',
    })
    @ApiResponse({
        status: 401,
        description: 'Error finding user. Invalid username or password.',
    })
    @Post('login')
    @Redirect('/profile', 301)
    @UseGuards(LocalAuthGuard)
    async login(@Req() req, @Res() res: Response) {
        const cookie = await this.authService.login(req.user);
        await res.setHeader('Set-Cookie', cookie);

        req.session.user = req.user;

        if (req.session.returnTo) {
            res.redirect(req.session.returnTo);
        }
    }

    @ApiOperation({
        summary: 'Logout user',
    })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully logout.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. User is not authorized.',
    })
    @Post('logout')
    @Redirect('/entrance', 301)
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req, @Res() res: Response) {
        const cookie = await this.authService.logout();
        await res.setHeader('Set-Cookie', cookie);

        req.session.destroy();
    }
}