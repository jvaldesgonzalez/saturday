type DescriptionField = {
  header: string;
  body: string;
  inline: boolean;
};

export type RegisterBusinessDto = {
	userId: string;
	description:DescriptionField;
	aditionalBusinessData:DescriptionField[];
	place?:{
		name:string;
		address:string;
		longitude: string;
		latitude: string;
	}
}
