export type AddAttentionTagDto = {
  eventId: string;
  tag: {
    title: string;
    color: string;
    description: string;
  };
};
