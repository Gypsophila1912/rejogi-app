export type JoinRequest = {
  token: string;
};

export type JoinResponse = {
  message: string;
  role: string;
};

export type MeResponse = {
  id: string;
  name: string;
  is_app_admin: boolean;
  circle_members: {
    role: string;
    circles: {
      id: string;
      name: string;
    };
  }[];
};
