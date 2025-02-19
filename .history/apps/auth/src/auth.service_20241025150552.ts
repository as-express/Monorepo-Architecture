import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'apps/user/src/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { signUp } from './dto/signup.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>,
  private jwt: JwtService,
  private http: HttpService) {}
  

  async signUp(data: signUp) {
    const isOldUser = this.http.post('http://localhost:8001/oldUser', data.email)
    if(isOldUser) {
      throw new BadRequestException('')
    }

    const hash = bcrypt.hashSync(data.password, 7)
    const fakeUser = new this.FakeUser({username: data.username, phone: data.phone, password: hash})

    await this.SmsService.sendSMS(data.phone)
    await fakeUser.save()
    return 'Go through Verify phone'
}

  async signIn(data: AuthDto) {
    const user = await this.User.findOne({phone: data.phone})
    if(!user) {
        throw new BadRequestException('User is not Authorized')
    }

    const isPassword = bcrypt.compareSync(data.password, user.password)
    if(!isPassword) {
        throw new BadRequestException('Password is not correct')
    }

    return await this.issueTokens(user.id)
}

async refresh(data: tokenDto) {
    try {
        const valid = await this.jwt.verifyAsync(data.refreshToken)
        await this.getUser(valid.id)

        return this.issueTokens(valid.id)
    } catch(error) {
      throw new BadRequestException('Token is not valid')
  }
}



  private async getUser(id: string) {
    const user = await this.User.findById(id)
    if(!user) {
        throw new BadRequestException('User is not found')
    }

    return user
  }

  private async issueTokens(userId: string) {
    const data = {id: userId}

    const refreshToken = this.jwt.sign(data, {
        expiresIn: '3d'
    })

    const accessToken = this.jwt.sign(data, {
        expiresIn: '1h'
    })

    return {refreshToken, accessToken}
}
}
