import { SocialUser } from "@abacritt/angularx-social-login";
import { Token } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { TokenResponse } from "src/app/contracts/token/TokenResponse";
import { Create_User } from "src/app/contracts/user/Create_User";
import { User } from "src/app/entities/user";
import {
	CustomToastrService,
	ToastrMessageType,
	ToastrPosition,
} from "../../ui/customToastr/custom-toastr.service";
import { HttpClientService } from "../httpClient/http-client.service";

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(
		private httpClientService: HttpClientService,
		private toastrService: CustomToastrService
	) {}

	async create(user: User): Promise<Create_User> {
		const observable: Observable<Create_User | User> =
			this.httpClientService.post<Create_User | User>(
				{
					controller: "users",
				},
				user
			);
		return (await firstValueFrom(observable)) as Create_User;
	}

	async login(
		usernameOrEmail: string,
		password: string,
		callBackFunction?: () => void
	): Promise<any> {
		const observable: Observable<any | TokenResponse> =
			this.httpClientService.post<any | TokenResponse>(
				{
					controller: "users",
					action: "login",
				},
				{
					usernameOrEmail,
					password,
				}
			);

		const tokenResponse: TokenResponse = (await firstValueFrom(
			observable
		)) as TokenResponse;
		if (tokenResponse) {
			localStorage.setItem(
				"accessToken",
				tokenResponse.token.accessToken
			);

			this.toastrService.message("Success", "Success", {
				messageType: ToastrMessageType.Success,
				position: ToastrPosition.TopFullWidth,
			});
		}
		callBackFunction();
	}

	async googleLogin(
		user: SocialUser,
		callBackFunction?: () => void
	): Promise<any> {
		const observable: Observable<SocialUser | TokenResponse> =
			this.httpClientService.post<SocialUser | TokenResponse>(
				{
					action: "google-login",
					controller: "users",
				},
				user
			);

		const tokenResponse: TokenResponse = (await firstValueFrom(
			observable
		)) as TokenResponse;

		if (tokenResponse) {
			localStorage.setItem(
				"accessToken",
				tokenResponse.token.accessToken
			);

			this.toastrService.message("Logined with Google", "Success", {
				messageType: ToastrMessageType.Success,
				position: ToastrPosition.TopFullWidth,
			});
		}

		callBackFunction();
	}

	async facebookLogin(
		user: SocialUser,
		callBackFunction?: () => void
	): Promise<any> {
		const observable: Observable<SocialUser | TokenResponse> =
			this.httpClientService.post<SocialUser | TokenResponse>(
				{
					controller: "users",
					action: "facebook-login",
				},
				user
			);

		const tokenResponse: TokenResponse = (await firstValueFrom(
			observable
		)) as TokenResponse;

		if (tokenResponse) {
			localStorage.setItem(
				"accessToken",
				tokenResponse.token.accessToken
			);

			this.toastrService.message("Logined with Facebook", "Success", {
				messageType: ToastrMessageType.Success,
				position: ToastrPosition.TopFullWidth,
			});
		}
		callBackFunction();
	}
}
