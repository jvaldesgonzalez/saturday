export type CheckUserStatusByFacebookDto = {
  authToken: string;
  authProviderId: string;
};

export type CheckUserStatusByGoogleDto = {
  authToken: string;
};

export type LoginUserFacebooDto = {
  fcmToken: string;
} & CheckUserStatusByFacebookDto;
