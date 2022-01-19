export type CheckUserStatusByFacebookDto = {
  authToken: string;
  authProviderId: string;
};

export type CheckUserStatusByGoogleDto = {
  authToken: string;
};

export type CheckUserStatusByAppleDto = {
  authToken: string;
};

export type LoginUserFacebookDto = {
  fcmToken: string;
} & CheckUserStatusByFacebookDto;

export type LoginUserGoogleDto = {
  fcmToken: string;
} & CheckUserStatusByGoogleDto;

export type LoginUserAppleDto = LoginUserGoogleDto;
