type DescriptionField = {
  header: string;
  body: string;
  inline: boolean;
};

export type RegisterBusinessDto = {
  userId: string;
  phoneNumber: string;
  businessName: string;
  profileImage?: string;
  aditionalBusinessData: DescriptionField[];
  place?: {
    name: string;
    address: string;
    longitude: string;
    latitude: string;
  };
};
